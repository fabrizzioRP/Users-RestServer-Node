const { Router } = require('express');

const { buscar } = require('../controllers/search');

const router = Router();


router.get('/:coleccion/:termino', buscar);


module.exports = router;