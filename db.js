// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mylist",
  schema:"public", // "schema" é uma boa adição, mas geralmente não causa erro de autenticação.
  password: "admin",
  port: 5432,
});

pool.connect()
  .then(client => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
    client.release(); // Libera o cliente de volta para o pool
  })
  .catch(err => {
    console.error(" ERRO GRAVE DE CONEXÃO AO BANCO DE DADOS ");
    console.error("Mensagem de erro:", err.message);
    console.error("Credenciais utilizadas:", {
      user: pool.options.user,
      host: pool.options.host,
      database: pool.options.database,
      port: pool.options.port,
    });
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
  });

module.exports = pool;