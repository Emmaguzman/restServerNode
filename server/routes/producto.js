const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");

//===Obtener todos los productos -->populate usuario,categoria --> paginado
app.get("/productos", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
//== obtener un producto por id
app.get("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "id no existe"
                    }
                });
            }
            res.json({
                producto: productoBD
            })

        });
});
//==crear producto --> grabar usuario /grabar categoria
app.post("/productos", verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });
    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            producto: productoBD
        });
    });
});
//==buscar producto
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //<--- flexibilizo la busqueda
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
        });
});
//==actualizar producto
app.put("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'el ID NO EXISTE'
            });
        }
        //otra forma se actualizar...
        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;
        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        });
    });
});
//borrar producto
app.delete("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'el ID NO EXISTE'
            });
        }
        productoBD.disponible = false;
        productoBD.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });
        });

    });
});

module.exports = app;