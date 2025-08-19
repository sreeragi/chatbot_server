const db = require('../config/db');

// GET style
const getStyle = (req, res) => {
  const { userId } = req.params;
  db.query(
    'SELECT * FROM chatbot_styles WHERE user_id = ? LIMIT 1',
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ message: "No style found" });
      res.json(result[0]);
    }
  );
};

// SAVE or UPDATE style
const saveStyle = (req, res) => {
  const { userId } = req.params;
  const {
    header_bg, bot_message_bg, user_message_bg,
    button_bg, font_family, theme
  } = req.body;

  const sql = `
    INSERT INTO chatbot_styles (user_id, header_bg, bot_message_bg, user_message_bg, button_bg, font_family, theme)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      header_bg=VALUES(header_bg),
      bot_message_bg=VALUES(bot_message_bg),
      user_message_bg=VALUES(user_message_bg),
      button_bg=VALUES(button_bg),
      font_family=VALUES(font_family),
      theme=VALUES(theme)
  `;

  db.query(sql, [userId, header_bg, bot_message_bg, user_message_bg, button_bg, font_family, theme], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Style saved/updated successfully ✅" });
  });
};

module.exports = { getStyle, saveStyle };
