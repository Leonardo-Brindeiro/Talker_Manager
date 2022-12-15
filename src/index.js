const express = require('express', 'readtalker');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => { 
  const talker = JSON.parse(await fs.readFile(path.resolve('./src/talker.json'), 'utf-8'));
  return res.status(200).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});
