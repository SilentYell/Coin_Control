const express = require('express');
const router = express.Router();

// Mock user data
const mockUser = {
  user_id: 1,
  username: 'Demo User',
  current_balance: 1000.0,
};

// Route to get the mock user
router.get('/user', (req, res) => {
  res.json(mockUser);
});

module.exports = router;