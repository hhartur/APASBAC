const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");

const app = express();

const SECRET_KEY = "secreto";

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Configuração do PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL, // URL do banco de dados
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => console.log("Conectado ao PostgreSQL"))
  .catch((err) => console.error("Erro ao conectar ao PostgreSQL:", err));

// Rota básica para teste
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Rota de login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await client.query(query, [username]);

    if (result.rows.length > 0 && result.rows[0].password === password) {
      const token = jwt.sign({ userId: result.rows[0].id }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, error: "Credenciais inválidas" });
    }
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

// Rota protegida
app.get("/protected", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token não fornecido" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Usuário não logado" });
    }

    res.json({ success: true, user: decoded });
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Rodando na porta: ${PORT}`);
});