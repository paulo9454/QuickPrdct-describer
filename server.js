import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Configuration, OpenAIApi } from 'openai';

// Load environment variables
dotenv.config();

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define the generate route
app.post('/generate', async (req, res) => {
  const { productName, keywords } = req.body;

  try {
    const prompt = `Write a compelling product description for "${productName}" using keywords: ${keywords}.`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 100,
    });

    res.json({ description: completion.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error from OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate product description' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to QuickPrdct-describer API. Use POST /generate to get product descriptions.');
});

// Start server
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});

