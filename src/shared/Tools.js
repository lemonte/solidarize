
const jwt = require("jsonwebtoken");
const config = require('../../config.json');

class Tools {
  static removerCaracteres(str) {
    var text = str;
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text.toLowerCase();
  }

  static verifyJWT(req, res, next) {
    var secret = config.secret;
    const token = req.headers['x-access-token'];
    if (!token) return res.redirect("/login");

    jwt.verify(token, secret, function (err, decoded) {
      if (err) return res.redirect("/login");
      req.user = decoded.user;
      next();
    });
  }


  static equalsObject(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }

    return true;
  }


  static formatErros(error) {
    const errorMessages = {
      '23505': 'O registro já existe.',
      '42P01': 'A tabela não existe.',
      '42601': 'Erro ao executar a consulta. Verifique a sintaxe da sua consulta SQL.',
      '23502': 'Erro ao cadastrar. Preencha todos os campos obrigatórios.',
      '42883': 'Erro ao executar a consulta. O operador não está definido.',
    };
    if (error.code && errorMessages[error.code]) {
      const errorMessage = errorMessages[error.code];
      return errorMessage;
    } else {
      return error.message;
    }
  };


  static async bodyDefault(req, res, request) {
    res.setHeader("Content-Type", "application/json");
    try {
      const response = await request(req, res);
      return res.json({
        response: response,
        date: new Date().toGMTString(),
        version: "1.0.1"
      });
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Token Inválido' });
      }
      return res.status(400).send({
        message: Tools.formatErros(err)
      });
    }
  }
}
module.exports = Tools;