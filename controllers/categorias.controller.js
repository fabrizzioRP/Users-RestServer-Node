const { Categoria } = require('../models');
const { request, response } = require('express');


const obtenerCategorias = async (req=request,res=response) => {

    const { limite = 5 , desde = 0 } = req.query;

    const sanitizarLimit =  Number(limite);
    const sanitizarDesde =  Number(desde);

    if( isNaN(sanitizarDesde) || isNaN(sanitizarLimit) ){
        return res.status(400).json({
            msg: "Los valores de los parametros tienen que ser numeros"
        });
    }

    const filter = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(filter),
        Categoria.find(filter).limit(sanitizarLimit).skip(sanitizarDesde),
    ]);

    const lastCategoria = categorias[total - 1].nombre;
    const filtro = { nombre: lastCategoria };
    const { usuario } = await Categoria.findOne(filtro).populate('usuario');

    res.json({
        total, 
        categorias,
        usuario
    });

}

const obtenerCategoria = async (req=request,res=response) => {
    const id = req.params.id;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');
    res.json(categoria);
}

const crearCategoria = async (req=request,res=response) => {

    const nombre = req.body.nombre.toUpperCase();

    // Verificamos si existe la categoria
    const existeCategoria = await Categoria.findOne({ nombre });
    if(existeCategoria){
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`,
        });
    }

    // Generar la Data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria( data );

    // Guardar en la BD
    await categoria.save();

    res.status(201).json(categoria);
}

const actualizarCategoria = async (req=request,res=response) => {
    const id = req.params.id;
    const nombreActual = req.body.nombre.toUpperCase();
    const categoria = await Categoria.findByIdAndUpdate(id , { nombre: nombreActual });
    res.json( categoria );
} 

const borrarCategoria = async (req=request,res=response) => {
    const id = req.params.id;
    const categoriaDelete = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json(categoriaDelete);
} 

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}