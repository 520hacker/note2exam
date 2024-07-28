
import { defaultNotes } from './idata'
import { Note, Question, Message } from './models'
export function SaveNotes(notes: Note[]): void {
    localStorage.setItem("notes", JSON.stringify(notes));
}

export function LoadNotes(): Note[] {
    const notes = localStorage.getItem("notes");
    if (notes) {
        return JSON.parse(notes);
    }
    
    return defaultNotes();
}

export function SaveQuestions(questions: Question[]): void {
    localStorage.setItem("questions", JSON.stringify(questions));
}

export function LoadQuestions(): Question[] {
    const questions = localStorage.getItem("questions");
    if (questions) {
        return JSON.parse(questions);
    }

    return [];
}

export function SaveMessages(messages: Message[]): void {
    localStorage.setItem("messages", JSON.stringify(messages));
}

export function LoadMessages(): Message[] {
    const messages = localStorage.getItem("messages");
    if (messages) {
        return JSON.parse(messages);
    }

    return [];
}