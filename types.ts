export enum Page {
    Home,
    Upload,
    Analysis,
    Chat,
}

export interface ChatMessage {
    sender: 'user' | 'assistant';
    text: string;
}

export interface Experience {
    role: string;
    company: string;
    description: string;
}

export interface Project {
    title: string;
    description: string;
}

export interface Contact {
    email: string;
}

export interface AnalysisResult {
    name: string;
    summary: string;
    skills: string[];
    experience: Experience[];
    education: string[];
    projects: Project[];
    certifications: string[];
    contact: Contact;
}
