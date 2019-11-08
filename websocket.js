const mongoose = require('mongoose');

require('./models');
const Bet = mongoose.model('Bet');

async function wsInit(wss) {
    let wsCollection = [];
    let betCollection = await Bet.find({});

    wss.on('connection', function(ws, req) {
        wsCollection.push(ws);

        ws.on('message', async function(message) {
            try {
                const data = JSON.parse(message).data;
                const event = JSON.parse(message).event;

                switch (event) {
                    case 'create-bet':
                        const { value, betAddress, creatorAddress } = data;

                        const newBet = {
                            _id: mongoose.Types.ObjectId(),
                            value,
                            creatorAddress,
                            betAddress,
                            isFinished: false
                        };

                        betCollection.push(newBet);
                        new Bet(newBet).save();
                        break;
                    case 'fulfill-bet':
                    case 'cancel-bet':
                        const { betId } = data;
                        Bet.deleteOne({ _id: betId }).then(lel => lel);
                        break;
                    default:
                        console.log('def case')
                        ws.send(JSON.stringify(betCollection));
                }

                console.log('event', event)
                // console.log('collection', betCollection)

                Bet.watch().on('change', async data => {
                    switch (data.operationType) {
                        case 'delete':
                            betCollection = betCollection.filter(bet => JSON.stringify(bet._id) !== JSON.stringify(data.documentKey._id));
                            break;
                        // case 'insert':
                        //     console.log('insert', betCollection)
                        //     console.log('full doc', data.fullDocument)
                        //     betCollection.push(data.fullDocument);
                        //     break;
                    }
                    wsCollection.forEach(ws => ws.send(JSON.stringify(betCollection)))
                });

            } catch (e) {
                console.log('ERROR COO', e)
                ws.send([]);
            }
        });

        ws.on('close', () => {
            wsCollection = wsCollection.filter(ws => ws.readyState !== 3);
        });

    });
}

module.exports = wsInit;
