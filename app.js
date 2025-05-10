const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");

const app = express();
const port = 3000;
const axios = require("axios");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config(); // .env 환경변수 설정

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
  console.log("MySQL 연결 성공!");
});

// 회원가입 API
app.post("/signup", (req, res) => {
  const { email, name, password } = req.body;

  const query = "INSERT INTO users (email, name, password) VALUES (?, ?, ?)";
  db.query(query, [email, name, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "회원가입 실패", error: err });
    }
    res.status(201).json({ message: "회원가입 성공!" });
  });
});

//로그인 API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("로그인 요청 데이터:", req.body); // 디버깅용 로그

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("로그인 중 오류 발생:", err);
      res.status(500).json({ message: "로그인 실패" });
    } else if (results.length > 0) {
      console.log("로그인 성공:", results[0]); // 성공 로그 출력
      res.status(200).json({ message: "로그인 성공!", user: results[0] });
    } else {
      console.log("로그인 실패: 아이디 또는 비밀번호 불일치");
      res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  });
});

//fake store API 제품 등록
app.get("/import-products", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;
    for (const product of products) {
      const { title, description, price, image, category } = product;
      const query = `
        INSERT INTO products (name, description, price, image, category)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(query, [title, description, price, image, category], (err) => {
        if (err) {
          console.error(`삽입 실패 (상품명: ${title})`, err);
        }
      });
    }

    res.send("✅ 제품 데이터가 성공적으로 저장되었습니다!");
  } catch (error) {
    console.error("API 호출 또는 DB 저장 중 오류:", error);
    res.status(500).send("❌ 제품 데이터를 저장하는 중 오류 발생");
  }
});

// 모든 제품 목록 조회 API
app.get("/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("제품 목록 조회 실패:", err);
      return res.status(500).json({ message: "상품 목록 조회 실패" });
    }
    res.status(200).json(results); // 모든 제품을 JSON 형식으로 반환
  });
});

//검색 API
app.get("/products/search", (req, res) => {
  const { query } = req.query;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${query}%`], (err, results) => {
    if (err) return res.status(500).json({ message: "조회 실패", error: err });

    // 무조건 200 OK와 결과 반환
    return res.status(200).json(results); // 빈 배열이어도 200 반환
  });
});

//제품 상세 페이지 조회 API
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows] = await db.promise().query(//connect 객체에서 db 연결 객체
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = rows[0];
    res.json(product);
  } catch (err) {
    console.error('DB 에러:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

//DB 옷 상품 조회 API
app.get("/products/category/:category", (req, res) => {
  const category = decodeURIComponent(req.params.category);
  const query = "SELECT * FROM products WHERE category = ?";
  db.query(query, [category], (err, results) => {
    if (err) return res.status(500).json({ message: "조회 실패", error: err });
    res.status(200).json(results);
  });
});

//좋아요 추가, 삭제 API
app.post('/likes', (req, res) => {
  const { product_id, user_email } = req.body;

  const checkQuery = `SELECT * FROM likes WHERE product_id = ? AND user_email = ?`;
  db.query(checkQuery, [product_id, user_email], (err, results) => {
    if (err) return res.status(500).json({ message: '확인 실패', error: err });

    if (results.length > 0) {
      // 이미 좋아요 눌렀으면 → 취소
      const deleteQuery = `DELETE FROM likes WHERE product_id = ? AND user_email = ?`;
      db.query(deleteQuery, [product_id, user_email], (err) => {
        if (err) return res.status(500).json({ message: '삭제 실패', error: err });

        // 삭제 후 현재 좋아요 수 조회
        const countQuery = `SELECT COUNT(*) AS likesCount FROM likes WHERE product_id = ?`;
        db.query(countQuery, [product_id], (err, countResult) => {
          if (err) return res.status(500).json({ message: '카운트 실패', error: err });
          return res.status(200).json({
            liked: false,
            likesCount: countResult[0].likesCount,
            message: "좋아요 취소 성공"
          });
        });
      });
    } else {
      // 좋아요 추가
      const insertQuery = `INSERT INTO likes (product_id, user_email) VALUES (?, ?)`;
      db.query(insertQuery, [product_id, user_email], (err) => {
        if (err) return res.status(500).json({ message: '추가 실패', error: err });

        // 추가 후 현재 좋아요 수 조회
        const countQuery = `SELECT COUNT(*) AS likesCount FROM likes WHERE product_id = ?`;
        db.query(countQuery, [product_id], (err, countResult) => {
          if (err) return res.status(500).json({ message: '카운트 실패', error: err });
          return res.status(200).json({
            liked: true,
            likesCount: countResult[0].likesCount,
            message: "좋아요 추가 성공"
          });
        });
      });
    }
  });
});

//좋아요 상품 목록 조회 API
app.get("/products", (req, res) => {
  const query = `
    SELECT 
      p.*, 
      IFNULL(l.likesCount, 0) AS likesCount
    FROM products p
    LEFT JOIN (
      SELECT product_id, COUNT(*) AS likesCount 
      FROM likes 
      GROUP BY product_id
    ) l ON p.id = l.product_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("제품 목록 조회 실패:", err);
      return res.status(500).json({ message: "상품 목록 조회 실패" });
    }
    res.status(200).json(results);
  });
});
//좋아요 수 조회 API
app.get('/likes/:product_id', (req, res) => {
  const { product_id } = req.params;
  const user_email = req.query.user_email;

  const sqlCount = 'SELECT COUNT(*) AS count FROM likes WHERE product_id = ?';
  const sqlCheck = 'SELECT * FROM likes WHERE product_id = ? AND user_email = ?';

  db.query(sqlCount, [product_id], (err, countResult) => {
    if (err) return res.status(500).json({ error: '좋아요 수 조회 실패' });

    const likesCount = countResult[0].count;

    if (!user_email) {
      return res.json({ isLiked: false, likesCount });
    }

    db.query(sqlCheck, [product_id, user_email], (err2, likeResult) => {
      if (err2) return res.status(500).json({ error: '좋아요 여부 조회 실패' });

      const isLiked = likeResult.length > 0;
      return res.json({ isLiked, likesCount });
    });
  });
});

app.get('/like', (req, res) => {
  const userEmail = req.query.user_email;
  if (!userEmail) {
    return res.status(400).json({ message: 'user_email is required' });
  }

  const query = 'SELECT product_id FROM likes WHERE user_email = ?';
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error('좋아요 조회 실패:', err);
      return res.status(500).json({ message: '서버 오류' });
    }
    res.json(results);
  });
});









// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
