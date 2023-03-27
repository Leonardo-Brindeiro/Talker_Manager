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
// ajuda do meu amigo lucas e course ]
// https://app.betrybe.com/learn/course/5e938f69-6e32-43b3-9685-c936530fd326
// module/94d0e996-1827-4fbc-bc24-c99fb592925b/section/2ed87e4f-9049-4314-8091-8f71b1925cf6/day/4982a599-9832-419e-a96b-3fe1db634c3e/lesson/dd477b54-5e75-489c-aed9-537623abb326/solution
app.get('/talker/search', tokenn, async (req, res) => {
  const { q } = req.query;
  const newPalestr = JSON.parse(await
    fs.readFile(path.resolve(newdirectorio)));

    const indexx = newPalestr.filter((element) => element.name.includes(q));
  if (!indexx) {
    return res.status(200).json([]);
  }
  return res.status(200).json(indexx);
});

app.get('/talker', async (_req, res) => {
  const talker = JSON.parse(await fs.readFile(path.resolve(newdirectorio)));
  return res.status(200).json(talker);
});

app.get('/talker/:id', async (req, res) => { // AJUDA DO MEU AMIGO JHONATAS ANICEZIO
  const { id } = req.params;
  const talker = JSON.parse(await fs.readFile(path.resolve(newdirectorio)));
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
       fs.readFile(path.resolve(newdirectorio), 'utf-8'));
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
// https:// app.betrybe.com/learn/course/5e938f69-6e32-43b3-9685-c936530fd326/module/94d0e996-1827-4fbc-bc24-c99fb592925b/section/2ed87e4f-9049-4314-8091-8f71b1925cf6/day/4982a599-9832-419e-a96b-3fe1db634c3e/lesson/9caf3f05-59f1-4959-8f92-bfe0ff66f49c/solution
  app.put('/talker/:id', tokenn, namevalid, agevalid, talkval, validwatch, ratesVal, 
   async (req, res) => {   
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const newPalest = JSON.parse(await
      fs.readFile(path.resolve(newdirectorio)));
      const index = newPalest.findIndex((element) => element.id === Number(id));
      newPalest[index] = { id: Number(id), name, age, talk };
      await fs.writeFile(newdirectorio, JSON.stringify(newPalest)); 
      res.status(200).json(newPalest[index]);
  }); 
  
// https://app.betrybe.com/learn/course/5e938f69-6e32-43b3-9685-c936530fd326/module/94d0e996-1827-4fbc-bc24-c99fb592925b/section/2ed87e4f-9049-4314-8091-8f71b1925cf6/day/4982a599-9832-419e-a96b-3fe1db634c3e/lesson/9caf3f05-59f1-4959-8f92-bfe0ff66f49c/solution
  app.delete('/talker/:id', tokenn,  
   async (req, res) => {  
    const { id } = req.params;
     const newPalestt = JSON.parse(await
      fs.readFile(path.resolve(newdirectorio)));
      const index = newPalestt.filter((idp) => idp.id !== Number(id));
      await fs.writeFile(newdirectorio, JSON.stringify(index, null, 2)); 
     return res.status(204).json();
  }); // ajuda do meu amigo lucas mais course  

app.listen(PORT, () => {
  console.log('Online');
});//
