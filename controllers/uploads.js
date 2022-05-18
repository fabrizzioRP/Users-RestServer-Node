const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require('express');

const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');

// Para cargar imagen localmente
const cargarArchivo = async ( req=request, res=response ) => {

    try {
        
        // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({ nombre });

    } catch (error) {
        res.status(400).json({error});
    }
    
}

// Para actualizar la imagen de nuestro usuario o producto en la base de datos
const actualizarImagen = async ( req=request, res=response ) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(404).json({
                    msg: `No existe un usuario con el id : ${id}`
                });
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(404).json({
                    msg: `No existe un producto con el id : ${id}`
                });
            }
            break;    

        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto"
            });
    }

    // Limpiar imagen anterior
    if( modelo.img ){
        // Borrar la imagen del servidor
        const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( pathImg ) ){
            fs.unlinkSync( pathImg )
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo );

}

// Mostrar imagen
const mostrarImg = async ( req=request, res=response ) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(404).json({
                    msg: `No existe un usuario con el id : ${id}`
                });
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(404).json({
                    msg: `No existe un producto con el id : ${id}`
                });
            }
            break;    

        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto"
            });
    }

    if( modelo.img ){
        const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( pathImg ) ){
            return res.sendFile( pathImg );
        }
    }

    pathNoImg = path.join( __dirname, '../assets/no-image.jpg' );
    res.sendFile( pathNoImg );

}

const cargarCloudinary = async ( req=request, res=response ) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(404).json({
                    msg: `No existe un usuario con el id : ${id}`
                });
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(404).json({
                    msg: `No existe un producto con el id : ${id}`
                });
            }
            break;    

        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto"
            });
    }

    if( modelo.img ){
        const pathImg = modelo.img.split('/').pop();
        const public_id = pathImg.split('.')[0];
        cloudinary.uploader.destroy( `Coffe-RestApi-Node/${coleccion}/${public_id}` );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath, { folder: `Coffe-RestApi-Node/${coleccion}` } ); //{ upload_preset: "ioilpmie" }
    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImg,
    cargarCloudinary,
}