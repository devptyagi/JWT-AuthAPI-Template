require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.SERVER_PORT || 8080;

// Default Middlewares
app.use(express.json());
app.use(cors());

// Importing Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// MongoDB Configuration.
mongoose.connect(process.env.MONGO_DB_URL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => {
    console.log("DATABASE CONNECTED");
})
.catch(() => {
    console.log("Unable to connect to Database!");
});

// Implementing Routes.
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);

// Starting the server.
app.listen(port, () => {
  console.log(`Server is listening on PORT:${port}`);
});
