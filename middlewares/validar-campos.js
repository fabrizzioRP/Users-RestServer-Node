const { validationResult } = require('express-validator');
const { response, request } = require('express');

const valFields = ( req = request , res = response, next ) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next();

}

module.exports = {
    valFields,
}