const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

//Banco de dados SQLite//
const db = new sqlite3.Database("users.db");

//Tabela de usuários//
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      senha TEXT NOT NULL,
      telefone_numero TEXT NOT NULL,
      telefone_ddd TEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      ultimo_login DATETIME DEFAULT NULL
    )
  `);
});

app.use(bodyParser.json());

//Verificar token de autenticação//
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, "secreto", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }

    req.user = user;
    next();
  });
}

//Cadastro de usuários//
app.post("/signup", async (req, res) => {
  try {
    const { nome, senha, email, telefones } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const stmt = db.prepare(
      "INSERT INTO users (nome, senha, email, telefone_numero, telefone_ddd) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(nome, hashedPassword, email, telefones.numero, telefones.ddd);
    stmt.finalize();

    res.status(201).json({
      id: "GUID/ID",
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
      token: "GUID/JWT",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Autenticação de usuários//
app.post("/signin", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ error: "Usuário e/ou senha inválidos" });
    }

    const dataAtual = new Date().toISOString();
    db.run("UPDATE users SET ultimo_login = ? WHERE id = ?", [
      dataAtual,
      user.id,
    ]);

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      "secreto",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      id: "GUID/ID",
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: dataAtual,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Recuperação de usuário//
app.get("/user/:email", authenticateToken, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: {
        numero: user.telefone_numero,
        ddd: user.telefone_ddd,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Obter usuário pelo e-mail//
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}`);
});
