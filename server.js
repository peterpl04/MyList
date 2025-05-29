const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const usuariosRouter = require("./routes/usuarios");
const listasRouter = require("./routes/lista");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/usuarios", usuariosRouter);
app.use("/listas", listasRouter);

app.get("/", (req, res) => {
  res.send("API de Lista de Tarefas está funcionando!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
