const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req, res=response, next) => {
    
    // Se le el Header de la peticion
    const token = req.header('x-token');
    
    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRET_KEY );
        const usuario = await Usuario.findById( uid );

        // Verificar si el usuario existe
        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            });
        }

        // Verificar si el uid tiene estado true
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado : False'
            });
        }
        
        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });

    }

}

module.exports = {
    validarJWT
}