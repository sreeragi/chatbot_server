const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Create table if not exists
db.query(`
CREATE TABLE IF NOT EXISTS chatbot_styles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  header_bg VARCHAR(7) DEFAULT '#3498db',
  bot_message_bg VARCHAR(7) DEFAULT '#ffffff',
  user_message_bg VARCHAR(7) DEFAULT '#3498db',
  button_bg VARCHAR(7) DEFAULT '#3498db',
  font_family VARCHAR(50) DEFAULT 'Arial',
  theme VARCHAR(10) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`, (err) => {
  if (err) console.error("❌ Table creation failed:", err);
  else console.log("✅ Table ready");
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
  console.log('✅ MySQL connected...');
});

module.exports = db;
