// test-db.js
import db from "./db.js";

const check = async () => {
  const [rows] = await db.execute("SELECT database() as db");
  console.log(rows);
};

check();
