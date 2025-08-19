const mysql=require('mysql2')
require('dotenv').config()

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'chatbot_styles_db'
});

db.connect(err=>{
    if(err){
        console.error('MySQL connection failed:', err);
        process.exit(1);
    }
        console.log('MySQL connected...');

})

module.exports = db;