const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const helmet = require("helmet");

const authenticateToken = require('./middlewares/authenticate-token');
const addCorsHeaders = require('./middlewares/add-cors-headers');

const authRoutes = require('./routes/auth.route');
const userProfileRoutes = require('./routes/user-profile.route');
const wordsRoutes = require('./routes/words.route');
const learnRoutes = require('./routes/learn.route');
const settingsRoutes = require('./routes/settings.route');
const imagesRoutes = require('./routes/images.route');


dotenv.config();

const app = express();

app.all('*', addCorsHeaders);

app.use(helmet());
app.use(express.static(path.join(__dirname, '/images')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: ['application/json', 'application/csp-report'] }));
app.use('/auth', authRoutes);
app.use('/user-profile', authenticateToken, userProfileRoutes);
app.use('/words', authenticateToken, wordsRoutes);
app.use('/learn', authenticateToken, learnRoutes);
app.use('/settings', authenticateToken, settingsRoutes);
app.use('/images', imagesRoutes);

async function start(url) {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

    const api_ip = process.env.API_IP;
    if (!!api_ip) {
      app.listen(process.env.PORT, api_ip, () => {
        console.log(`Server is running on PORT: ${process.env.PORT}`);
      });
    } else {
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on PORT: ${process.env.PORT}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

start(process.env.MONGODB_URI);
