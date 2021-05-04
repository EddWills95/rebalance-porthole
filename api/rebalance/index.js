const { spawn } = require('child_process');

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
                const python = spawn('python', ['./rebalance-py/rebalance.py', '--grpc', this.grpc, '--lnddir', this.lndDir, '-l', '-i']);

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

    getOutgoingCandidates() {
        return new Promise((resolve, reject) => {
            var dataToSend;
            try {
                const python = spawn('python', ['./rebalance-py/rebalance.py', '--grpc', this.grpc, '--lnddir', this.lndDir, '-l', '-o']);

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

    rebalance({ channelId, direction, amount = null, sendMessage }) {
        // We need a better way to clear this status
        this.status = '';

        return new Promise((resolve, reject) => {
            try {
                const args = ['-u', './rebalance-py/rebalance.py', '--grpc', this.grpc, '--lnddir', this.lndDir, direction, channelId];

                if (amount) {
                    args.push('-a');
                    args.push(amount);
                }

                // The -u is the key bit here
                const python = spawn('python', args);
                this.process = python;

                python.stdout.on('data', function (data) {
                    console.log("stdout", data.toString());
                    sendMessage(JSON.stringify(data.toString()));
                });

                // This is what the python uses for debugging when balancing
                python.stderr.on('data', data => {
                    console.log("stderr", data.toString());
                    sendMessage(JSON.stringify(data.toString()));
                });

                python.on('close', code => {
                    this.python = undefined;
                    resolve(code);
                });
            } catch (error) {
                console.log(error);
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