const { Router } = require('express');
const { check } = require('express-validator');

const { valFields, validarJWT, esAdminRole, tieneRole } = require('../middlewares');

const { valFieldRole, valFieldCorreo, existeUsuarioById } = require('../helpers/validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios.controller');


const router = Router();

router.get('/', usuariosGet);   


router.post('/', [ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(), 
    check('correo', 'El correo ya existe').custom( valFieldCorreo ),
    check('password', 'La contraseña es obligatoria y ademas tiene que tener minimo 6 caracteres').isLength({ min: 6 }),
    // check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol', 'El rol no es valido').custom( valFieldRole ),
    valFields
], usuariosPost);  


// Read params with /:parametro
router.put('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeUsuarioById ),
    check('rol', 'El rol no es valido').custom( valFieldRole ), 
    valFields
],usuariosPut);  


router.delete('/:id',[
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE', 'ROOT_ROLE'),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeUsuarioById ),
    valFields
],usuariosDelete);


module.exports = router;