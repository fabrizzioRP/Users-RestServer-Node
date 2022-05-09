const { request, response } = require('express');
const { isValidPrecio } = require('../helpers/validator');
const { Producto, Categoria } = require('../models');

const leerProductos = async ( req=request, res=response ) => {

    const { limite = 5 , desde = 0 } = req.query;

    const sanitizarLimit =  Number(limite);
    const sanitizarDesde =  Number(desde);

    if( isNaN(sanitizarDesde) || isNaN(sanitizarLimit) ){
        return res.status(400).json({
            msg: "Los valores de los parametros tienen que ser numeros"
        });
    }

    const filter = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(filter),
        Producto.find(filter)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .limit(sanitizarLimit)
            .skip(sanitizarDesde)
    ]);

    res.json({
        total,
        productos
    });
}

const leerProducto = async ( req=request, res=response ) => {
    const id = req.params.id;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async ( req=request, res=response ) => {

    const { estado, usuario, ...body } = req.body;

    // Validamos el valor del precio
    const checkPrecio = isValidPrecio(body.precio);
    if(!checkPrecio){
        return res.status(400).json({
            msg: "El precio tiene que ser numerico",
        });
    }

    // Verificamos si existe el producto
    body.nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if( productoDB ){
        return res.status(401).json({
            msg: `El producto ${body.nombre} ya existe`
        });
    }

    // Preparamos la Data para crear el producto
    const data = {
        usuario: req.usuario._id,
        precio: checkPrecio,
        ...body
    }

    const producto = new Producto(data);

    // Guardamos el producto nuevo
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async ( req=request, res=response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

const deleteProducto = async ( req=request, res=response ) => {
    const id = req.params.id;
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json(producto);
}

module.exports = {
    leerProductos,
    leerProducto,
    crearProducto,
    actualizarProducto,
    deleteProducto
}