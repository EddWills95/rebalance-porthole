require('dotenv').config()
const camelCase = require('camelcase-keys');
const express = require('express')
const app = express()
const cors = require('cors');
const morgan = require('morgan');
const websocket = require('express-ws');

const Logger = require('./logger');
const LightningService = require('./lightning');
const RebalanceService = require('./rebalance');

app.use(cors());
app.use(morgan('combined', { stream: Logger.stream }));
app.use(express.json());
websocket(app);

app.get('/channel/:pubkey', async (req, res) => {
    const { channels } = camelCase(await LightningService.getChannels(), { deep: true });

    const channel = channels.filter(channel => channel.partnerPublicKey === req.params.pubkey)[0];

    res.json(channel);
})

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
    const sendMessage = (message) => ws.send(message);

    ws.on('message', async (msg) => {
        if (JSON.parse(msg) === 'CANCEL') {
            console.log('Cancelling');
            RebalanceService.kill();
            return;
        }

        const { channelId, direction, amount, feeFactor } = JSON.parse(msg);
        await RebalanceService.rebalance({ channelId, direction, amount, sendMessage, feeFactor });
    });
})

app.listen(3001)
console.log('BOS-Mode Listening on 3001');