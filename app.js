const express = require('express');
const app=express();
const todoController=require('./controlers/todoControler');
// set up template engine
app.set('view engine', 'ejs');

//static files
app.use('/assets', express.static('public/assets'));

//fire controller
todoController(app);

//listen to port 3000
app.listen(3000);
console.log('listening on port 3000');

