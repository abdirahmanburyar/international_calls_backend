require('dotenv').config()
const express = require('express');
const redis = require('redis')
const db  = require('./database')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const path = require('path')
const bodyParser = require('body-parser')
const redisClient = redis.createClient()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json())


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
// set session
app.use(
    session({
      name: '_ssId',
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SECRET_KEY,
      resave: false,
      cookie: {
        maxAge: 86400000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
      },
    })
  );
app.use(cookieParser())

db.connect((err) => {
    if(err){
        console.log(err)
    }
    console.log('connected to the database')
})


require('./api')(app)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
