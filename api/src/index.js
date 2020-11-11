const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
var bodyParser = require('body-parser')

mongoose.connect(
    process.env.URL_DB,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
);
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb', extended: true}))
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Conectado ao banco de dados!");
});

app.use(cors(
    //origin:'link'
));
app.use(express.json());
app.use(routes);


app.listen(3333);
