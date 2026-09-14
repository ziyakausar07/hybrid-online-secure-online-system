const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { JAVA_BACKEND_URL } = require('../config');

router.get('/election-status', async (req, res) => {
  try {
    const javaBackendUrl = `${JAVA_BACKEND_URL}/Message`;
    const response = await fetch(javaBackendUrl, { timeout: 10000 });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching election data from Java backend:', error.message);
    res.status(500).json({ error: 'Failed to fetch election data' });
  }
});

module.exports = router;