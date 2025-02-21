const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

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
  connection.execute(verifyQuery, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro no servidor" });
    }

    if (result.length > 0 && result[0].password === password) {
      const token = jwt.sign({ userId: result[0].id }, "secreto", {
        expiresIn: "1h",
      });
      return res.json({ sucess: true, token });
    } else {
      return res
        .status(401)
        .json({ sucess: false, error: "Credenciais inválidas" });
    }
  });
});

app.get("/protected", (req, res)=>{
    const token = req.header['authorization']

    if(!token){

    }
})

app.listen(3000, () => {
  console.log("Rodando na porta: 3000");
});