import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASSWORD
}).promise();

export async function query (connection, query) {
  const [rows] = await connection.query(query);

  const data = {
    isEmpty: !rows.length,
    data: rows[0]
  };

  return data;
}

export async function queryAll (connection, query) {
  const [rows] = await connection.query(query);

  const data = {
    isEmpty: !rows.length,
    data: rows
  };

  return data;
}

export async function insert (connection, query) {
  const [rows] = await connection.query(query);

  return rows.insertId;
}

export default pool;
