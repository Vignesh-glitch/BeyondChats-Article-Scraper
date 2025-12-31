import express from "express";
import db from "./db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.get("/db-check", async (req, res) => {
  const [r] = await db.execute("SELECT database() as db");
  res.json(r);
});

// READ with error handling
app.get("/articles", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM articles ORDER BY created_at ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database read failed" });
  }
});


// CREATE with error handling
app.post("/articles", async (req, res) => {
  try {
    const { title, content, source_url } = req.body;
    await db.execute(
      "INSERT INTO articles (title, content, source_url) VALUES (?,?,?)",
      [title, content, source_url]
    );
    res.json({ message: "Article saved successfully" });
  } catch (err) {
    console.error("DB Insert Error:", err.message);
    res.status(500).json({ error: "Insert failed" });
  }
});

// UPDATE
app.put("/articles/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    await db.execute("UPDATE articles SET title=?, content=? WHERE id=?", [
      title, content, req.params.id
    ]);
    res.json({ message: "Article updated" });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE
app.delete("/articles/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM articles WHERE id=?", [req.params.id]);
    res.json({ message: "Article deleted" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: "Delete failed" });
  }
});

// Server start with protection
app.listen(5000, () => console.log("Backend running on port 5000"));
