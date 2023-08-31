const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

let User = require('./models/user.model');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://dnilaksh05:0s8v4fz0WC4XBoPx@cluster0.mabu795.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

const usersRouter = require('./routes/user');

app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
