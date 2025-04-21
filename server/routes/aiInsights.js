const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db/database');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST AI insights
router.post('/', async (req, res) => {
  try {
    const { expenses, income } = req.body;

    // validation
    if (!expenses || !income) {
      return res.status(400).json({ error: 'Missing expense or income data' });
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create financial prompt
    const prompt = `As a financial advisor, analyze this data:
    Expenses: ${JSON.stringify(expenses)}
    Income: ${JSON.stringify(income)}
    
    Analyze spending patterns, identify top expense categories, and give 2-3 specific tips to improve this financial situation. Use a friendly tone and keep responses under 200 words.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ insights: text });
  } catch (error) {
    console.error('AI Insights detailed error:', error.message, error.stack);
    console.error('Request data:', {
      expenses_length: expenses?.length,
      income_length: income?.length,
    });
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;
