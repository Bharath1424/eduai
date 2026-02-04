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

export const quizQuestions = {
    algebra: [
        {
            question: "What is the value of x in the equation 2x + 3 = 7?",
            options: ["1", "2", "3", "4"],
            answer: "2"
        },
        {
            question: "Simplify the expression 3(x + 4) - 2x.",
            options: ["x + 12", "5x + 12", "x - 12", "x + 4"],
            answer: "x + 12"
        },
        {
            question: "If a rectangle has a length of 8 units and a width of 5 units, what is its area?",
            options: ["13 units", "26 units", "30 sq. units", "40 sq. units"],
            answer: "40 sq. units"
        }
    ],
    biology: [
        {
            question: "What is the powerhouse of the cell?",
            options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
            answer: "Mitochondrion"
        },
        {
            question: "Which of these is NOT a type of RNA?",
            options: ["mRNA", "tRNA", "rRNA", "dRNA"],
            answer: "dRNA"
        },
        {
            question: "How many chambers are in the human heart?",
            options: ["1", "2", "3", "4"],
            answer: "4"
        }
    ],
    history: [],
    literature: [],
    chemistry: [],
    physics: [],
};
