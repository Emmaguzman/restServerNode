const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
    },
    pasword: {
        type: String,
        required: [true, "La contraseña es necesaria"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "el email es necesario"],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: rolesValidos,
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'usuarios'
});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.pasword;

    return userObject;
}
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
});
module.exports = mongoose.model('Usuario', usuarioSchema);