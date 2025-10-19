import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Not Loaded');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Cache the resolved model so we don't call ListModels on every request
let cachedModel: any | null = null;

async function resolveModel() {
  // If user set GEMINI_MODEL in env, prefer that
  const envModel = process.env.GEMINI_MODEL;
  if (envModel) {
    console.log('Using GEMINI_MODEL from env:', envModel);
    return genAI.getGenerativeModel({ model: envModel });
  }

  // Try to call ListModels endpoint to discover available models and
  // pick one that supports generateContent.
  try {
    const modelsResp: any = await listModels();
    const models = Array.isArray(modelsResp) ? modelsResp : modelsResp?.models || [];

    // Look for a model that advertises generateContent support
    let chosen: string | undefined;
    for (const m of models) {
      const name = m.name || m.model || m.id;
      const methods = m.supportedMethods || m.methods || m.supports;
      if (Array.isArray(methods) && methods.includes('generateContent')) {
        chosen = name;
        break;
      }
    }

    // Prefer gemini-like models if no explicit support flag found
    if (!chosen) {
      const prefer = ['gemini', 'bison', 'chat-bison', 'text-bison'];
      for (const p of prefer) {
        const found = models.find((m: any) => {
          const n = (m.name || m.model || m.id || '').toString().toLowerCase();
          return n.includes(p);
        });
        if (found) {
          chosen = found.name || found.model || found.id;
          break;
        }
      }
    }

    if (chosen) {
      console.log('Selected Gemini model from ListModels:', chosen);
      return genAI.getGenerativeModel({ model: chosen });
    }
  } catch (err) {
    console.warn('ListModels failed, will fallback to default model. Error:', err?.message || err);
  }

  // Default fallback: a known supported model for text generation.
  // The SDK will automatically prefix with 'models/' if needed.
  const fallback = process.env.GEMINI_DEFAULT_MODEL || 'text-bison-001';
  console.log('No GEMINI_MODEL set and ListModels unavailable; falling back to default model:', fallback);
  return genAI.getGenerativeModel({ model: fallback });
}

async function getModel() {
  if (cachedModel) return cachedModel;
  cachedModel = await resolveModel();
  return cachedModel;
}

// Simple ListModels implementation using the public REST endpoint
async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const url = `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ListModels failed: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json();
}

export interface GeminiResponse {
  reply: string;
  nextAction: 'collect_amount' | 'collect_phone' | 'verify_kyc' | 'collect_salary' | 'run_underwriting' | 'generate_sanction' | 'reject' | null;
  extractedData?: {
    amount?: number;
    phone?: string;
    tenure?: number;
  };
}

export async function callGemini(
  messages: Array<{ role: string; content: string }>,
  sessionContext: any
): Promise<GeminiResponse> {
  const systemPrompt = `You are Tara, an AI lending assistant for Tata Capital. You help customers get loans quickly.

Current session state:
- Step: ${sessionContext.currentStep}
- KYC Verified: ${sessionContext.kycVerified}
- Requested Amount: ${sessionContext.requestedAmount || 'Not set'}
- Tenure: ${sessionContext.tenure || 'Not set'}

Your tasks:
1. Greet warmly and ask for loan amount if not provided
2. Extract loan amount from user messages (look for numbers with "lakh" or "thousand")
3. Ask for phone number for verification
4. After KYC, explain the process
5. Request salary slip if needed
6. Congratulate on approval

CRITICAL: Respond with JSON in this format:
{
  "reply": "Your conversational response here",
  "nextAction": "collect_amount|collect_phone|verify_kyc|collect_salary|run_underwriting|generate_sanction|reject|null",
  "extractedData": {
    "amount": number or null,
    "phone": "phone number" or null,
    "tenure": number or null
  }
}

Be friendly, professional, and concise. Use Indian Rupee amounts (₹).`;

  const conversationHistory = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
  const prompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nRespond with JSON:`;

  try {
    const model = await getModel();
    const result = await model.generateContent(prompt);
    // generateContent returns { response }
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }

    // Fallback if no JSON
    return {
      reply: text,
      nextAction: null,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      reply: "I'm having trouble processing your request. Please try again.",
      nextAction: null,
    };
  }
}
