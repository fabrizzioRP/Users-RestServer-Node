const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatoria']
    },
    correo : {
        type: String,
        required: [true, 'El correo es obligatoria'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: String,
    rol: {
        type: String,
        required: true,
        // enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Restringir la vista a algunos campos cuando hagas pruebas en POSTMAN
UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);