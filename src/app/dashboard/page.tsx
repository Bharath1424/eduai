import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, HelpCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { quizHistory, chatHistory } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline">Welcome back, John!</h2>
        <p className="text-muted-foreground">Here's a summary of your learning journey.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot /> AI Tutor
            </CardTitle>
            <CardDescription>Get instant help with your studies.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Ready to tackle a new concept? Our AI is here to guide you through any subject.</p>
          </CardContent>
          <CardFooter>
             <Button asChild>
              <Link href="/dashboard/chatbot">Start Chatting <ArrowRight className="ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle /> Custom Quizzes
            </CardTitle>
            <CardDescription>Test your knowledge and skills.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Create a personalized quiz to check your understanding of different topics.</p>
          </CardContent>
           <CardFooter>
            <Button asChild>
              <Link href="/dashboard/quiz">Generate a Quiz <ArrowRight className="ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
            <CardDescription>A look at your latest quiz performances.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizHistory.slice(0, 3).map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.topic}</TableCell>
                    <TableCell className="text-right">{quiz.score} / {quiz.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Chats</CardTitle>
            <CardDescription>Revisit your recent conversations with the AI tutor.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chatHistory.slice(0, 3).map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                   <div>
                    <p className="font-medium">{chat.title}</p>
                    <p className="text-sm text-muted-foreground">{chat.date}</p>
                   </div>
                   <Button variant="ghost" size="sm" asChild>
                     <Link href="/dashboard/history">View</Link>
                   </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
