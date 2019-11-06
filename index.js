const express = require('express');
const bodyParser = require('body-parser');
const WebSocketServer = require('ws').Server;
const mongoose = require('mongoose');

const wsInit = require('./websocket');

require('./models');

const http = require('http');

const Bet = mongoose.model('Bet');

async function init() {
    await mongoose.connect(
        'mongodb+srv://illia:illia@cluster0-kkfdg.mongodb.net/bets?retryWrites=true&w=majority',
        { useUnifiedTopology: true },
    );

    const app = express()
        .use((req, res, next) => {
            res.append('Access-Control-Allow-Origin', ['*']);
            res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        })
        .use(bodyParser.json({ limit: '50mb' }))
        // .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
        .use(require('./routes'))
        .use(function (err, req, res, next) {
            console.error(err.stack);
            // res.status(500).json(new Response({ errorMessage: err.message }));
        });

    const server = await http.Server(app);
    const wss = new WebSocketServer({ server });

    wsInit(wss);

    server.listen(5500);
}

init();
