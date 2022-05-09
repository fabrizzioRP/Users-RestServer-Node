const { Router } = require('express');
const { check } = require('express-validator');

const { valFields, validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId } = require('../helpers/validator');

const { crearCategoria, 
    borrarCategoria,
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
} = require('../controllers/categorias.controller');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    valFields
], obtenerCategoria);

// Crear una categoria - privado - necesita token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    valFields,
], crearCategoria );

// Actualizar una categoria - privado - necesita token valido
router.put('/:id',[
    validarJWT,
    check('id', 'Este id no existe').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    valFields,
],actualizarCategoria);

// Eliminar una categoria - Admin - privado
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'Este id no existe').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    valFields,
],borrarCategoria);


module.exports = router;