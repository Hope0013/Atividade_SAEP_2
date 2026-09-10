// Conexão com o BD

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'saep_agendamento_db',
  password: 'postgres',
  port: 5432,
});

module.exports = pool;