import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Upload, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [showUpload, setShowUpload] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting from Tara
      setMessages([
        {
          role: "assistant",
          content: "Hello! I'm Tara, your AI lending assistant from Tata Capital. I can help you get pre-approved for a loan in minutes. How much would you like to borrow?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        },
      ]);

      // Check if salary slip is required
      // Show upload when backend indicates salary is required.
      // Some flows use currentStep='salary_required', others use nextAction='collect_salary'.
      if (data.currentStep === 'salary_required' || data.nextAction === 'collect_salary' || data.nextAction === 'collect_salary') {
        setShowUpload(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to send message. Please make sure the backend is running.");
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const salary = prompt("Please enter your monthly salary (e.g., 60000):");
      if (!salary) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);
      formData.append('salary', salary);

      const response = await fetch('http://localhost:8000/api/upload-salary', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast.success("Salary slip uploaded successfully!");
      setShowUpload(false);

      // Send a message to trigger underwriting
      sendMessage("I have uploaded my salary slip. Please proceed with my application.");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload salary slip. Please try again.");
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "eligibility":
        sendMessage("I want to check my eligibility");
        break;
      case "upload":
        fileInputRef.current?.click();
        break;
      case "download":
        toast.success("Sanction letter downloaded!");
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-card rounded-2xl shadow-2xl border-2 border-border flex flex-col animate-slide-in z-50">
      {/* Header */}
      <div className="gradient-primary p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground">
            T
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Tara</h3>
            <p className="text-xs text-primary-foreground/80">AI Lending Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {/* If assistant asks for salary slip, show upload button inline */}
                {showUpload && message.role === 'assistant' && (
                  <div className="mt-2 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-1" /> Upload Salary Slip
                    </Button>
                  </div>
                )}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-secondary-foreground" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
            onClick={() => handleQuickAction("eligibility")}
          >
            <FileText className="w-3 h-3 mr-1" />
            Check Eligibility
          </Badge>
          {showUpload && (
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-smooth"
              onClick={() => handleQuickAction("upload")}
            >
              <Upload className="w-3 h-3 mr-1" />
              Upload Salary Slip
            </Badge>
          )}
          {messages.some(m => m.content.includes("approved")) && (
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-smooth"
              onClick={() => handleQuickAction("download")}
            >
              <Download className="w-3 h-3 mr-1" />
              Download Letter
            </Badge>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
