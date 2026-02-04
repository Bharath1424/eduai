'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { topics, quizQuestions } from '@/lib/data';
import * as Lucide from 'lucide-react';
import { CheckCircle, XCircle } from 'lucide-react';

type Topic = (typeof topics)[0];
type QuizQuestion = {
    question: string;
    options: string[];
    answer: string;
};
type Answer = {
    question: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
};

const Icon = ({ name }: { name: string }) => {
    const LucideIcon = Lucide[name as keyof typeof Lucide] as React.ElementType;
    return LucideIcon ? <LucideIcon className="w-10 h-10 text-primary" /> : <Lucide.HelpCircle className="w-10 h-10 text-primary" />;
};

export default function QuizPage() {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [quizFinished, setQuizFinished] = useState(false);

    const startQuiz = (topic: Topic) => {
        const questions = quizQuestions[topic.id as keyof typeof quizQuestions] || [];
        if (questions.length === 0) {
            alert("No questions available for this topic yet. Please select another topic.");
            return;
        }
        setSelectedTopic(topic);
        setCurrentQuestions(questions);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setQuizFinished(false);
    };

    const handleNextQuestion = () => {
        const isCorrect = selectedAnswer === currentQuestions[currentQuestionIndex].answer;
        const newAnswers = [...answers, {
            question: currentQuestions[currentQuestionIndex].question,
            selected: selectedAnswer,
            correct: currentQuestions[currentQuestionIndex].answer,
            isCorrect: isCorrect,
        }];
        setAnswers(newAnswers);

        setSelectedAnswer('');
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
        }
    };

    const resetQuiz = () => {
        setSelectedTopic(null);
        setCurrentQuestions([]);
    };
    
    const score = answers.filter(a => a.isCorrect).length;

    if (quizFinished) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Quiz Results for {selectedTopic?.name}</CardTitle>
                    <CardDescription>You scored {score} out of {currentQuestions.length}!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {answers.map((ans, index) => (
                            <div key={index} className="p-4 rounded-lg border">
                                <p className="font-semibold">{index+1}. {ans.question}</p>
                                <p className={`mt-2 flex items-center gap-2 ${ans.isCorrect ? 'text-[hsl(var(--chart-2))]' : 'text-destructive'}`}>
                                    {ans.isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                    Your answer: {ans.selected}
                                </p>
                                {!ans.isCorrect && (
                                    <p className="mt-1 text-[hsl(var(--chart-2))]">Correct answer: {ans.correct}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button onClick={resetQuiz} className="mt-6">Choose another topic</Button>
                </CardContent>
            </Card>
        );
    }
    
    if (selectedTopic) {
        const currentQuestion = currentQuestions[currentQuestionIndex];
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{selectedTopic.name} Quiz</CardTitle>
                    <CardDescription>Question {currentQuestionIndex + 1} of {currentQuestions.length}</CardDescription>
                    <Progress value={((currentQuestionIndex + 1) / currentQuestions.length) * 100} className="mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <p className="text-lg font-semibold">{currentQuestion.question}</p>
                        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                                    <RadioGroupItem value={option} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
                            {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold font-headline">Generate a Quiz</h2>
                <p className="text-muted-foreground">Select a topic to test your knowledge.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map(topic => (
                    <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startQuiz(topic)}>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Icon name={topic.icon} />
                            <p className="mt-4 font-semibold text-lg">{topic.name}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
