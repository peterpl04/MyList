const express = require("express");
const pool = require("../db");
const router = express.Router();

// Criar uma nova lista (tarefa)
router.post("/", async (req, res) => {
  const { email, titulo, descricao, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO lista (email, titulo, descricao, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, titulo, descricao, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar tarefas por email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query("SELECT * FROM lista WHERE email = $1", [
      email,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar status da tarefa
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE lista SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar uma tarefa pelo ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM lista WHERE id = $1", [id]);
    res.sendStatus(204); // No content
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
