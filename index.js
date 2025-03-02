const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const diaryRoute = require('./routes/diaryRoutes');
const User = require('./model/User');
const favoriteRoute = require('./routes/favoriteRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoute);
app.use('/api/diaries', diaryRoute);
app.use('/api/diaries/favorites', favoriteRoute);

// Home route
app.get('/', (req, res) => {
    res.send("Welcome to the Digital Diary API");
});

// Sync the database
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Database sync successful');
}).catch((err) => {
    console.error('Error syncing database:', err);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
