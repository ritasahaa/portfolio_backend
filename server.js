const express = require('express');
const path = require('path');
require('dotenv').config();
const dbConfig = require("./config/dbConfig");
const portfolioRoute = require('./routes/portfolioRoute');
const contactRoute = require('./routes/contactRoute');
const uploadRoute = require('./routes/uploadRoute');

const app = express();

// Add CORS middleware to fix network errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Increase payload size limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoute);

app.use("/api/portfolio", portfolioRoute);
app.use("/api/contact", contactRoute);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
