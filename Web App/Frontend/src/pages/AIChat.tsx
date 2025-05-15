import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Camera, 
  X, 
  Mic, 
  Image as ImageIcon,
  Paperclip,
  Smile,
  MoreHorizontal
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  attachment?: {
    type: 'image' | 'video';
    url: string;
  };
}

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI health assistant. How can I help you today?',
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // New state for LLM configuration
  const [modelConfig, setModelConfig] = useState({
    endpoint: 'http://localhost:11434/api/generate',
    model: 'llama3.2',
    systemPrompt: `You are a helpful AI health assistant designed to provide general health and medicine-related information. 
  
                  Your responsibilities include:
                  
                  - Answering only queries related to health, wellness, and medicine.
                  - Providing general information and guidance, not personalized medical diagnoses or treatments.
                  - Ignoring or politely declining to respond to any non-health or non-medicine-related questions.
                  
                  Important Notes:
                  
                  - You will not provide emergency medical advice.
                  - Response should be short and to the point.
                  - Your responses must be clear, concise, and based on widely accepted health knowledge and practices.`
  });
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const image = canvas.toDataURL('image/jpeg');
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'user',
        content: '',
        timestamp: new Date(),
        status: 'sent',
        attachment: {
          type: 'image',
          url: image
        }
      }]);
      
      stopCamera();
    }
  };

  // Function to get response from local LLM via Ollama
  const getResponseFromLocalLLM = async (userMessage) => {
    try {
      // Prepare conversation history for context
      const conversationHistory = messages
        .map(msg => `${msg.type === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const response = await fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelConfig.model,
          prompt: `${modelConfig.systemPrompt}\n\n${conversationHistory}\nHuman: ${userMessage}\nAssistant:`,
          stream: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('Error fetching from local LLM:', error);
      return "Sorry, I encountered an error connecting to the local AI service. Make sure Ollama is running and the model is loaded.";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !showCamera) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Get response from local LLM
      const llmResponse = await getResponseFromLocalLLM(message);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: llmResponse,
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error in AI response:', error);
      
      // Fallback response in case of error
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please make sure your local LLM service is running correctly.',
        timestamp: new Date(),
        status: 'error'
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                  <Bot className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Health Assistant
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Using {modelConfig.model} locally
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-4 space-y-4"
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start gap-3 ${
                    msg.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.type === 'user' 
                      ? 'bg-emerald-500' 
                      : 'bg-blue-500'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[80%] space-y-1 ${
                    msg.type === 'user' ? 'items-end' : 'items-start'
                  }`}>
                    {msg.attachment && (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={msg.attachment.url} 
                          alt="Attachment" 
                          className="max-w-sm rounded-lg"
                        />
                      </div>
                    )}
                    {msg.content && (
                      <div className={`rounded-2xl p-4 ${
                        msg.type === 'user'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        {msg.content}
                      </div>
                    )}
                    <div className={`text-xs text-gray-500 ${
                      msg.type === 'user' ? 'text-right' : ''
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
              >
                <Bot className="w-5 h-5" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Camera View */}
          <AnimatePresence>
            {showCamera && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="relative border-t dark:border-gray-700"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={captureImage}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input */}
          <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-end gap-4">
              <div className="flex gap-2">
                <button
                  onClick={startCamera}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  rows={1}
                />
                <button className="absolute right-2 bottom-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() && !showCamera}
                className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIChat;