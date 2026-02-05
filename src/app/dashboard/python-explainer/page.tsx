'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { pythonCodeExplainer } from '@/ai/flows/python-code-explainer';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PythonExplainerPage() {
    const [code, setCode] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleExplainCode = async () => {
        if (!code.trim()) {
            toast({
                variant: 'destructive',
                title: 'Empty Code',
                description: 'Please enter some Python code to explain.',
            });
            return;
        }

        setIsLoading(true);
        setExplanation('');

        try {
            const result = await pythonCodeExplainer({ code });
            setExplanation(result.explanation);
        } catch (error) {
            console.error("Error explaining code:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to get an explanation. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-3xl font-bold font-headline">Python Code Explainer</h2>
                <p className="text-muted-foreground">Get a clear explanation of any Python code snippet.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 flex-grow">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Your Code</CardTitle>
                        <CardDescription>Paste your Python code below.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <Textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="def hello_world():\n    print('Hello, World!')"
                            className="flex-grow resize-none font-mono text-sm"
                            disabled={isLoading}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleExplainCode} disabled={isLoading || !code.trim()}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Explaining...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Explain Code
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Explanation</CardTitle>
                        <CardDescription>The AI-powered explanation will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ScrollArea className="h-full">
                            {isLoading && !explanation && (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            )}
                            {explanation && (
                                <div className="p-1">
                                    <p className="text-sm whitespace-pre-wrap">{explanation}</p>
                                </div>
                            )}
                             {!isLoading && !explanation && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                    <Sparkles className="h-10 w-10 mb-4" />
                                    <p>Your code explanation will show up here.</p>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
