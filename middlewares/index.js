const validarCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const validarRol = require('./validar-rol');
const validarFile = require('./validar-file');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRol,
    ...validarFile
}