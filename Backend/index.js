require('dotenv').config();

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


const fetch = require('node-fetch'); // run: npm install node-fetch@2

app.post('/api/check-domain', async (req, res) => {
  const { domain } = req.body;

  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Please provide a domain.' });
  }

  try {
    const vtRes = await fetch(`https://www.virustotal.com/api/v3/domains/${domain}`, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY,
      },
    });

    if (!vtRes.ok) {
      return res.status(vtRes.status).json({ error: 'Could not find a report for that domain.' });
    }

    const data = await vtRes.json();
    const stats = data.data.attributes.last_analysis_stats;

    res.json({
      domain,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
      undetected: stats.undetected,
      totalVendors: stats.malicious + stats.suspicious + stats.harmless + stats.undetected,
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong checking that domain.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});