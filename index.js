const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

let userAuthDatabase = {};
let leaderboardDatabase = {};

function encryptPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Global Middleware (CORS aur JSON parse karne ke liye)
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Infinity Production Server Is Live! 🚀");
});

// 🛣️ Route 1: Auth Endpoint
app.get('/auth', (req, res) => {
    const { username, password } = req.query;
    if (username && password) {
        const encryptedPass = encryptPassword(password);
        userAuthDatabase[username] = encryptedPass;
        return res.send("DATABASE_SUCCESS: AUTH_SAVED");
    }
    res.status(400).send("DATABASE_ERROR: INVALID_PARAMETERS");
});

// 🛣️ Route 2: Score Endpoint
app.get('/score', (req, res) => {
    const { username, score } = req.query;
    if (username && score) {
        leaderboardDatabase[username] = parseInt(score);
        return res.send("DATABASE_SUCCESS: SCORE_SAVED");
    }
    res.status(400).send("DATABASE_ERROR: INVALID_PARAMETERS");
});

// 🛣️ Route 3: Android App Ke Liye Data Fetch Endpoint
app.get('/get-data', (req, res) => {
    res.json({
        users: userAuthDatabase,
        leaderboard: leaderboardDatabase
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

