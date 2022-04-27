const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');

const login = async ( req=request, res=response ) => {

    const { correo, password } = req.body;

    try {
        // Verificar que el correo exista
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(404).json({
                msg: "Usuario / Password no son correctos - Correo",
            });
        }
        
        // Verificar si el usuario esta activo
        if( !usuario.estado ){
            return res.status(404).json({
                msg: "Usuario / Password no son correctos - Estado Inactivo",
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(404).json({
                msg: "Usuario / Password no son correctos - Password",
            });
        }

        // Generar el token JWT
        const token = await generarJWT( usuario._id );

        // Respuesta
        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
    
}

module.exports = {
    login
}