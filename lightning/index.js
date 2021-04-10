const lnService = require('ln-service');
const rebalance = require('balanceofsatoshis/swaps/rebalance');
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
        return lnService.getNode({ lnd: this.lnd, public_key })
    }

    getWalletInfo() {
        return lnService.getWalletInfo({ lnd: this.lnd });
    }

    balance(local, remote) {
        try {
            return rebalance({
                max_fee: 0,
                out_through: local,
                in_through: remote,
                // Temp
                max_fee: 1
                // We should test for avoids.
            });
        } catch (error) {
            console.log(error);
        }
    }
}


const service = new Lightning();

module.exports = service;