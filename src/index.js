const express = require('express', 'readtalker');
const fs = require('fs').promises;
const path = require('path');

const app = express(); // essa função cria um servidor web http
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

app.get('/talker/:id', async (req, res) => { // AJUDA DO MEU AMIGO JHONATAS ANICEZIO
  const { id } = req.params;
  const talker = JSON.parse(await fs.readFile(path.resolve('./src/talker.json'), 'utf-8'));
  const talkerid = talker.find((e) => e.id === Number(id));  
  if (!talkerid) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(talkerid);
});

app.listen(PORT, () => {
  console.log('Online');
});// 
