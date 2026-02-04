'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { aiChatbotAssistant } from '@/ai/flows/ai-chatbot-assistant';
import { reasoningToolForSupportingFacts } from '@/ai/flows/reasoning-tool-supporting-facts';
import { useToast } from '@/hooks/use-toast';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSendMessage = useCallback(async (currentInput: string) => {
        if (!currentInput.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: currentInput };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // 1. Get initial response
            const initialResponse = await aiChatbotAssistant({ question: currentInput });

            // 2. Enhance with reasoning tool
            const enhancedResponse = await reasoningToolForSupportingFacts({
                query: currentInput,
                chatbotResponse: initialResponse.answer,
            });

            const assistantMessage: Message = { role: 'assistant', content: enhancedResponse.enhancedResponse };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to get a response from the AI assistant. Please try again.',
            });
            // remove user message on error
             setMessages(prev => prev.filter(m => m !== userMessage));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, toast]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
        setInput('');
    };

    return (
        <div className="h-full flex flex-col">
            <Card className="flex-grow flex flex-col">
                <CardContent className="flex-grow p-0 flex flex-col">
                    <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground pt-16">
                                    <Bot className="mx-auto h-12 w-12" />
                                    <h3 className="mt-4 text-lg font-medium">Hello! How can I help you study today?</h3>
                                    <p className="text-sm">Ask me anything about your subjects.</p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                    {message.role === 'assistant' && (
                                        <Avatar>
                                            <AvatarFallback><Bot /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`max-w-xl rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                    {message.role === 'user' && (
                                        <Avatar>
                                            <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" />
                                            <AvatarFallback>
                                                <User />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-xl rounded-lg p-3 bg-muted">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question here..."
                                className="min-h-0 h-10 resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
