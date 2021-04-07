const { spawn } = require('child_process');
const path = require('path');

const Parser = require('./parser');

class RebalanceService {
    constructor() {
        this.lndDir = path.resolve('./lightning');
        this.grpc = 'umbrel.local:10009';
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
}

const service = new RebalanceService();

module.exports = service;