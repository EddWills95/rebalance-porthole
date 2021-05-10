const fs = require('fs');
const lnService = require('ln-service');
const { default: Logger, constants } = require('../logger')

const cert = fs.readFileSync(process.env.LND_DATA_DIR + '/tls.cert');
const macaroon = fs.readFileSync(process.env.LND_DATA_DIR + '/data/chain/bitcoin/mainnet/admin.macaroon');

class Lightning {
    constructor() {
        this.lnd = lnService.authenticatedLndGrpc({
            cert,
            macaroon,
            socket: `${process.env.LND_IP}:${process.env.LND_GRPC_PORT}`
        }).lnd;
    }

    getChannels() {
        Logger.info(constants.GET_CHANNELS);
        return lnService.getChannels({ lnd: this.lnd });
    }

    getNode(public_key) {
        Logger.info(`${constants.GET_NODE} :: ${public_key}`);
        return lnService.getNode({ lnd: this.lnd, public_key });
    }

    getWalletInfo() {
        Logger.info(constants.GET_WALLET_INFO);
        return lnService.getWalletInfo({ lnd: this.lnd });
    }
}


const service = new Lightning();

module.exports = service;