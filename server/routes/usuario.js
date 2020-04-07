const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario");

const app = express();

app.get("/cliente", (req, res) => {
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, "role nombre email estado google img")
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err)
                res.status(400).json({
                    ok: false,
                    err,
                });
            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo,
                });
            });
        });
});

app.post("/cliente", function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        pasword: bcrypt.hashSync(body.pasword, 10),
        role: body.role,
    });
    console.log(usuario);
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        // usuarioDB.pasword = null;
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

app.put("/cliente/:id", function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
    delete body.pasword;
    delete body.google;

    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB,
            });
        }
    );
});

let cambiaEstado = {
    estado: false
}
app.delete("/cliente/:id", function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'USUARIO NO ENCONTRADO'
                    }
                });
            }
            res.json({
                ok: true,
                usuario: usuarioBorrado,
            });
        });
});

module.exports = app;