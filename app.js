const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('useCreateIndex', true);

//routes set
const authRoutes = require('./api/routes/auth');
const  trainRoutes = require('./api/routes/trainShedule.route');
const usersRoutes = require('./api/routes/users');
const ticketRoutes = require('./api/routes/ticket.route');

// atlas database connection
mongoose.connect("mongodb+srv://TrainBook:13FEChfLTQq5LC5b@cluster0.qtmc8.mongodb.net/Cluster0?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
    origin: true,
    credentials: true
}
app.options('*', cors(corsOptions));
//set access to all  connect to this api
//next invoked next middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        Response.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/auth', authRoutes);
app.use('/trains', trainRoutes);
app.use('/users', usersRoutes);
app.use('/ticket', ticketRoutes);




app.use((req, res, next) => {
    const error = new error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;