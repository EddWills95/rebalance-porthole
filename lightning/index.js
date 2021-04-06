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