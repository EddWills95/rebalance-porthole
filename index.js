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

// Not properly updating the channel after finishing the balancing

app.get('/channels', async (req, res) => {
    // Get all of the channels.
    const { channels } = camelCase(await LightningService.getChannels(), { deep: true });

    // Highlight incoming / outgoing channels & add the ID so that we can rebalance
    [incomingCandidates, outgoingCandidates] = await Promise.all([
        RebalanceService.getIncomingCandidates(),
        RebalanceService.getOutgoingCandidates()
    ]);

    const organiseChannel = async (channel) => {
        const incoming = incomingCandidates.find((incoming) => {
            return incoming.pubkey === channel.partnerPublicKey;
        });

        const outgoing = outgoingCandidates.find((incoming) => {
            return incoming.pubkey === channel.partnerPublicKey;
        });

        // This adds loads of time to the request.
        const { alias } = await LightningService.getNode(channel.partnerPublicKey);

        if (incoming) {
            return { alias, candidate: 'incoming', ...channel, ...incoming }
        }

        if (outgoing) {
            return { alias, candidate: 'outgoing', ...channel, ...outgoing }
        }

        return { alias, ...channel };
    }

    const getData = async () => {
        return Promise.all(channels.map(channel => organiseChannel(channel)));
    }

    getData().then(data => {
        res.json(data);
    })
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
        const { channelId, direction, amount } = JSON.parse(msg);
        console.log(channelId, direction);
        await RebalanceService.rebalance({ channelId, direction, amount, sendMessage });
        ws.close();
    });
})


console.log('BOS-Mode Listening on 3001');
app.listen(3001)