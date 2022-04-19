const cors = require('cors');
const express = require('express');

const { dbConnection } = require('../database/config.db');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;