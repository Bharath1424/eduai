import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';
import { ArrowRight, BookOpen, Bot, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up Free <ArrowRight className="ml-2" /></Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-headline">
                Your Personal AI Study Companion
              </h1>
              <p className="text-lg text-muted-foreground">
                EduAI provides instant study help, customizable quizzes, and progress tracking to supercharge your learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started For Free <ArrowRight className="ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={1200}
                  height={800}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold font-headline">Features to Elevate Your Learning</h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to study smarter, not harder.
              </p>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">AI Chatbot Assistant</h3>
                <p className="mt-2 text-muted-foreground">
                  Get instant answers and guidance on any topic from our friendly AI tutor.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <HelpCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Custom Quizzes</h3>
                <p className="mt-2 text-muted-foreground">
                  Test your knowledge with quizzes generated on topics of your choice.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Progress Tracking</h3>
                <p className="mt-2 text-muted-foreground">
                  Monitor your quiz history and chat interactions on your personal dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EduAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
