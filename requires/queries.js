const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bcrypt = require("bcrypt");

const Pool = require("pg").Pool;

const env = process.env;
const pool = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const data = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
    };
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [data.name, data.email, data.password]
    );

    response.status(201).send(`User added`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  console.log(request.body);
  const { name, email } = request.body;
  console.log(name, email);

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
