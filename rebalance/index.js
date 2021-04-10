const { spawn } = require('child_process');
const path = require('path');

const Parser = require('./parser');

const STATUS = {
    DONE: "DONE"
}

class RebalanceService {
    constructor() {
        this.lndDir = path.resolve('./lightning');
        this.grpc = 'umbrel.local:10009';
        this.status = '';
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

    rebalance({ channelId, direction, sendMessage }) {
        // We need a better way to clear this status
        this.status = '';

        return new Promise((resolve, reject) => {
            try {
                const python = spawn('python', ['./rebalance-py/rebalance.py', '--grpc', this.grpc, '--lnddir', this.lndDir, direction, channelId]);

                python.stdout.on('data', function (data) {
                    console.log("stdout", data.toString());
                    sendMessage(JSON.stringify(data.toString()));
                });

                // This is what the python uses for debugging when balancing
                // python.stderr.on('data', data => {
                //     console.log("stderr", data.toString());
                //     sendMessage(JSON.stringify(data.toString()));
                // })

                python.on('close', code => {
                    resolve(code);
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }
}

const service = new RebalanceService();

module.exports = service;