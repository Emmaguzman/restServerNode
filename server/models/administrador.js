const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let administradorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Requiere nombre']
    },
    password: {
        type: String,
        required: [true, 'require password']
    },
    role: {
        type: String,
        required: [true, 'requiere rol!']
    },
    email: {
        type: String,
        required: [true, 'requiere emil']
    },
    google: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    }

});
module.exports = mongoose.model('Administrador')