const { request, response } = require('express');

// const { ObjectId } = require('mongoose').Types; : Forma 1 Verifica si es objecto
const { isValidObjectId } = require('mongoose'); // : Forma 2 Verifica si la cantidad de caracteres puede ser un Objectid

const { Usuario, Producto, Categoria } = require('../models');

const coleccionesPermitidas = [
    'roles',
    'usuarios',
    'categorias',
    'productos',
];

const buscarUsuarios = async ( termino='', res=response ) => {

    // const esMongoId = ObjectId.isValid( termino ); : Forma 1
    const esMongoId = isValidObjectId( termino ); // : Forma 2
    if( esMongoId ){
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: (usuario) ? [ usuario ] : [],
        });
    }

    // Expresion regular para buscar por nombre
    const regex = new RegExp( termino, 'i' );

    // Buscar por nombre
    // const usuarios = await Usuario.find({ nombre: regex }); Solo si quieres buscar por nombre
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        count: usuarios.length,
        results: usuarios,
    });
}

const buscarCategorias = async ( termino='', res=response ) => {
    // Buscar por id
    const isMongoId = isValidObjectId( termino );
    if( isMongoId ){
        const categoria = await Categoria.findById( termino );
        return res.json({
            count: (categoria) ? 1 : 0,
            results: (categoria) ? [ categoria ] : [],
        });
    }

    // Buscar por nombre y estado true
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({estado: true, nombre: regex});

    res.json({
        count: categorias.length,
        results: categorias
    });
}

const buscarProductos = async ( termino='', res=response ) => {
    const isMongoId = isValidObjectId( termino );
    if(isMongoId){  
        const producto = await Producto.findById( termino )
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');
        
        return res.json({
            count: (producto) ? 1 : 0,
            results: (producto) ? [ producto ] : [],
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({estado: true, nombre: regex})
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');

    res.json({
        count: productos.length,
        results: productos,
    });
}

const buscar = (req=request, res=response) => {

    const { coleccion , termino } = req.params;

    // Verificamos si la colección existe
    if( !coleccionesPermitidas.includes(coleccion) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son : ${ coleccionesPermitidas }`,
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res );
            break;
        case 'categorias':
            buscarCategorias( termino, res );
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda',
            });
            break;
    }

}

module.exports = {
    buscar
}