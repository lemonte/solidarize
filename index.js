const express = require('express');
const cors = require('cors');
const http = require('http');
const routes = require( "./src/routes");

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use(express.urlencoded({ extended: true }));

http.createServer(app).listen(5050, () => console.log("Servodor rodando local na porta 5050"));

// https.createServer(options, app).listen(5050, () => console.log("Servodor rodando local na porta 5050"));


app.use(routes);