import React, { useState, useCallback } from 'react';
import { Page, AnalysisResult } from '../types';
import { ArrowLeftIcon, LinkedInIcon, UploadIcon, SparklesIcon } from './icons';
import { analyzeContent } from '../services/geminiService';

interface UploadPageProps {
    setCurrentPage: (page: Page) => void;
    setAnalysisResult: (result: AnalysisResult) => void;
    setAnalysisContext: (context: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // result is "data:mime/type;base64,..."
            // we need to strip the prefix
            const base64String = result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
};

const UploadPage: React.FC<UploadPageProps> = ({ setCurrentPage, setAnalysisResult, setAnalysisContext }) => {
    const [file, setFile] = useState<File | null>(null);
    const [linkedInUrl, setLinkedInUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0];
            setFile(uploadedFile);
            setFileName(uploadedFile.name);
            setLinkedInUrl('');
            setError('');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            setFileName(droppedFile.name);
            setLinkedInUrl('');
            setError('');
        }
    };
    
    const handleAnalysis = useCallback(async () => {
        if (!file && !linkedInUrl) {
            setError('Please upload a resume file or provide a LinkedIn URL.');
            return;
        }
        
        setError('');
        setIsAnalyzing(true);
        
        try {
            let result: AnalysisResult;
            if (file) {
                const base64Data = await fileToBase64(file);
                result = await analyzeContent({ 
                    fileData: {
                        mimeType: file.type,
                        data: base64Data
                    } 
                });
            } else {
                 result = await analyzeContent({ 
                    textContent: `Analyze this LinkedIn profile: ${linkedInUrl}`
                });
            }

            setAnalysisResult(result);
            setAnalysisContext(JSON.stringify(result, null, 2)); // Pass the full structured data
            setCurrentPage(Page.Analysis);

        } catch (err) {
            console.error('Analysis failed:', err);
            setError('Failed to analyze the document. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }

    }, [file, linkedInUrl, setCurrentPage, setAnalysisResult, setAnalysisContext]);

    return (
        <div className="w-full max-w-3xl animate-fade-in-up">
            <button onClick={() => setCurrentPage(Page.Home)} className="absolute top-8 right-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <ArrowLeftIcon className="w-5 h-5" /> Back to Home
            </button>
            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-brand-orange to-brand-purple">
                <div className="bg-brand-deep-purple/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">Upload Your Profile</h2>
                    <p className="text-gray-400 mb-8">Upload your resume (PDF recommended) or paste your LinkedIn profile to begin.</p>
                    
                    <label 
                        htmlFor="resume-upload"
                        className={`mb-6 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${fileName ? 'border-green-500 bg-green-500/10' : 'border-gray-500 hover:border-brand-orange hover:bg-brand-orange/10'}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-10 h-10 mb-3 text-gray-400"/>
                            {fileName ? (
                                <p className="font-semibold text-green-400">{fileName}</p>
                            ) : (
                                <>
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF, DOCX, or TXT (MAX. 5MB)</p>
                                </>
                            )}
                        </div>
                        <input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
                    </label>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-400 font-semibold">OR</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <div className="relative mb-8">
                        <LinkedInIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter your LinkedIn Profile URL"
                            value={linkedInUrl}
                            onChange={(e) => {
                                setLinkedInUrl(e.target.value);
                                setFile(null);
                                setFileName('');
                                setError('');
                            }}
                            className="w-full bg-black/30 border-2 border-gray-600 rounded-full py-4 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                        />
                    </div>
                    
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    
                    <button
                        onClick={handleAnalysis}
                        disabled={isAnalyzing}
                        className="group w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-brand-orange via-brand-red to-brand-purple rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-brand-orange/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-brand-gold via-brand-orange to-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center gap-3">
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Profile'}
                            {isAnalyzing ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-6 h-6" />}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
