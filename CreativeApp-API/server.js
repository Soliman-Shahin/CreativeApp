const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');
const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const { User } = require('./helpers/userClass');
require('./socket/streams')(io, User, _);
require('./socket/privateChat')(io);
const dbConfig = require('./config/secret');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const friendRoute = require('./routes/friendRoute');
const messageRoute = require('./routes/messageRoute');
const photoRoute = require('./routes/photoRoute');

app.use((req, res, next) => {
    var allowedOrigins = ['http://localhost:4200', 'http://localhost:8200', 'http://localhost:8100'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('creativeapp database is connected successfully');
});

app.use('/api/creativeapp', authRoute);
app.use('/api/creativeapp', postRoute);
app.use('/api/creativeapp', userRoute);
app.use('/api/creativeapp', friendRoute);
app.use('/api/creativeapp', messageRoute);
app.use('/api/creativeapp', photoRoute);


server.listen(3000, () => {
    console.log('Server starts');
})