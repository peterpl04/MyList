const express = require("express");
const pool = require("../db");
const router = express.Router();

// Criar usuário
router.post("/", async (req, res) => {
  const { nome, senha, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuario (nome, senha, email) VALUES ($1, $2, $3) RETURNING *",
      [nome, senha, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar todos os usuários
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuario");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Obter usuário por email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar nome ou senha do usuário
router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const { nome, senha } = req.body;
  try {
    const result = await pool.query(
      "UPDATE usuario SET nome = $1, senha = $2 WHERE email = $3 RETURNING *",
      [nome, senha, email]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar usuário por email
router.delete("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query("DELETE FROM usuario WHERE email = $1 RETURNING *", [email]);
    if (result.rows.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
