const express = require('express');
const app = express();
const portNumber = 3000;

const userRouter = require('./Routers/UserRouter')
const toDoRouter = require('./Routers/ToDoRouter')

app.use('/users', userRouter)
app.use('/todos', toDoRouter)



app.listen(portNumber, () => { console.log(`Listening on port ${portNumber}`) })