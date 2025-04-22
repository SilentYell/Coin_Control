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
    const userId = 1;

    // validation
    if (!expenses || !income) {
      return res.status(400).json({ error: 'Missing expense or income data' });
    }

    // Process data before sending to Gemini for better analysis
    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + Math.abs(Number(exp.amount || 0)),
      0
    );
    const totalIncome = income.reduce(
      (sum, inc) => sum + Number(inc.amount || 0),
      0
    );

    // Group expenses by category
    const categories = {};
    expenses.forEach((exp) => {
      const category = exp.category || 'Other';
      if (!categories[category]) categories[category] = 0;
      categories[category] += Math.abs(Number(exp.amount || 0));
    });

    // Get top categories sorted by amount
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: ((amount / totalExpenses) * 100).toFixed(1),
      }));

    // Fetch the user's savings goal
    const goalResult = await db.query(
      `SELECT * FROM SavingsGoals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    const goal = goalResult.rows[0];

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create financial prompt
    const prompt = `As a friendly financial advisor, provide personalized insights based on this data:

      SUMMARY:
      - Total Income: $${totalIncome.toFixed(2)}
      - Total Expenses: $${totalExpenses.toFixed(2)}
      - Available Balance: $${(totalIncome - totalExpenses).toFixed(2)}
      - Top spending categories: ${topCategories
            .map((c) => `${c.name} ($${c.amount.toFixed(2)}, ${c.percentage}%)`)
            .join(', ')}
      ${
        goal
          ? `- Savings Goal: ${goal.name} - $${goal.amount} (${
              goal.percent
            }% of income allocated)
      - Current Progress: $${goal.saved || 0} / $${goal.amount} (${
              goal.amount > 0
                ? Math.min((goal.saved / goal.amount) * 100, 100).toFixed(0)
                : 0
            }% complete)`
          : '- No active savings goal'
      }

      INSTRUCTIONS:
      1. Start with a brief unique greeting and ONE short unique financial wisdom quote
      2. Analyze spending patterns focusing on the top categories
      3. Provide exactly 3 specific, actionable tips to improve financial health
      4. Each tip should be directly related to the user's actual spending patterns
      5. Use a friendly, encouraging tone
      6. Include relevant emojis (money, savings, budget related)
      7. Please keep the entire response under 200 words

      Format your response in clear paragraphs with the tips as a numbered list.`;

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
