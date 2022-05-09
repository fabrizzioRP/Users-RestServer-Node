const { Router } = require('express');
const { check } = require('express-validator');

const { valFields, validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/validator');

const { crearProducto, 
    leerProductos, 
    leerProducto, 
    actualizarProducto,
    deleteProducto } = require('../controllers/productos');

const router = Router();

// Read all products - pages - populate
router.get('/', leerProductos);

// Read one product with idproducto - populate
router.get('/:id',[
    check('id', 'El id no existe').isMongoId(),
    check('id').custom( existeProductoPorId ),
    valFields
], leerProducto);

// Create a product - private - need a valid token
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    valFields
], crearProducto);

// Update product - private - need a valid token 
router.put('/:id',[
    validarJWT,
    check('id', 'El id no existe').isMongoId(),
    check('id').custom( existeProductoPorId ),
    valFields
], actualizarProducto);

// Delete product - AdminRol - need a valid token
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id no existe').isMongoId(),
    check('id').custom( existeProductoPorId ),
    valFields
], deleteProducto);

module.exports = router;