import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASSWORD
}).promise();

export async function query (query) {
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

export default pool;
