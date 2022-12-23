 // ajuda do meu amigo jhonatan anicezio usei o stackoverflow para poder validar o email 
function emailv(req, res, next) {
    const { email } = req.body;
    const emailregex = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/;
       if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório',
      });
    }
    if (!emailregex.test(email)) {
      return res.status(400).json({
        message: 'O "email" deve ter o formato "email@email.com"',
      });
    }
    next();
  }
  
  module.exports = emailv; 