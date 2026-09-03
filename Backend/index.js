const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Test route — confirms the server is alive
app.get('/', (req, res) => {
  res.send('Permission Explainer backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});