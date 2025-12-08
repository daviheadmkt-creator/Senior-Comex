
import { config } from 'dotenv';
config();

/**
 * This file is used to configure the Genkit development server.
 * It is not used in production.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { firebase } from '@genkit-ai/firebase';

export default genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
