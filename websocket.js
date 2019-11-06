const mongoose = require('mongoose');
const contractService = require('./etherum/contractService');

require('./models');
const Bet = mongoose.model('Bet');

async function wsInit(wss) {
    let wsCollection = [];

    wss.on('connection', function(ws, req) {
        wsCollection.push(ws);

        ws.on('message', async function(message) {
            try {
                const data = JSON.parse(message).data;
                const event = JSON.parse(message).event;

                switch (event) {
                    case 'create-bet':
                        const { value, betAddress, creatorAddress } = data;

                        new Bet({
                            creatorAddress,
                            betAddress,
                            value,
                            isFinished: false,
                        }).save();
                        break;
                    // case 'get-all-bets':
                    //     ws.send(JSON.stringify(await Bet.find({})));
                    //     break;
                    case 'fulfill-bet':
                    case 'cancel-bet':
                        const { betId } = data;
                        Bet.deleteOne({ _id: betId }).then(lel => lel);

                    default:
                        const betCollection = await Bet.find({});
                        ws.send(JSON.stringify(betCollection));
                }

                Bet.watch().on('change', async data => {
                    const betCollection = await Bet.find({});
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


        console.log('wsCollection', wsCollection.length)

    });
}

module.exports = wsInit;
