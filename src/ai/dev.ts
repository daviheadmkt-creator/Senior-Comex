import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-operational-report.ts';
import '@/ai/flows/classify-product-flow.ts';
import '@/ai/flows/validate-entity-flow.ts';
