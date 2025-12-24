
import React, { useState } from 'react';
import { Page, AnalysisResult, ChatMessage } from './types';
import AnimatedBackground from './components/AnimatedBackground';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import AnalysisPage from './components/AnalysisPage';
import ChatPage from './components/ChatPage';
import Logo from './components/Logo';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [analysisContext, setAnalysisContext] = useState<string>('');

    const mainClass = currentPage === Page.Chat
        ? "relative z-10 flex flex-col items-center justify-start min-h-screen w-full"
        : "relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8";

    const renderPage = () => {
        switch (currentPage) {
            case Page.Home:
                return <HomePage setCurrentPage={setCurrentPage} />;
            case Page.Upload:
                return <UploadPage setCurrentPage={setCurrentPage} setAnalysisResult={setAnalysisResult} setAnalysisContext={setAnalysisContext} />;
            case Page.Analysis:
                return <AnalysisPage setCurrentPage={setCurrentPage} analysisResult={analysisResult} />;
            case Page.Chat:
                return <ChatPage setCurrentPage={setCurrentPage} chatHistory={chatHistory} setChatHistory={setChatHistory} analysisContext={analysisContext} />;
            default:
                return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };
    
    const showLogo = currentPage === Page.Home || currentPage === Page.Upload;

    return (
        <div className="relative min-h-screen w-full overflow-y-auto">
            <AnimatedBackground />
            <main className={mainClass}>
                {showLogo && (
                    <div className="absolute top-6 left-6 md:top-8 md:left-8">
                        <Logo />
                    </div>
                )}
                {renderPage()}
            </main>
        </div>
    );
};

export default App;