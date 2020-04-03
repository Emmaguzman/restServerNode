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

app.post('/cliente', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        });
    } else {
        res.json({ cliente: body });
    }
});

app.put('/cliente/:id', function(req, res) {
    let id = req.params.id;
    res.json({ id });
});
app.delete('/cliente', function(req, res) {
    res.json('deleteUsuario');
});


app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto', process.env.PORT);
});