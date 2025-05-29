// routes/lista.js
const express = require("express");
const pool = require("../db"); // Certifique-se de que o caminho para seu arquivo db.js está correto
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
        // Este console.error é FUNDAMENTAL para ver o que está falhando
        console.error("Erro ao criar tarefa:", err.message); 
        res.status(500).json({ erro: err.message });
    }
});

// Listar tarefas por email
router.get("/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query("SELECT * FROM lista WHERE email = $1 ORDER BY id DESC", [
            email,
        ]);
        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao listar tarefas:", err.message);
        res.status(500).json({ erro: err.message });
    }
});

// Atualizar status da tarefa (PATCH)
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    if (typeof status !== 'boolean') {
        return res.status(400).json({ erro: "O status deve ser um valor booleano (true/false)." });
    }

    try {
        const result = await pool.query(
            "UPDATE lista SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao atualizar status da tarefa:", err.message);
        res.status(500).json({ erro: err.message });
    }
});

// Rota para ATUALIZAR TÍTULO E DESCRIÇÃO da tarefa (PUT)
router.put("/atualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao } = req.body;

    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({ erro: "O título da tarefa é obrigatório e deve ser uma string não vazia." });
    }

    try {
        const result = await pool.query(
            "UPDATE lista SET titulo = $1, descricao = $2 WHERE id = $3 RETURNING *",
            [titulo, descricao, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao atualizar tarefa (título/descrição):", err.message);
        res.status(500).json({ erro: "Erro interno do servidor ao atualizar tarefa." });
    }
});

// Deletar uma tarefa pelo ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM lista WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada" });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Erro ao deletar tarefa:", err.message);
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;