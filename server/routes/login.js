const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Usuario = require("../models/usuario");
const app = express();

app.post("/login", (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                message: "Usuario o contraseña incorrectos",
            });
        }

        if (!bcrypt.compareSync(body.pasword, usuarioBD.pasword)) {
            return res.status(400).json({
                ok: false,
                message: "password incorrecto",
            });
        }
        let token = jwt.sign({ usuario: usuarioBD }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });
});

module.exports = app;