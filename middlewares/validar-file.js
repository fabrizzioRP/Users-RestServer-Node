const { request, response } = require('express');

const checkFile = (req=request, res=response, next) => {

    // Verificar si viene algun archivo
    if( !req.files || Object.keys( req.files ).length === 0 || !req.files.archivo ){
        return res.status(400).json({msg: "No hay archivos para subir"});
    }

    next();

}

module.exports = {
    checkFile
}