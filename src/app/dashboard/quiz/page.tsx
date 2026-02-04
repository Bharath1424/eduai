'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import * as Lucide from 'lucide-react';
import { CheckCircle, XCircle, PlusCircle, Loader2, Trash2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { quizGenerator } from '@/ai/flows/quiz-generator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { defaultTopics } from '@/lib/data';

const newTopicSchema = z.object({
    name: z.string().min(2, { message: "Topic name must be at least 2 characters." }),
    icon: z.string().min(1, { message: "Please select an icon." }),
});

const availableIcons = ['Calculator', 'Dna', 'Landmark', 'BookOpen', 'FlaskConical', 'Atom', 'Brain', 'Globe', 'Code', 'Palette', 'Music', 'Film', 'Trophy', 'Disc'];

type Topic = {
    id: string;
    name: string;
    icon: string;
    userId: string;
    isDefault?: boolean;
    defaultId?: string;
};

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
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const topicsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'topics');
    }, [user, firestore]);

    const { data: userTopics, isLoading: topicsLoading } = useCollection<Topic>(topicsQuery);
    
    const topics = useMemo(() => {
        const allTopics: Topic[] = [...(userTopics || [])];
        if (!topicsLoading && user) {
            const userTopicDefaultIds = userTopics?.map(t => t.defaultId).filter(Boolean) || [];

            defaultTopics.forEach(defaultTopic => {
                if (!userTopicDefaultIds.includes(defaultTopic.id)) {
                    allTopics.push({
                        ...defaultTopic,
                        id: defaultTopic.id,
                        userId: user.uid,
                        isDefault: true,
                        defaultId: defaultTopic.id,
                    });
                }
            });
        }
        return allTopics.sort((a, b) => a.name.localeCompare(b.name));
    }, [userTopics, topicsLoading, user]);

    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [quizFinished, setQuizFinished] = useState(false);
    const [isCreatingTopic, setIsCreatingTopic] = useState(false);
    const [openNewTopicDialog, setOpenNewTopicDialog] = useState(false);
    const [generatingTopicId, setGeneratingTopicId] = useState<string | null>(null);
    const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);

    const form = useForm<z.infer<typeof newTopicSchema>>({
        resolver: zodResolver(newTopicSchema),
        defaultValues: {
            name: "",
            icon: "",
        },
    });

    const handleCreateTopic = async (values: z.infer<typeof newTopicSchema>) => {
        if (!user || !topicsQuery) return;
        setIsCreatingTopic(true);
        try {
            await addDoc(topicsQuery, {
                name: values.name,
                icon: values.icon,
                userId: user.uid,
            });
            form.reset();
            setOpenNewTopicDialog(false);
        } catch (error) {
            console.error("Error creating topic:", error);
            // Optionally, show a toast notification for the error
        } finally {
            setIsCreatingTopic(false);
        }
    };

    const handleDeleteTopic = (topicId: string) => {
        if (!user || !firestore) return;
        const topicRef = doc(firestore, 'users', user.uid, 'topics', topicId);
        deleteDocumentNonBlocking(topicRef);
        toast({
            title: "Topic Deleted",
            description: "The topic has been successfully deleted.",
        });
        setTopicToDelete(null);
    };

    const startQuiz = async (topic: Topic) => {
        setGeneratingTopicId(topic.id);
        try {
             // If it's a default topic not yet in the user's collection, add it now non-blockingly.
            if (topic.isDefault && user && topicsQuery && !userTopics?.some(ut => ut.defaultId === topic.defaultId)) {
                addDoc(topicsQuery, {
                    name: topic.name,
                    icon: topic.icon,
                    userId: user.uid,
                    isDefault: true,
                    defaultId: topic.defaultId,
                });
            }

            const result = await quizGenerator({ topic: topic.name });
            if (!result.questions || result.questions.length === 0) {
                toast({
                    variant: "destructive",
                    title: 'Quiz Generation Failed',
                    description: `Could not generate a quiz for "${topic.name}". Please try another topic.`,
                });
                return;
            }
            setSelectedTopic(topic);
            setCurrentQuestions(result.questions);
            setCurrentQuestionIndex(0);
            setAnswers([]);
            setQuizFinished(false);
        } catch (error) {
            console.error("Error generating quiz:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate the quiz. Please check the console and try again later.",
            });
        } finally {
            setGeneratingTopicId(null);
        }
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
        setQuizFinished(false);
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
                        <div className='flex gap-2'>
                           <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
                                {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </Button>
                             <Button variant="outline" onClick={resetQuiz}>Back to Topics</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold font-headline">Generate a Quiz</h2>
                    <p className="text-muted-foreground">Select a topic to test your knowledge.</p>
                </div>
                <Dialog open={openNewTopicDialog} onOpenChange={setOpenNewTopicDialog}>
                    <DialogTrigger asChild>
                         <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Topic
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Quiz Topic</DialogTitle>
                            <DialogDescription>
                                Add a custom topic to your quiz library.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleCreateTopic)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Topic Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. European History" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Icon</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an icon" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableIcons.map(iconName => (
                                                        <SelectItem key={iconName} value={iconName}>
                                                            <div className="flex items-center gap-2">
                                                                <Icon name={iconName} />
                                                                <span>{iconName}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit" disabled={isCreatingTopic}>
                                        {isCreatingTopic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            
            {topicsLoading && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-40">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            )}

            {!topicsLoading && topics.length === 0 && (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">You haven't created any topics yet. Click "Create Topic" to get started!</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics?.map(topic => (
                    <Card 
                        key={topic.id} 
                        className={cn(
                            "hover:shadow-lg transition-shadow relative group",
                            generatingTopicId ? "cursor-not-allowed" : "cursor-pointer",
                            generatingTopicId && generatingTopicId !== topic.id && "opacity-50"
                        )}
                        onClick={() => !generatingTopicId && startQuiz(topic)}
                    >
                         {!topic.isDefault && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/10 hover:bg-destructive/20 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTopicToDelete(topic);
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        )}
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-40">
                            {generatingTopicId === topic.id ? (
                                <>
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <p className="mt-4 font-semibold text-lg">Generating Quiz...</p>
                                </>
                            ) : (
                                <>
                                    <Icon name={topic.icon} />
                                    <p className="mt-4 font-semibold text-lg">{topic.name}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={!!topicToDelete} onOpenChange={(open) => !open && setTopicToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the <strong>{topicToDelete?.name}</strong> topic.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (topicToDelete) {
                                    handleDeleteTopic(topicToDelete.id);
                                }
                            }}
                            className={buttonVariants({ variant: "destructive" })}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
