const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        let token = jwt.sign({ usuario: usuarioBD }, process.env.SEMILLA, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });
});
//configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch((err) => {
        return res.status(403).json({
            ok: false,
            err,
        });
    });
    //veo que en mi bd no exista el email
    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        };
        //crear usuario en bd
        if (usuarioBD) {
            if (usuarioBD.google === false) {
                res.status(500).json({
                    ok: false,
                    err: {
                        message: "debe usar su autenticacion normal",
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioBD,
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });
            }

        }
        // si el usuario no existe en la base de datos
        else {
            console.log('EN ELSE');
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.pasword = ':)';

            usuario.save((err, usuarioBD) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({
                        usuario: usuarioBD,
                    },
                    process.env.SEMILLA, {
                        expiresIn: process.env.CADUCIDAD_TOKEN,
                    });
                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });

            });
        }
    });

});

module.exports = app;