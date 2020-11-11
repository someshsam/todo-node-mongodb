const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const log = require('debug')('todo-node-mongo:server');
const cors = require('cors');

require('dotenv/config');

// Router Middleware
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/authentication');

// Middlewares
const verifyToken = require('./middlewares/verifyToken');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: [
        `${process.env.FRONT_URL}`,
        'http://localhost:3000',
        'https://mypage.com',
    ],
    credentials: true
}));

app.use(cookieParser());

app.use('/authentication', authRouter);
app.use('/posts', verifyToken, postsRouter);

app.use('/', (req, res) => {
    res.send('Welcome to todo-node-mongoose');
});

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => log('Connected to mongodb!'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
