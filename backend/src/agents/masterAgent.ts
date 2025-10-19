import Session from '../models/Session';
import { callGemini } from '../services/gemini';
import { verifyKYC } from './verificationAgent';
import { runUnderwriting } from './underwritingAgent';
import { generateSanction } from './sanctionAgent';

export async function orchestrate(sessionId: string, userMessage: string) {
  try {
    // Get or create session
    let session = await Session.findOne({ sessionId });
    
    if (!session) {
      session = new Session({
        sessionId,
        currentStep: 'initial',
        messages: [],
        auditLog: [],
      });
      await session.save();
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });
    await session.save();

    // Call Gemini for conversational response and next action
    const geminiResponse = await callGemini(session.messages, {
      currentStep: session.currentStep,
      kycVerified: session.kycVerified,
      requestedAmount: session.requestedAmount,
      tenure: session.tenure,
    });

    // Extract data from user message
    if (geminiResponse.extractedData) {
      if (geminiResponse.extractedData.amount) {
        session.requestedAmount = geminiResponse.extractedData.amount;
      }
      if (geminiResponse.extractedData.tenure) {
        session.tenure = geminiResponse.extractedData.tenure;
      }
    }

    let assistantReply = geminiResponse.reply;
    let nextStep = geminiResponse.nextAction;
    let additionalData: any = {};

    // Execute worker agents based on next action
    switch (nextStep) {
      case 'verify_kyc':
        if (geminiResponse.extractedData?.phone) {
          const verificationResult = await verifyKYC(sessionId, geminiResponse.extractedData.phone);
          if (verificationResult.success) {
            assistantReply += `\n\n${verificationResult.message} You're pre-approved for up to ₹${verificationResult.customer?.preApprovedLimit.toLocaleString('en-IN')}. Would you like to proceed with your loan application?`;
            additionalData.customer = verificationResult.customer;
            session.currentStep = 'kyc_verified';
          } else {
            assistantReply += `\n\n${verificationResult.message}`;
          }
        }
        break;

      case 'run_underwriting':
        if (session.customerId && session.requestedAmount) {
          const underwritingResult = await runUnderwriting(
            sessionId,
            session.customerId,
            session.requestedAmount,
            session.tenure || 12
          );

          if (underwritingResult.approved) {
            assistantReply = `🎉 Congratulations! ${underwritingResult.reason}\n\nYour loan details:\n- Amount: ₹${underwritingResult.sanctionDetails?.amount.toLocaleString('en-IN')}\n- Tenure: ${underwritingResult.sanctionDetails?.tenure} months\n- Interest Rate: ${underwritingResult.sanctionDetails?.interestRate}%\n- Monthly EMI: ₹${underwritingResult.sanctionDetails?.emi.toLocaleString('en-IN')}\n\nShall I generate your sanction letter?`;
            nextStep = 'generate_sanction';
            session.currentStep = 'approved';
          } else if (underwritingResult.requiresSalarySlip) {
            assistantReply = underwritingResult.reason;
            nextStep = 'collect_salary';
            session.currentStep = 'salary_required';
          } else {
            assistantReply = `😔 ${underwritingResult.reason}\n\nWould you like me to help you with an alternative option?`;
            session.currentStep = 'rejected';
          }
        }
        break;

      case 'generate_sanction':
        if (session.customerId && session.requestedAmount) {
          const result = await runUnderwriting(
            sessionId,
            session.customerId,
            session.requestedAmount,
            session.tenure || 12
          );

          if (result.approved && result.sanctionDetails) {
            const sanctionResult = await generateSanction(
              sessionId,
              session.customerId,
              result.sanctionDetails.amount,
              result.sanctionDetails.tenure,
              result.sanctionDetails.interestRate,
              result.sanctionDetails.emi
            );

            assistantReply = `✅ ${sanctionResult.message}\n\nYour sanction ID is: ${sanctionResult.sanctionId}\n\nYou can download your sanction letter using the button below.`;
            additionalData.sanctionId = sanctionResult.sanctionId;
            additionalData.downloadUrl = sanctionResult.downloadUrl;
            session.currentStep = 'completed';
          }
        }
        break;
    }

    // Add assistant message
    session.messages.push({
      role: 'assistant',
      content: assistantReply,
      timestamp: new Date(),
    });

    await session.save();

    return {
      reply: assistantReply,
      sessionId,
      currentStep: session.currentStep,
      nextAction: nextStep,
      ...additionalData,
    };
  } catch (error) {
    console.error('Master agent error:', error);
    throw error;
  }
}
