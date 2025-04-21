const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const db = require('../db/database');