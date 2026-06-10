const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary storage (RAM mein rahega, cloud disk par nahi)
let temporaryUsers = [];
let temporaryScores = [];

// 1. Website/Game se data aane ke liye Endpoint
app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        temporaryUsers.push({ username, password, timestamp: Date.now() });
        return res.send("DATABASE_SUCCESS: AUTH_SAVED");
    }
    res.status(400).send("DATABASE_ERROR: INVALID_PARAMETERS");
});

app.post('/score', (req, res) => {
    const { username, score } = req.body;
    if (username && score) {
        temporaryScores.push({ username, score: parseInt(score), timestamp: Date.now() });
        return res.send("DATABASE_SUCCESS: SCORE_SAVED");
    }
    res.status(400).send("DATABASE_ERROR: INVALID_PARAMETERS");
});

// 2. Android App ke liye Endpoints (Data khinchne ke liye)
app.get('/fetch-users', (req, res) => {
    // Jo data bacha hai wo app ko de do aur cloud RAM se saaf kar do
    res.json(temporaryUsers);
    temporaryUsers = []; // Wipe out from cloud!
});

app.get('/fetch-scores', (req, res) => {
    res.json(temporaryScores);
    temporaryScores = []; // Wipe out from cloud!
});

app.get('/', (req, res) => {
    res.send("Infinity Relay Server is Live and Secure! 🚀");
});

app.listen(PORT, () => {
    console.log(`Relay Server running on port ${PORT}`);
});
