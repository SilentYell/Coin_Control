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
const income = require('./routes/income');
const savingsGoalsRouter = require('./routes/savingsGoals');
const trophyRoutes = require('./routes/trophyRoutes');
const aiInsightsRouter = require('./routes/aiInsights');
const transactions = require('./routes/transactions');

const trophies = require('./routes/trophies');


const userTrophies = require('./routes/userTrophies');

// middleware
app.use(cors());
app.use(express.json()); // allows parsing JSON request bodies

// Get backend images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// use routes
app.use('/api', expenseRoutes);
app.use('/api', userRoutes);
app.use('/api', income(db));
app.use('/api', transactions(db));
app.use('/api', trophies(db));
app.use('/api/savings-goals', savingsGoalsRouter);
app.use('/api/trophies', trophyRoutes);
app.use('/api/user-trophies/', userTrophies);
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
