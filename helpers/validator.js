const Role = require('../models/role');
const Usuario = require('../models/usuario');

const valFieldRole = async (rol = '') => {
    const roles = await Role.findOne({ rol });
    if( !roles ){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}

const valFieldCorreo = async (correo) => {
    const existeCorreo = await Usuario.findOne({ correo });
    if( existeCorreo ){
        throw new Error(`El correo ${correo} ya existe`);
    }
}

const existeUsuarioById = async (id) => {
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
        throw new Error(`El usuario con este id : ${ id },  no existe`);
    }
}

module.exports = {
    valFieldRole,
    valFieldCorreo,
    existeUsuarioById
}