const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config.db');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth : '/api/auth',
            user : '/api/usuarios',
            buscar : '/api/buscar',
            uploads : '/api/uploads',
            productos : '/api/productos',
            categoria : '/api/categorias',
        }

        // conectar a la DB
        this.connectDB();
        
        // Middlewares
        this.middlewares();

        // Rutas de mi app
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        // Cors 
        this.app.use( cors() );
        
        // body-parser, Lectura y parseo del body de los requests
        this.app.use( express.json() );
        
        // Directorio Publico
        this.app.use( express.static('public') );

        // File Upload o carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.user, require('../routes/usuarios'));
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/search.routes'));
        this.app.use(this.paths.uploads, require('../routes/upload.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        this.app.use(this.paths.categoria, require('../routes/categorias.routes'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`App listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;