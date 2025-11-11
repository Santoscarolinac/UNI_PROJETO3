import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { XIcon, SendIcon, SparklesIcon } from './icons/Icons';

interface ChatbotProps {
  onClose: () => void;
}

type Message = {
  role: 'user' | 'model';
  text: string;
};

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Initial message from the bot
    setMessages([
        {
            role: 'model',
            text: 'Olá! Sou o assistente da UNI-IA. Como posso ajudar você com suas dúvidas sobre Libras hoje?'
        }
    ]);
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || userInput;
    if (!textToSend.trim() || isLoading) return;

    const newUserMessage: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: textToSend,
            config: {
                systemInstruction: "Você é o UNI-IA, um assistente de IA amigável e especialista na Língua Brasileira de Sinais (Libras). Sua missão é educar os usuários sobre Libras. Responda perguntas sobre a história, gramática, cultura surda, sinais específicos e curiosidades. Mantenha as respostas claras, concisas e acessíveis. Se um usuário pedir para 'mostrar' um sinal, descreva o movimento da mão, a localização e a expressão facial em detalhes, pois você não pode gerar vídeos.",
            }
        });
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunkText };
            return [...prev.slice(0, -1), updatedLastMessage];
        });
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = { role: 'model', text: 'Desculpe, não consegui processar sua pergunta. Tente novamente.' };
       setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'model' && lastMessage.text === '') {
          return [...prev.slice(0, -1), errorMessage];
        } else {
          return [...prev, errorMessage];
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickQuestions = [
    "O que é Libras?",
    "Libras é universal?",
    "Como digo 'obrigado' em Libras?"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end sm:items-center z-50">
      <div className="bg-slate-800 w-full max-w-lg h-[90vh] sm:h-[70vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl animate-slide-up">
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Assistente UNI-IA</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
            <XIcon />
          </button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                {msg.role === 'model' && msg.text.length === 0 && isLoading && (
                    <div className="blinking-cursor"></div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>
        
        <div className="p-4 border-t border-slate-700">
            <div className="flex flex-wrap gap-2 mb-2">
                {messages.length <= 1 && quickQuestions.map(q => (
                    <button key={q} onClick={() => handleSendMessage(q)} className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-cyan-300 rounded-full transition-colors">
                        {q}
                    </button>
                ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Pergunte sobre Libras..."
                    className="flex-1 px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button type="submit" disabled={isLoading} className="p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:bg-slate-600 transition-colors">
                    <SendIcon />
                </button>
            </form>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 640px) {
            .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        }
        @media (min-width: 641px) {
            .animate-slide-up { 
                animation-name: slide-up;
                animation-duration: 0.3s;
                animation-timing-function: ease-out;
                animation-fill-mode: forwards;
             }
        }
        .blinking-cursor {
            display: inline-block;
            width: 8px;
            height: 1rem;
            background-color: #67e8f9; /* cyan-300 */
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            from, to { background-color: transparent }
            50% { background-color: #67e8f9; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
