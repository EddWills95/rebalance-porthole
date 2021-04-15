const camelCase = require('camelcase-keys');
const express = require('express')
const app = express()
const cors = require('cors');
const morgan = require('morgan');
const websocket = require('express-ws');

// const balances = require('./node_modules/balanceofsatoshis/balances');
// const rebalance = require('./node_modules/balanceofsatoshis/swaps/rebalance');

const LightningService = require('./lightning');
const RebalanceService = require('./rebalance');
// const { rebalance } = require('./rebalance');

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
websocket(app);

app.get('/channels', async (req, res) => {
    // Get all of the channels.
    const { channels } = camelCase(await LightningService.getChannels(), { deep: true });

    // Highlight incoming / outgoing channels & add the ID so that we can rebalance
    [incomingCandidates, outgoingCandidates] = await Promise.all([
        RebalanceService.getIncomingCandidates(),
        RebalanceService.getOutgoingCandidates()
    ]);

    res.json(channels.map(channel => {
        const incoming = incomingCandidates.find((incoming) => {
            return incoming.pubkey === channel.partnerPublicKey;
        });

        const outgoing = outgoingCandidates.find((incoming) => {
            return incoming.pubkey === channel.partnerPublicKey;
        });

        if (incoming) {
            return { candidate: 'incoming', ...channel, ...incoming }
        }

        if (outgoing) {
            return { candidate: 'outgoing', ...channel, ...outgoing }
        }

        return channel;
    }));
})

app.get('/incomingCandidates', async (req, res) => {
    const data = await RebalanceService.getIncomingCandidates();

    res.json(data);
});

app.get('/outgoingCandidates', async (req, res) => {
    const data = await RebalanceService.getOutgoingCandidates();

    res.json(data);
});

app.ws('/rebalance', (ws, req) => {
    console.log('connection established');

    const sendMessage = (message) => ws.send(message);

    ws.on('message', async (msg) => {
        console.log(msg);
        const { channelId, direction } = JSON.parse(msg);
        console.log(channelId, direction);
        await RebalanceService.rebalance({ channelId, direction, sendMessage });
        ws.close();
    });
})


console.log('BOS-Mode Listening on 3001');



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