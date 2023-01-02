const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const emailv = require('./midlewares/emailv');
const passwordv = require('./midlewares/passwordV');
const tokenn = require('./midlewares/tokenn');
const namevalid = require('./midlewares/namevalid');
const agevalid = require('./midlewares/agevalid');
const talkval = require('./midlewares/talkval');
const ratesVal = require('./midlewares/ratesval');
const validwatch = require('./midlewares/validwatch');

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

app.post('/login', emailv, passwordv, (req, res) => { // resolvi usar a biblioteca require e chamar o crypto, ultilizei uma constante de token pra depois ultilizar a minha biblioteca
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token }); // {token} serve para eu poder chamar como string
});

app.post('/talker', tokenn, namevalid, agevalid, talkval, validwatch, ratesVal, 
   async (req, res) => {
    const newPalestrante = await fs.readFile(path.resolve('./src/talker.json'));
   const { name, age, talk } = req.body; // vai pegar no meu arquivo json as propriedades 
   const palestrante = {
     id: newPalestrante[newPalestrante.length - 1].id + 1, // vai  
     name,
     age,
     talk,
    };
    newPalestrante.push(palestrante);
    const updatePalestrante = JSON.stringify([...newPalestrante, palestrante]);
          fs.writeFile(path.resolve('./src/talker.json'), updatePalestrante);
        const novoPalestrante = newPalestrante[newPalestrante];
        return res.status(201).json(novoPalestrante);
  });

app.listen(PORT, () => {
  console.log('Online');
});//
