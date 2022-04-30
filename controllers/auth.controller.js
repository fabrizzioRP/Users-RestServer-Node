const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req=request, res=response) => {

    const { id_token } = req.body;

    try {
        
        const { nombre , img , correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            const data = {
                nombre,
                correo,
                password : ':)',
                img,
                google: true,
                rol: 'USER_ROLE'
            }
            
            usuario = new Usuario( data );
            await usuario.save();
        }

        if( !usuario.estado ){
            return res.status(401).json({
                msg: "Hable con el administrador - Estado Inactivo",
            });
        }

        const token = await generarJWT( usuario._id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "El token no se pudo verificar",
        });
    }

}

module.exports = {
    login,
    googleSignIn
}