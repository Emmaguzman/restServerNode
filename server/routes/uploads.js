const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");

app.use(fileUpload());

app.put("/upload/:tipo/:id", (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se selecciono ningun archivo",
            },
        });
    }
    //validaTipo
    let tiposValidos = ["productos", "usuarios"];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Los tipos validas son " + tiposValidos.join(", "),
        });
    }

    let archivo = req.files.sampleFile;
    let nombreCortado = archivo.name.split(".");
    let extencion = nombreCortado[nombreCortado.length - 1];
    // extenciones permitidas!
    let extencionesValidas = ["png", "jpeg", "jpg", "gif"];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            message: "las extenciones validas son " + extencionesValidas.join(", "),
            ext: extencion,
        });
    }

    //cambiar nombre al archivo
    let nombreArchivoMod = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivoMod}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        //imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoMod);
        } else {

            imagenProducto(id, res, nombreArchivoMod)
        }
    });
});

function imagenUsuario(id, res, nombreArchivoMod) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(nombreArchivoMod, "usuarios");
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioBD) {
            borraArchivo(nombreArchivoMod, "usuarios");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "EL USUARIO NO EXISTE",
                },
            });
        }
        borraArchivo(usuarioBD.img, "usuarios");

        usuarioBD.img = nombreArchivoMod;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivoMod) {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(nombreArchivoMod, "productos");
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!productoBD) {
            borraArchivo(nombreArchivoMod, "productos");
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No se encontro el producto",
                },
            });
        }
        borraArchivo(productoBD.img, "productos");

        productoBD.img = nombreArchivoMod;
        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(
        __dirname,
        `../../uploads/${tipo}/${nombreImagen}`
    );
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;