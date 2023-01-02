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

const newdirectorio = path.resolve(__dirname, './talker.json');

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
     const { name, age, talk } = req.body; // vai pegar no meu arquivo json as propriedades 
     const newPalestrante = JSON.parse(await
       fs.readFile(path.resolve('./src/talker.json'), 'utf-8'));
   const palestrante = {
     id: newPalestrante[newPalestrante.length - 1].id + 1, // propriedades ajustadas 
     name,
     age,
     talk,
    };
    newPalestrante.push(palestrante);
            await fs.writeFile(newdirectorio, JSON.stringify(newPalestrante)); 
             return res.status(201).json(palestrante);
  });
// Os meus midlewares ja estão criados então é só mudar post para push 
  app.put('/talker/:id', tokenn, namevalid, agevalid, talkval, validwatch, ratesVal, 
   async (req, res) => {   
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const newPalest = JSON.parse(await
      fs.readFile(path.resolve('./src/talker.json'), 'utf-8'));
      const index = newPalest.findIndex((element) => element.id === Number(id));
      newPalest[index] = { id: Number(id), name, age, talk };
      await fs.writeFile(newdirectorio, JSON.stringify(newPalest)); 
      res.status(200).json(newPalest[index]);
  }); 
 
app.listen(PORT, () => {
  console.log('Online');
});//
