//VERIFICAR TOKEN!
const jwt = require("jsonwebtoken");
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();



    });
}


//----------
//VERIFICA ADMIN
//-----------

let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'EL USUARIO NO ES ADMINISTRADOR!'
            }
        });
    }

}


module.exports = {
    verificaToken,
    verificaAdmin
}