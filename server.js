const express = require('express')
const mongoose = require('mongoose')
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')

const app = express();
// Db 
const db = require('./config/keys').mongoURI
// connect to mongodb
mongoose
  .connect(db)
  .then(() => {
    console.log('mongodb connected')
  })
  .catch((error) => {
    console.log(error);

  })

//use routes

app.get('/', (request, response) => {
  response.send('hello')
});

app.use('/api/users', users)
app.use('/api/profile', profile)

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log("server running on port/evn", port);
});