const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {
    
    const { limite = 5 , desde = 0 } = req.query;

    const sanitizarLimit =  Number(limite);
    const sanitizarDesde =  Number(desde);

    if( !sanitizarLimit || !sanitizarDesde ){
        res.json({
            msg: "Parametros Incorrectos tiene que ser numeros"
        });
    }

    filter = { estado: true };

    const [ total, usuarios ] = await Promise.all([ 
        Usuario.countDocuments(filter), 
        Usuario.find(filter).limit(sanitizarLimit).skip(sanitizarDesde) ]);

    res.json({ 
        total, 
        usuarios 
    });
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Verificar si el correo existe 
    // const existeEmail = await Usuario.findOne({ correo });
    // if( existeEmail ){
    //     return res.status(400).json({
    //         msg: "El Correo ya existe"
    //     });
    // }

    // Encryptar la contraseña
    
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json(usuario);
}

const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    // Validar contra la BD
    if( password ){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos 
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });

    res.json({
        msg: 'Usuario Borrado',
        id
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
}