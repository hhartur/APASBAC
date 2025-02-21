const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(bodyParser.json()); // Para analisar o corpo das requisições como JSON
app.use(cors()); // Para permitir requisições de outros domínios
app.use(express.static(path.join(__dirname, "public"))); // Para servir arquivos estáticos

// Configuração do MySQL
const dbHost = "localhost";
const dbUser = "root";
const dbPass = "";
const dbName = "apasbac";

const connection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPass,
  database: dbName,
});

// Conectar ao MySQL
connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL");
});

// Rota básica para teste
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const verifyQuery = "SELECT * FROM users WHERE username = ?";
  connection.execute(verifyQuery, username, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro no servidor" });
    }

    
  });
});

app.listen(3000, () => {
  console.log("Rodando na porta: 3000");
});

// Exportar o app e a conexão com o MySQL
module.exports = { app, connection };
