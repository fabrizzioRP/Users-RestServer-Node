const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares');

const { login, googleSignIn } = require('../controllers/auth.controller');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    valFields,
], login);

router.post('/google',[
    check('id_token', 'El Id token es obligatorio').not().isEmpty(),
    valFields,
], googleSignIn);

module.exports = router;