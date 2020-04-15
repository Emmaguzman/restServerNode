const express = require('express');
let { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria')

//==MOSTRAR TODAS LAS CATEGORIAS==
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion') // ordena alfabeticamente 
        .populate('usuario', 'nombre email') //<--revisa object.id y permite cargar informacion
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
});
//==MOSTRAR UNA CATEGORIA POR ID==
app.get('/categoria/:id', (req, res) => {
    //categoria.findID
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es valido'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
});
//==CREAR CATEGORIA==
app.post('/categoria', verificaToken, (req, res) => {
    //req.usuario._id <-- id del usuario con token valido
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });
    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });


});
//==ACTUALIZAR CATEGORIA POR ID==
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoriaBD) {
            return err.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
});
//==BORRAR UNA CATEGORIA POR ID==
app.delete('/categoria/:id', (req, res) => {
    // SOLO UN ADMINISTRADOR PUEDE BORRAR CATEGORIA
    //Categoria.findByIdRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, [verificaToken, verificaAdmin], (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'el ID NO EXISTE'
            });
        }
        res.json({
            ok: true,
            message: 'categoria borrada'
        })
    });
});
module.exports = app;