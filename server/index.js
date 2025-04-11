const express = require('express');
const cors = require('cors'); // install cors: npm install cors
const app = express();
const port = 3000;

// import routes
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');

// middleware
app.use(cors());
app.use(express.json()); // allows parsing JSON request bodies

// use routes
app.use('/api', expenseRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Coin Control backend!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
