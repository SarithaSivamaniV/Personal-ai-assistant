import React from 'react';
import { Page } from '../types';
import { ArrowRightIcon } from './icons';

interface HomePageProps {
    setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    return (
        <div className="text-center flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <div className="mb-10">
                <h1 className="font-orbitron text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-brand-gold">
                    MySelf AI
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-2xl">
                    Your personal AI that truly understands you. Unlock your potential with deep profile analysis and intelligent conversation.
                </p>
            </div>
            
            <div className="flex justify-center">
                <button
                    onClick={() => setCurrentPage(Page.Upload)}
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-brand-orange via-brand-red to-brand-purple rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-brand-orange/40"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-gold via-brand-orange to-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-3">
                        Start Resume Analysis <ArrowRightIcon className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HomePage;