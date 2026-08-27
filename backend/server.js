const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { rows } = await db.query(
      "SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2",
      [email, senha],
    );
    if (rows.length > 0) {
      return res.json({ token: "mock-jwt-token-saep", usuario: rows[0] });
    }
    return res.status(401).json({ error: "E-mail ou senha inválidos." });
  } catch (err) {
    return res.status(500).json({ error: "Erro no servidor: " + err.message });
  }
});

app.get("/api/recursos", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM recursos ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/clientes", async (req, res) => {
  const { busca } = req.query;
  try {
    let query = "SELECT * FROM clientes";
    let params = [];
    if (busca) {
      query += " WHERE nome ILIKE $1 OR documento ILIKE $2";
      params = [`%${busca}%`, `%${busca}%`];
    }
    query += " ORDER BY id DESC";
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/clientes", async (req, res) => {
  const { nome, documento, telefone, email } = req.body;
  if (!nome || !documento) {
    return res
      .status(400)
      .json({ error: "Nome e Documento são obrigatórios." });
  }
  try {
    const { rows } = await db.query(
      "INSERT INTO clientes (nome, documento, telefone, email) VALUES ($1, $2, $3, $4) RETURNING id",
      [nome, documento, telefone, email],
    );
    res.status(201).json({ id: rows[0].id, nome, documento, telefone, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, documento, telefone, email } = req.body;
  try {
    await db.query(
      "UPDATE clientes SET nome = $1, documento = $2, telefone = $3, email = $4 WHERE id = $5",
      [nome, documento, telefone, email, id],
    );
    res.json({ id, nome, documento, telefone, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/agendamentos", async (req, res) => {
  try {
    const query = `
      SELECT a.id, a.data_agendamento, a.hora_agendamento,
             c.nome AS cliente_nome, r.nome AS recurso_nome, r.tipo AS recurso_tipo
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN recursos r ON a.recurso_id = r.id
      ORDER BY a.data_agendamento DESC, a.hora_agendamento DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/agendamentos", async (req, res) => {
  const { cliente_id, recurso_id, data_agendamento, hora_agendamento } =
    req.body;

  if (!cliente_id || !recurso_id || !data_agendamento || !hora_agendamento) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const { rows: conflitos } = await db.query(
      "SELECT id FROM agendamentos WHERE recurso_id = $1 AND data_agendamento = $2 AND hora_agendamento = $3",
      [recurso_id, data_agendamento, hora_agendamento],
    );

    if (conflitos.length > 0) {
      return res.status(409).json({
        error:
          "O recurso/especialista selecionado já possui um agendamento nesta mesma data e horário!",
      });
    }

    const { rows } = await db.query(
      "INSERT INTO agendamentos (cliente_id, recurso_id, data_agendamento, hora_agendamento) VALUES ($1, $2, $3, $4) RETURNING id",
      [cliente_id, recurso_id, data_agendamento, hora_agendamento],
    );

    res
      .status(201)
      .json({ message: "Agendamento realizado com sucesso!", id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
