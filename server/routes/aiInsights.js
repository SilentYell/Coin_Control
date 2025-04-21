const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const db = require('../db/database');

// Initialize OpenAI client and load key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST AI insights
router.post('/', async (req, res) => {
  try {
    const { expenses, income } = req.body;

    // validation
    if (!expenses || !income) {
      return res.status(400).json({ error: 'Missing expense or income data' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor helping users understand their spending patterns. Use a friendly tone and provide practical advice. Keep responses under 200 words.',
        },
        {
          role: 'user',
          content: `Here's my financial data: 
          Expenses: ${JSON.stringify(expenses)}
          Income: ${JSON.stringify(income)}
          Analyze my spending patterns, identify my top expense categories, and give me 2-3 specific tips to improve my financial situation.`,
        },
      ],
      temperature: 0.7,
    });

    res.json({ insights: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;
