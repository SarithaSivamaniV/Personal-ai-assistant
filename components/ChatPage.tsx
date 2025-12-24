
import React, { useState, useEffect, useRef } from 'react';
import { Page, ChatMessage } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon } from './icons';
import { createChat, sendMessageStream } from '../services/geminiService';
import { Chat } from '@google/genai';

interface ChatPageProps {
    setCurrentPage: (page: Page) => void;
    chatHistory: ChatMessage[];
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    analysisContext: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ setCurrentPage, chatHistory, setChatHistory, analysisContext }) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = async () => {
            if (!chatSessionRef.current) {
                const systemInstruction = `You are my real-time personal AI assistant.
You must answer every question naturally, confidently, and professionally—just like I would answer during an interview.
Follow these rules strictly:

1. Real-time understanding
When I ask something (example: ‘kpr’), check the uploaded data silently in the background.
If related information exists → give a clear, confident, interview-style answer using that information.

2. If information does NOT exist
Do NOT say:
  - “not found”
  - “not available”
  - “not in resume”
  - “I couldn’t locate”
  - “error”
Instead give a smooth, human response that keeps the conversation going, for example:
“Could you tell me a bit more about that? I’ll help you with a perfect answer.”
or
“Sure, I can help you with that. What does KPR refer to in your context?”

3. Human-like interview tone
Every answer should sound like a confident person speaking in an interview.
Natural, simple, and professional language.
Avoid robotic or technical tone.

4. No system or technical messages
Do not mention the resume, database, or uploaded files.
Just answer smoothly like a human conversation.

5. Facts only when available
If the uploaded data contains the answer → use it.
If not → gently ask for more details without revealing that your answer is missing.
---
The user's profile information is below. Use it to answer their questions based on all the rules above.
${analysisContext || "No profile information has been provided."}
---`;

                chatSessionRef.current = createChat(systemInstruction);
                
                if (chatHistory.length === 0) {
                   setIsTyping(true);
                   const greeting = 'Hello,\nwhat would you like to start with today?';
                   
                   // Simulate streaming for the initial greeting
                   let streamedText = '';
                   setChatHistory([{ sender: 'assistant', text: '' }]);
                   const interval = setInterval(() => {
                       streamedText = greeting.substring(0, streamedText.length + 1);
                       setChatHistory([{ sender: 'assistant', text: streamedText }]);
                       if (streamedText.length === greeting.length) {
                           clearInterval(interval);
                           setIsTyping(false);
                       }
                   }, 20);
                }
            }
        };
        initializeChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analysisContext]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping]);
    
    const handleSend = async () => {
        if (input.trim() === '' || isTyping) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setChatHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        
        const assistantMessage: ChatMessage = { sender: 'assistant', text: '' };
        setChatHistory(prev => [...prev, assistantMessage]);

        try {
            if (!chatSessionRef.current) throw new Error("Chat session not initialized.");
            
            const stream = await sendMessageStream(chatSessionRef.current, input);
            
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { sender: 'assistant', text: fullResponse };
                    return newHistory;
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { sender: 'assistant', text: 'Sorry, something went wrong.' };
                return newHistory;
            });
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="w-full h-screen max-w-4xl flex flex-col bg-black/30 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up">
            <style>{`
                .chat-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .chat-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .chat-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 165, 0, 0.5);
                    border-radius: 10px;
                }
                .chat-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 165, 0, 0.8);
                }
                /* For Firefox */
                .chat-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 165, 0, 0.5) rgba(255, 255, 255, 0.1);
                }
            `}</style>
            <header className="flex items-center justify-between p-4 border-b border-white/10 relative z-10">
                <button onClick={() => setCurrentPage(Page.Home)} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" /> Back
                </button>
                <h1 className="font-orbitron text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-orange">
                    MySelf Chat Assistant
                </h1>
                <div className="w-16"></div>
            </header>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6 chat-scrollbar">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'assistant' && (
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-purple flex-shrink-0"></div>
                        )}
                         <div className={`max-w-md md:max-w-lg p-4 rounded-3xl ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-600 rounded-br-lg' : 'bg-gradient-to-br from-brand-deep-purple to-brand-purple rounded-bl-lg'}`}>
                            <p className="text-white whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && chatHistory.length > 0 && chatHistory[chatHistory.length -1].sender === 'user' && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-purple flex-shrink-0"></div>
                        <div className="p-4 rounded-3xl rounded-bl-lg bg-gradient-to-br from-brand-deep-purple to-brand-purple">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-2.5 h-2.5 bg-brand-gold rounded-full animate-typing-bubble" style={{animationDelay: '0s'}}></div>
                                <div className="w-2.5 h-2.5 bg-brand-gold rounded-full animate-typing-bubble" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2.5 h-2.5 bg-brand-gold rounded-full animate-typing-bubble" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black/20 border-t border-white/10">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message here..."
                        className="w-full bg-black/30 border-2 border-gray-600 rounded-full py-4 pl-6 pr-16 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-brand-orange to-brand-red rounded-full text-white transition-transform duration-200 hover:scale-110 disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;