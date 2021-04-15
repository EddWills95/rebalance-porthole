const lnService = require('ln-service');
const fs = require('fs')

const cert = fs.readFileSync(__dirname + '/tls.cert');
const macaroon = fs.readFileSync(__dirname + '/admin.macaroon');

class Lightning {
    constructor() {
        this.lnd = lnService.authenticatedLndGrpc({
            cert,
            macaroon,
            socket: 'umbrel.local:10009',
        }).lnd;
    }

    getChannels() {
        return lnService.getChannels({ lnd: this.lnd });
    }

    getNode(public_key) {
        return lnService.getNode({ lnd: this.lnd, public_key });
    }

    getWalletInfo() {
        return lnService.getWalletInfo({ lnd: this.lnd });
    }
}


const service = new Lightning();

module.exports = service;