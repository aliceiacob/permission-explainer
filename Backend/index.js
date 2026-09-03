const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//Test server is alive
app.get('/', (req, res) => {
  res.send('Permission Explainer backend is running');
});

const permissions = require('./permissions.json');

//Returns list of permissions
app.get('/api/permissions', (req, res) => {
  res.json(permissions);
});

// Matches pasted permission text against known permissions list
app.post('/api/match', (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Please provide permission text.' });
  }

  const lowerText = text.toLowerCase();

  const matched = permissions.filter((perm) =>
    lowerText.includes(perm.name.toLowerCase())
  );

  res.json(matched);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});