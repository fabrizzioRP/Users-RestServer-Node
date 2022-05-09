const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    }
});

CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...categorias } = this.toObject();
    categorias.uid = _id;
    return categorias;
}

module.exports = model( 'Categoria', CategoriaSchema );