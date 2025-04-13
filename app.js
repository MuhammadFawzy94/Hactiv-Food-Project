const express = require('express');
const app = express();
const router = require('./routes'); // Menggunakan router dari file routes
const session = require('express-session');

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'hacktiv-secret', // Harus ada
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // False untuk development, true untuk production
        sameSite: true // Untuk keamanan dari CSRF attack
    }
}));

app.use(router);

app.listen(PORT, () => {
    console.log(`LOCAL HOST ${PORT}`);
});