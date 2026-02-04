import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { quizHistory, chatHistory } from '@/lib/data';
import { Bot, User } from 'lucide-react';

export default function HistoryPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-headline">Your History</h2>
                <p className="text-muted-foreground">Review your past quizzes and conversations.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Quiz History</CardTitle>
                    <CardDescription>All your completed quizzes in one place.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Topic</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizHistory.map((quiz) => (
                                <TableRow key={quiz.id}>
                                    <TableCell className="font-medium">{quiz.topic}</TableCell>
                                    <TableCell>{quiz.date}</TableCell>
                                    <TableCell className="text-right">{quiz.score} / {quiz.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Chat History</CardTitle>
                    <CardDescription>Revisit your conversations with the AI Tutor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {chatHistory.map((chat) => (
                            <AccordionItem value={chat.id} key={chat.id}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-4">
                                        <span>{chat.title}</span>
                                        <span className="text-sm text-muted-foreground">{chat.date}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                                        {chat.messages.map((message, index) => (
                                            <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                                {message.sender === 'ai' && <Bot className="h-5 w-5 text-primary flex-shrink-0"/>}
                                                <p className={`max-w-xl text-sm rounded-lg px-3 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                                                    {message.text}
                                                </p>
                                                {message.sender === 'user' && <User className="h-5 w-5 text-primary flex-shrink-0"/>}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
