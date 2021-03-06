const { spawn } = require('child_process');
const { default: Logger, constants } = require('../logger');

const Parser = require('./parser');

class RebalanceService {
    constructor() {
        this.lndDir = process.env.LND_DATA_DIR;
        this.grpc = `${process.env.LND_IP}:${process.env.LND_GRPC_PORT}`;
        this.status = '';
        this.process = undefined;
    }

    getIncomingCandidates() {
        return new Promise((resolve, reject) => {
            var dataToSend;

            try {
                const python = spawn('python3', ['./rebalance-lnd/rebalance.py', '--grpc', this.grpc, '--lnddir', this.lndDir, '-l', '-i']);

                python.stdout.on('data', function (data) {
                    dataToSend = data.toString();
                });

                python.stderr.on('data', (data) => console.log(data.toString()));

                python.on('close', code => {
                    resolve(Parser.parseChannels(dataToSend));
                })
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    getOutgoingCandidates() {
        return new Promise((resolve, reject) => {
            var dataToSend;
            try {
                const python = spawn('python3', ['./rebalance-lnd/rebalance.py', '--grpc', this.grpc, '--lnddir', this.lndDir, '-l', '-o']);

                python.stdout.on('data', function (data) {
                    dataToSend = data.toString();
                });

                python.on('close', code => {
                    resolve(Parser.parseChannels(dataToSend));
                })
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    rebalance({ channelId, direction, amount = null, feeFactor = 1, sendMessage }) {
        Logger.info(constants.REBALANCING);
        // We need a better way to clear this status
        this.status = '';

        return new Promise((resolve, reject) => {
            try {
                // The -u is the key bit here
                // It means that the stdout/err will be un-buffered
                const args = ['-u', './rebalance-lnd/rebalance.py', '--grpc', this.grpc, '--lnddir', this.lndDir, direction, channelId];

                if (amount) {
                    args.push('-a');
                    args.push(amount);
                }

                if (feeFactor) {
                    args.push('--fee-factor')
                    args.push(feeFactor);
                }

                const python = spawn('python3', args);
                this.process = python;

                python.stdout.on('data', function (data) {
                    sendMessage(JSON.stringify(data.toString()));
                });

                // This is what the python uses for debugging when balancing
                python.stderr.on('data', data => {
                    console.log(data.toString());
                    sendMessage(JSON.stringify(data.toString()));
                });

                python.on('close', code => {
                    this.python = undefined;
                    resolve(code);
                });
            } catch (error) {
                console.log(error);
                Logger.error(`Rebalancing: ${error}`);
                reject(error);
            }
        })
    }

    kill() {
        if (!this.process) {
            console.log('no python');
            return
        }

        try {
            this.process.stdout.pause();
            this.process.stderr.pause();
            this.process.kill();
        } catch (error) {
            console.log(error);
            return error;
        }

        return;
    }
}

const service = new RebalanceService();

module.exports = service;