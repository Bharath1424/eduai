'use server';
/**
 * @fileOverview A quiz generation AI agent.
 *
 * - quizGenerator - A function that generates a quiz on a given topic.
 * - QuizGeneratorInput - The input type for the quizGenerator function.
 * - QuizGeneratorOutput - The return type for the quizGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizGeneratorInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a quiz.'),
});
export type QuizGeneratorInput = z.infer<typeof QuizGeneratorInputSchema>;

const QuizQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    answer: z.string(),
});

const QuizGeneratorOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).min(3).max(5),
});
export type QuizGeneratorOutput = z.infer<typeof QuizGeneratorOutputSchema>;

export async function quizGenerator(input: QuizGeneratorInput): Promise<QuizGeneratorOutput> {
  return quizGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizGeneratorPrompt',
  input: {schema: QuizGeneratorInputSchema},
  output: {schema: QuizGeneratorOutputSchema},
  prompt: `You are an AI assistant that generates multiple-choice quizzes for students.

  Generate a quiz with 3 to 5 questions on the following topic: {{{topic}}}.

  Each question must have 4 options, and one correct answer. Make sure the answer is one of the options.
  Return the questions in the specified JSON format.
  `,
});

const quizGeneratorFlow = ai.defineFlow(
  {
    name: 'quizGeneratorFlow',
    inputSchema: QuizGeneratorInputSchema,
    outputSchema: QuizGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
