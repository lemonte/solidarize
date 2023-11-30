const { Router } = require("express");
const Tools = require("./shared/Tools");
const Ongs = require("./controllers/ongs");
const Likes = require("./controllers/likes");
const Users = require("./controllers/user");
const Posts = require("./controllers/posts");
const path = require('path');
const fs = require('fs');
const Voluntary = require("./controllers/voluntary");
const AutenticationController = require("./controllers/autentication");
const { initDatabase } = require("./databases/bd_controller");

try {
  initDatabase();
} catch (e) {

}


const ongs = new Ongs();
const likes = new Likes();
const users = new Users();
const autentication = new AutenticationController();
const posts = new Posts();
const voluntary = new Voluntary();

const router = Router()
  .get('/ong', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      return await ongs.getAll();
    });
  })
  .get('/usuario', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      if (Tools.equalsObject(req.query, {}) || req.query == null || req.query.toString().length == 0) {
        const user = req.user;
        req.query.id = user.id_usuario;
      }
      return await users.getAll(req.query);
    })
  })
  .get('/post', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      if (Tools.equalsObject(req.query, {}) || req.query == null || req.query.toString().length == 0) {
        const user = req.user;
        req.query.id = user.id_usuario;
      }
      return await posts.getAll(req.query);
    })
  })
  .get('/curtidas', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      return await likes.getAll();
    })
  })
  .get('/voluntario', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      return await voluntary.getAll();
    })
  })


  .post('/usuario', async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      const user = await users.add(req.body);
      if (req.body.tipoCadastro === 'Voluntario') {
        await voluntary.add({
          id_voluntario: user[0].id_usuario
        });
      }
      const data = await autentication.login(user[0]);
      return data;
    })
  })

  .put('/usuario', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      const user = req.user;
      req.body.id = user.id_usuario;
      const result = await users.updateUser(req.body);
      return result;
    })
  })
  .post('/login', async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      return await autentication.login(req.body);
    })
  })

  .get('/', async function (req, res) {
    return res.redirect("/login");
  })
  .post('/post', Tools.verifyJWT, async function (req, res) {
    const user = req.user;
    req.body.id_usuario = user.id_usuario;
    return await Tools.bodyDefault(req, res, async function () {
      return await posts.add(req.body);
    })
  })
  .post('/ong', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      const user = req.user;
      req.body.id_ong = user.id_usuario;
      return await ongs.add(req.body);
    })
  })
  .post('/curtidas', Tools.verifyJWT, async function (req, res) {
    const user = req.user;
    req.body.id_usuario = user.id_usuario;
    return await Tools.bodyDefault(req, res, async function () {
      return await likes.add(req.body);
    })
  })
  .delete('/curtidas', Tools.verifyJWT, async function (req, res) {
    const user = req.user;
    req.body.id_usuario = user.id_usuario;
    return await Tools.bodyDefault(req, res, async function () {
      return await likes.delete(req.body);
    })
  })
  .post('/voluntario', Tools.verifyJWT, async function (req, res) {
    const user = req.user;
    req.body.id_voluntario = user.id_usuario;
    return await Tools.bodyDefault(req, res, async function () {
      return await voluntary.add(req.body);
    })
  })

  .post('/refresh_token', Tools.verifyJWT, async function (req, res) {
    return await Tools.bodyDefault(req, res, async function () {
      return await autentication.refreshToken(req);
    })
  })

  .get('/feed', function (req, res) {
    const indexPath = path.join(__dirname, 'pages', 'feed', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo HTML');
      } else {
        res.send(data); // Envia o conteúdo HTML como resposta
      }
    });
  })

  .get('/cadastro-ong', function (req, res) {
    const indexPath = path.join(__dirname, 'pages', 'cadastro_ong', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo HTML');
      } else {
        res.send(data); // Envia o conteúdo HTML como resposta
      }
    });
  })

  .get('/perfil', function (req, res) {
    const indexPath = path.join(__dirname, 'pages', 'perfil', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo HTML');
      } else {
        res.send(data); // Envia o conteúdo HTML como resposta
      }
    });
  })
  .get('/login', function (req, res) {
    const indexPath = path.join(__dirname, 'pages', 'login', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo HTML');
      } else {
        res.send(data); // Envia o conteúdo HTML como resposta
      }
    });
  })
  .get('/cadastro-usuario', function (req, res) {
    const indexPath = path.join(__dirname, 'pages', 'cadastro_usuario', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo HTML');
      } else {
        res.send(data); // Envia o conteúdo HTML como resposta
      }
    });
  });



module.exports = router