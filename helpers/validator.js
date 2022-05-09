const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');

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

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById( id );
    if( !existeCategoria ){
        throw new Error(`La categoria con este id : ${ id },  no existe`);
    }
}

const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){
        throw new Error(`La categoria con este id : ${ id },  no existe`);
    }
}

const isValidPrecio = (precio) => {
    precio = Number(precio);
    if( isNaN(precio) ){
        return false;
    }
    return precio;
}

module.exports = {
    valFieldRole,
    valFieldCorreo,
    existeUsuarioById,
    existeCategoriaPorId,
    existeProductoPorId,
    isValidPrecio
}