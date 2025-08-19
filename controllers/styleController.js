const db = require('../config/db');

exports.getUserStyles = (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const sql = 'SELECT * FROM chatbot_styles WHERE user_id = ? LIMIT 1';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'failed_to_get_styles' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.json({
        header_bg: '#3498db',
        bot_message_bg: '#ffffff',
        user_message_bg: '#3498db',
        button_bg: '#3498db',
        font_family: 'Arial',
        theme: 'light'
      });
    }
  });
};

exports.saveStyles = (req, res) => {
  const { userId, ...styles } = req.body;

  const sql = `
    INSERT INTO chatbot_styles 
      (user_id, header_bg, bot_message_bg, user_message_bg, button_bg, font_family, theme)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      header_bg = VALUES(header_bg),
      bot_message_bg = VALUES(bot_message_bg),
      user_message_bg = VALUES(user_message_bg),
      button_bg = VALUES(button_bg),
      font_family = VALUES(font_family),
      theme = VALUES(theme),
      updated_at = NOW()
  `;

  db.query(sql, [
    userId,
    styles.header_bg,
    styles.bot_message_bg,
    styles.user_message_bg,
    styles.button_bg,
    styles.font_family,
    styles.theme
  ], (err, result) => {
    if (err) {
      console.error('Insert/Update error:', err);
      return res.status(500).json({ error: 'Insert/Update failed' });
    }
    
    // Return the complete saved styles
    res.json({
      userId,
      ...styles
    });
  });
};