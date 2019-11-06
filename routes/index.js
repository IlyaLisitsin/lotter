const router = require('express').Router();
const deployContract = require('../etherum/deploy');

router.post('/create-bet', async (req, res, next) => {
    const { body: { betValue } } = req;
    const address = await deployContract({ address, betValue });

    // console.log(23234, address)
    // mongo add
});


module.exports = router;
