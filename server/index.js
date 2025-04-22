const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env.development') }); // load environment variables
const express = require('express');
const cors = require('cors'); // install cors: npm install cors


const app = express();
const port = 3000;

// Require db configuration
const db = require('./db/database')

// import routes
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const income = require('./routes/income')
const savingsGoalsRouter = require('./routes/savingsGoals');
const aiInsightsRouter = require('./routes/aiInsights');
const transactions = require('./routes/transactions');

// middleware
app.use(cors());
app.use(express.json()); // allows parsing JSON request bodies

// use routes
app.use('/api', expenseRoutes);
app.use('/api', userRoutes);
app.use('/api', income(db));
app.use('/api', transactions(db));
app.use('/api/savings-goals', savingsGoalsRouter);
app.use('/api/ai-insights', aiInsightsRouter);


app.get('/', (req, res) => {
  res.send('Hello from Coin Control backend!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
