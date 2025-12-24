import React from 'react';
import { Page, AnalysisResult } from '../types';
import { ArrowRightIcon, BriefcaseIcon, CheckCircleIcon, CodeBracketIcon, AcademicCapIcon, CertificateIcon, UploadIcon } from './icons';

interface AnalysisPageProps {
    setCurrentPage: (page: Page) => void;
    analysisResult: AnalysisResult | null;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ setCurrentPage, analysisResult }) => {
    if (!analysisResult) {
        return (
            <div className="text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold">No analysis data found.</h2>
                <button
                    onClick={() => setCurrentPage(Page.Upload)}
                    className="mt-4 px-6 py-2 bg-brand-orange rounded-lg"
                >
                    Start Over
                </button>
            </div>
        );
    }

    const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
        <div className="flex items-center gap-4 mb-4">
            {icon}
            <h3 className="text-2xl font-bold font-orbitron">{title}</h3>
        </div>
    );

    return (
        <div className="w-full max-w-5xl h-[90vh] flex flex-col animate-fade-in-up">
             <style>{`
                .analysis-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .analysis-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .analysis-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #FFA500, #FF4500);
                    border-radius: 10px;
                }
                .analysis-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #FFD700, #FFA500);
                }
                /* For Firefox */
                .analysis-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #FFA500 rgba(255, 255, 255, 0.1);
                }
            `}</style>

            <div className="text-center mb-8 flex-shrink-0">
                <div className="inline-block bg-gradient-to-br from-green-400 to-teal-500 p-4 rounded-full mb-4 shadow-lg">
                    <CheckCircleIcon className="w-16 h-16 text-white"/>
                </div>
                <h1 className="font-orbitron text-4xl md:text-5xl font-bold">Welcome, {analysisResult.name || 'User'}!</h1>
                <p className="text-lg text-gray-300 mt-2">Here's what MySelf understood about you.</p>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 overflow-y-auto analysis-scrollbar">
                
                <div className="md:col-span-2 space-y-4 p-6 bg-white/5 rounded-lg">
                    <SectionHeader icon={<div className="w-8 h-8"><BriefcaseIcon /></div>} title="Professional Summary" />
                    <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
                </div>
                
                <div className="space-y-4 p-6 bg-white/5 rounded-lg">
                    <SectionHeader icon={<div className="w-8 h-8"><CodeBracketIcon /></div>} title="Skills" />
                    <div className="flex flex-wrap gap-3">
                        {analysisResult.skills.map((skill, index) => (
                            <span key={index} className="px-4 py-2 bg-brand-purple/50 border border-brand-orange text-brand-gold rounded-full text-sm font-semibold">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 p-6 bg-white/5 rounded-lg">
                     <SectionHeader icon={<div className="w-8 h-8"><AcademicCapIcon /></div>} title="Education" />
                     <ul className="list-disc list-inside text-gray-300 space-y-2">
                        {analysisResult.education.map((edu, index) => <li key={index}>{edu}</li>)}
                    </ul>
                </div>

                <div className="md:col-span-2 space-y-4 p-6 bg-white/5 rounded-lg">
                    <SectionHeader icon={<div className="w-8 h-8"><BriefcaseIcon /></div>} title="Experience" />
                    <div className="space-y-6">
                        {analysisResult.experience.map((exp, index) => (
                            <div key={index} className="p-4 bg-black/20 rounded-lg border-l-4 border-brand-purple">
                                <h4 className="font-bold text-lg text-white">{exp.role}</h4>
                                <p className="font-semibold text-brand-orange">{exp.company}</p>
                                <p className="text-gray-400 text-sm mt-2">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {analysisResult.projects && analysisResult.projects.length > 0 && (
                    <div className="md:col-span-2 space-y-4 p-6 bg-white/5 rounded-lg">
                        <SectionHeader icon={<div className="w-8 h-8"><CodeBracketIcon /></div>} title="Projects" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {analysisResult.projects.map((proj, index) => (
                                <div key={index} className="p-4 bg-black/20 rounded-lg">
                                    <h4 className="font-bold text-lg text-brand-gold">{proj.title}</h4>
                                    <p className="text-gray-400 text-sm mt-1">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {analysisResult.certifications && analysisResult.certifications.length > 0 && (
                    <div className="md:col-span-2 space-y-4 p-6 bg-white/5 rounded-lg">
                        <SectionHeader icon={<div className="w-8 h-8"><CertificateIcon /></div>} title="Certifications" />
                        <div className="flex flex-wrap gap-3">
                            {analysisResult.certifications.map((cert, index) => (
                               <span key={index} className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-md text-sm font-medium border border-teal-500/50">{cert}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex-shrink-0 flex flex-col md:flex-row justify-center gap-6">
                 <button
                    onClick={() => setCurrentPage(Page.Chat)}
                    className="group w-full md:w-auto relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-brand-orange via-brand-red to-brand-purple rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-brand-orange/40"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-gold via-brand-orange to-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-3">
                        Go to Chat Assistant <ArrowRightIcon className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
                 <button
                    onClick={() => setCurrentPage(Page.Upload)}
                    className="group w-full md:w-auto relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-transparent border-2 border-brand-orange rounded-full transition-all duration-300 ease-in-out hover:bg-brand-orange/20 hover:scale-105 hover:shadow-2xl hover:shadow-brand-orange/30"
                >
                     <span className="relative flex items-center gap-3">
                        Upload New Resume <UploadIcon className="w-6 h-6" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AnalysisPage;
