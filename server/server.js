require("./config/config");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

//--Config body parser
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

//parse aplication/json
app.use(bodyParser.json());

//CONFIGURACION GLOBAL DE RUTAS
app.use(require("./routes/index"));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log("BASE DE DATOS ON!");
});

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto", process.env.PORT);
});