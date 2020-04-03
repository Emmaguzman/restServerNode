require('./config/config');

const express = require('express');
const app = express();

//--Config body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/cliente', (req, res) => {
    res.json('getUsuario')
});

app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto', process.env.PORT);
})