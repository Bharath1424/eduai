'use server';
/**
 * @fileOverview An AI tool to explain Python code snippets.
 *
 * - pythonCodeExplainer - A function that explains a given Python code snippet.
 * - PythonCodeExplainerInput - The input type for the pythonCodeExplainer function.
 * - PythonCodeExplainerOutput - The return type for the pythonCodeExplainer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PythonCodeExplainerInputSchema = z.object({
  code: z.string().describe('The Python code snippet to be explained.'),
});
export type PythonCodeExplainerInput = z.infer<typeof PythonCodeExplainerInputSchema>;

const PythonCodeExplainerOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the Python code.'),
});
export type PythonCodeExplainerOutput = z.infer<typeof PythonCodeExplainerOutputSchema>;

export async function pythonCodeExplainer(input: PythonCodeExplainerInput): Promise<PythonCodeExplainerOutput> {
  return pythonCodeExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pythonCodeExplainerPrompt',
  input: {schema: PythonCodeExplainerInputSchema},
  output: {schema: PythonCodeExplainerOutputSchema},
  prompt: `You are an expert Python programmer and an excellent teacher. Your task is to explain a given Python code snippet in a clear, concise, and easy-to-understand manner for a student.

Break down the code line-by-line or in logical blocks. Explain the purpose of the code, what each part does, and what the final output or result will be.

Python Code:
\'\'\'python
{{{code}}}
\'\'\'
`,
});

const pythonCodeExplainerFlow = ai.defineFlow(
  {
    name: 'pythonCodeExplainerFlow',
    inputSchema: PythonCodeExplainerInputSchema,
    outputSchema: PythonCodeExplainerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
