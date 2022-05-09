const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true }
});

ProductoSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...productos } = this.toObject();
    productos.uid = _id;
    return productos;
}

module.exports = model( 'Producto', ProductoSchema );