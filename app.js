const express = require('express')
const app = express();
app.use(express.json());
const cors = require('cors')
require('dotenv').config();
require('./conn/conn')
const user = require('./Routes/user')
const books = require('./Routes/books')
const favourite = require('./Routes/favourite')
const cart = require('./Routes/cart')
const order = require('./Routes/order')

app.use(cors());


app.use('/api/v1',user);
app.use('/api/v1',books);
app.use('/api/v1/',favourite)
app.use('/api/v1/',cart)
app.use('/api/v1/',order)





app.listen(process.env.PORT,() => console.log(`server started at ${process.env.PORT}`))