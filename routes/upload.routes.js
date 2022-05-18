const { Router } = require('express');
const { check } = require('express-validator');

const { coleccionesPermitidas } = require('../helpers');
const { valFields, checkFile } = require('../middlewares');

const { cargarArchivo, cargarCloudinary, mostrarImg } = require('../controllers/uploads');

const router = Router();

// Cargar imagen localmente
router.post('/', [ checkFile, valFields ], cargarArchivo );

// Cargar imagen a cloudinary
router.put('/:coleccion/:id', [
    checkFile,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos']) ),
    valFields
], cargarCloudinary );
// ], actualizarImagen );

// Ver la imagen
router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos']) ),
    valFields
],  mostrarImg );

module.exports = router;