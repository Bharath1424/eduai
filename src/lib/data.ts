export type QuizHistoryItem = {
  id: string;
  topic: string;
  score: number;
  total: number;
  date: string;
};

export type ChatSession = {
    id: string;
    title: string;
    date: string;
    messages: {
        sender: 'user' | 'ai';
        text: string;
    }[];
};

export const defaultTopics = [
  { id: 'algebra', name: 'Algebra', icon: 'Calculator' },
  { id: 'biology', name: 'Biology', icon: 'Dna' },
  { id: 'history', name: 'World History', icon: 'Landmark' },
  { id: 'literature', name: 'Literature', icon: 'BookOpen' },
  { id: 'chemistry', name: 'Chemistry', icon: 'FlaskConical' },
  { id: 'physics', name: 'Physics', icon: 'Atom' },
  { id: 'cricket', name: 'Cricket', icon: 'Trophy' },
];

export const quizHistory: QuizHistoryItem[] = [
  { id: '1', topic: 'Algebra', score: 8, total: 10, date: '2024-07-20' },
  { id: '2', topic: 'Biology', score: 9, total: 10, date: '2024-07-19' },
  { id: '3', topic: 'World History', score: 6, total: 10, date: '2024-07-18' },
];

export const chatHistory: ChatSession[] = [
    {
        id: '1',
        title: 'Photosynthesis Explained',
        date: '2024-07-20',
        messages: [
            { sender: 'user', text: 'Can you explain photosynthesis?' },
            { sender: 'ai', text: 'Of course! Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy...' }
        ]
    },
    {
        id: '2',
        title: 'Newton\'s Laws of Motion',
        date: '2024-07-19',
        messages: [
            { sender: 'user', text: 'What are Newton\'s laws of motion?' },
            { sender: 'ai', text: 'There are three laws of motion. The first law states that an object will remain at rest or in uniform motion...' }
        ]
    }
];
