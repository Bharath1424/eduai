'use server';

/**
 * @fileOverview An AI chatbot assistant for students.
 *
 * - aiChatbotAssistant - A function that provides instant study help by answering questions and offering guidance.
 * - AIChatbotAssistantInput - The input type for the aiChatbotAssistant function.
 * - AIChatbotAssistantOutput - The return type for the aiChatbotAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotAssistantInputSchema = z.object({
  question: z.string().describe('The question asked by the student.'),
});
export type AIChatbotAssistantInput = z.infer<typeof AIChatbotAssistantInputSchema>;

const AIChatbotAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the student\'s question.'),
});
export type AIChatbotAssistantOutput = z.infer<typeof AIChatbotAssistantOutputSchema>;

export async function aiChatbotAssistant(input: AIChatbotAssistantInput): Promise<AIChatbotAssistantOutput> {
  return aiChatbotAssistantFlow(input);
}

const aiChatbotAssistantPrompt = ai.definePrompt({
  name: 'aiChatbotAssistantPrompt',
  input: {schema: AIChatbotAssistantInputSchema},
  output: {schema: AIChatbotAssistantOutputSchema},
  prompt: `You are an AI chatbot assistant designed to provide instant study help to students.

  Answer the following question to the best of your ability, offering guidance where appropriate:

  Question: {{{question}}}`,
});

const aiChatbotAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatbotAssistantFlow',
    inputSchema: AIChatbotAssistantInputSchema,
    outputSchema: AIChatbotAssistantOutputSchema,
  },
  async input => {
    const {output} = await aiChatbotAssistantPrompt(input);
    return output!;
  }
);
