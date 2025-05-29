const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const axios = require("axios");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("PostgreSQL 연결 실패:", err);
  }
  console.log("✅ PostgreSQL 연결 성공!");
  release();
});
//연결 테스트
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    return console.error("PostgreSQL 연결 테스트 실패:", err);
  }else{
    console.log("PostgreSQL 연결 테스트 성공:");
  }
});


app.get("/", (req, res) => {
  res.send("🚀 Neon PostgreSQL과 연결된 백엔드 서버입니다.");
});

app.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;
  const query = "INSERT INTO users (email, name, password) VALUES ($1, $2, $3)";
  try {
    await pool.query(query, [email, name, password]);
    res.status(201).json({ message: "회원가입 성공!" });
  } catch (err) {
    console.error("회원가입 실패:", err);
    res.status(500).json({ message: "회원가입 실패", error: err });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = $1 AND password = $2";
  try {
    const result = await pool.query(query, [email, password]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: "로그인 성공!", user: result.rows[0] });
    } else {
      res.status(401).json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  } catch (err) {
    console.error("로그인 실패:", err);
    res.status(500).json({ message: "로그인 실패" });
  }
});

app.get("/import-products", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;
    for (const product of products) {
      const { title, description, price, image, category } = product;
      const query = `
        INSERT INTO products (name, description, price, image, category)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(query, [title, description, price, image, category]);
    }
    res.send("✅ 제품 데이터가 성공적으로 저장되었습니다!");
  } catch (error) {
    console.error("API 호출 또는 DB 저장 중 오류:", error);
    res.status(500).send("❌ 제품 데이터를 저장하는 중 오류 발생");
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("제품 목록 조회 실패:", err);
    res.status(500).json({ message: "상품 목록 조회 실패" });
  }
});

app.get("/products/search", async (req, res) => {
  const { query } = req.query;
  const sql = "SELECT * FROM products WHERE name ILIKE $1";
  try {
    const result = await pool.query(sql, [`%${query}%`]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "조회 실패", error: err });
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/products/category/:category", async (req, res) => {
  const category = decodeURIComponent(req.params.category);
  const query = "SELECT * FROM products WHERE category = $1";
  try {
    const result = await pool.query(query, [category]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "조회 실패", error: err });
  }
});

app.post("/likes", async (req, res) => {
  const { product_id, user_email } = req.body;
  const checkQuery = "SELECT * FROM likes WHERE product_id = $1 AND user_email = $2";
  const deleteQuery = "DELETE FROM likes WHERE product_id = $1 AND user_email = $2";
  const insertQuery = "INSERT INTO likes (product_id, user_email) VALUES ($1, $2)";
  const countQuery = "SELECT COUNT(*) AS likesCount FROM likes WHERE product_id = $1";

  try {
    const checkResult = await pool.query(checkQuery, [product_id, user_email]);

    if (checkResult.rows.length > 0) {
      await pool.query(deleteQuery, [product_id, user_email]);
      const countResult = await pool.query(countQuery, [product_id]);
      return res.status(200).json({
        liked: false,
        likesCount: Number(countResult.rows[0].likescount),
        message: "좋아요 취소 성공",
      });
    } else {
      await pool.query(insertQuery, [product_id, user_email]);
      const countResult = await pool.query(countQuery, [product_id]);
      return res.status(200).json({
        liked: true,
        likesCount: Number(countResult.rows[0].likescount),
        message: "좋아요 추가 성공",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "좋아요 처리 실패", error: err });
  }
});

app.get("/likes/:product_id", async (req, res) => {
  const { product_id } = req.params;
  const user_email = req.query.user_email;

  const sqlCount = "SELECT COUNT(*) AS count FROM likes WHERE product_id = $1";
  const sqlCheck = "SELECT * FROM likes WHERE product_id = $1 AND user_email = $2";

  try {
    const countResult = await pool.query(sqlCount, [product_id]);
    const likesCount = Number(countResult.rows[0].count);

    if (!user_email) {
      return res.json({ isLiked: false, likesCount });
    }

    const likeResult = await pool.query(sqlCheck, [product_id, user_email]);
    const isLiked = likeResult.rows.length > 0;

    return res.json({ isLiked, likesCount });
  } catch (err) {
    return res.status(500).json({ error: "좋아요 수 조회 실패" });
  }
});

app.get("/like", async (req, res) => {
  const userEmail = req.query.user_email;
  if (!userEmail) {
    return res.status(400).json({ message: "user_email is required" });
  }

  const query = "SELECT product_id FROM likes WHERE user_email = $1";
  try {
    const result = await pool.query(query, [userEmail]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
