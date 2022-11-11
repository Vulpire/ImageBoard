//require mods
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const tradeRoutes = require('./routes/tradeRoutes');


//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/milestone',
{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    //start server
    app.listen(port, host , ()=>{
        console.log('Server is running on port ', + port);
    })
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//setup routes
app.get('/', (req,res)=>{
    res.render('index');
});

app.use('/trades', tradeRoutes);

//error handling
app.use((req, res, next) =>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});