export interface Note {
    id: string
    category: string
    title: string
    content: string
    tags: string
    errors: number
    date: string
}

export interface Question {
    nid: string | null
    title: string
    options?: string[]
    answer: string
    myAnswer?: string  
    explanation: string
    status: 'notAnswered' | 'correct' | 'wrong'
    type: '选择题' | '填空题' | '判断题' | '翻译题'
    date: string | null
    answerDate: string | null
}

export interface Section {
    name: string
    questions: Question[]
}

export interface Message {
    role: 'user' | 'assistant' | 'system',
    content: string
}

export interface AIMessage {
    messages: Message[],
    stream: boolean,
    model: string,
    temperature: number,
    presence_penalty: number,
    frequency_penalty: number,
    top_p: number
}