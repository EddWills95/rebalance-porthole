const express = require('express')
const app = express()
const cors = require('cors');
const morgan = require('morgan');
// const balances = require('./node_modules/balanceofsatoshis/balances');
// const rebalance = require('./node_modules/balanceofsatoshis/swaps/rebalance');

const LightningService = require('./lightning');

app.use(cors());
app.use(morgan('combined'));

app.get('/', function (req, res) {
    res.send('Hello World')
})

// Fetch all channel status
app.get('/channels', async (req, res) => {
    const getAlias = async (channel) => {
        const { alias } = await LightningService.getNode(channel.partner_public_key);
        return { ...channel, alias };
    }

    const { channels } = await LightningService.getChannels();
    const withAlias = await Promise.all(channels.map(await getAlias));

    res.json(withAlias);
});

// Active channels from this one
app.get('/wallet', async (req, res) => {
    const wallet = await LightningService.getWalletInfo();
    res.json(wallet);
})

app.post('/rebalance', (req, res) => {
    const rebalance = LightningService.rebalance(req.local, req.remote);
    res.json(rebalance);
})

// set up bos


console.log('BOS-Mode Listening on 3001');

const logger = console.log;



// lnService.getChannels({ lnd }).then((result) => {
//     console.log(result);
// });

// return swaps.rebalance({
//     logger,
//     avoid: flatten([options.avoid].filter(n => !!n)),
//     fs: {getFile: readFile},
//     in_through: options.in || undefined,
//     in_outbound: options.inTargetOutbound || undefined,
//     is_avoiding_high_inbound: options.avoidHighInbound || undefined,
//     lnd: (await lnd.authenticatedLnd({logger, node: options.node})).lnd,
//     max_fee: options.maxFee,
//     max_fee_rate: options.maxFeeRate,
//     max_rebalance: options.amount,
//     node: options.node || undefined,
//     out_channels: flatten([options.outChannel].filter(n => !!n)),
//     out_inbound: options.outTargetInbound,
//     out_through: options.out || undefined,
//     timeout_minutes: options.minutes || undefined,
//   },

// try {
//     const result = rebalance({
//         lnd,
//         logger,
//         fs: { getFile: fs.readFile },
//         // max_fee: 0,
//         // max_fee_rate: '',
//         // max_rebalance: '',

//         // Public keys of nodes we're swapping fund through
//         in_through: '659235x2354x1',
//         out_through: ''
//     }).then((result) => console.log(result)).catch(err => console.log(err));
// } catch (err) {
//     console.log(err);
// }




// lnService.getChannels({ lnd }).then((result) => {
//     console.log(result);
// });

app.listen(3001)