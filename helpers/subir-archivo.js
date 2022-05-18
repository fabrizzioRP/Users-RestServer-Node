const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, validExtensions=['png', 'jpg', 'jpeg', 'gif'], carpeta='') => {
    return new Promise( (resolve, reject) => {

        const { archivo } = files;
        const extension = archivo.name.split('.').pop();
        
        // Validamos la extension
        if( !validExtensions.includes(extension) ){
            return reject(`Esta extension ${extension} no es permitida - ${validExtensions}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta , nombreTemp );
    
        archivo.mv( uploadPath, ( err ) => {
            if(err){
                reject(err);
            }

            resolve( nombreTemp );
        });

    });
}

module.exports = {
    subirArchivo
}