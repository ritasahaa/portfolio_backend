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
    // Allow requests from both localhost (dev) and Render (prod)
    const allowedOrigins = [
        'http://localhost:3000',
        'https://portfolio-frontend-*.onrender.com', // wildcard for Render frontend if used
        'https://portfolio-backend-qszc.onrender.com' // allow self-origin for server-to-server
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || origin?.endsWith('.onrender.com')) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, pragma, expires');
    res.header('Access-Control-Allow-Credentials', 'true');
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

// If deploying backend and frontend separately, do NOT serve React build from backend
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "client/build")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "client/build", "index.html"));
//     });
// }

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
