const dbValidator  = require('./validator');
const generarToken = require('./generar-jwt');
const subirArchivo = require('./subir-archivo');
const googleVerify = require('./google-verify');

module.exports = {
    ...dbValidator,
    ...generarToken,
    ...subirArchivo,
    ...googleVerify
}