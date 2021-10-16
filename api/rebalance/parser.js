const dataPoints = ['Channel ID', 'Alias', 'Pubkey', 'Channel Point', 'Local ratio', 'Capacity', 'Remote available', 'Local available', 'Rebalance amount']
const stringDataPoints = [dataPoints[0], dataPoints[1], dataPoints[2]]

const camelCase = require('../utils/camelCase');

class Parser {
    parseChannels(string) {
        const splitStrings = string.split(/(\[\W*]\n)/);

        const objects = splitStrings.map(string => this._createChannelObject(string)).filter(Boolean);

        return objects;
    }

    // Takes each bit of info and splits on it
    _createChannelObject(channelString) {
        const channelObject = {};
        const channelStringData = channelString.split(/\n/);

        channelStringData.forEach((channelString) => {
            dataPoints.forEach(dataPoint => {
                if (channelString.includes(dataPoint)) {
                    var value = channelString.split(`${dataPoint}:`)[1].trimLeft().replace(/,/g, '');
                    if (stringDataPoints.includes(dataPoint)) {
                        channelObject[camelCase(dataPoint)] = value;
                    } else {
                        channelObject[camelCase(dataPoint)] = parseFloat(value);
                    }
                }
            })
        });

        if (channelObject && JSON.stringify(channelObject) !== '{}') {
            return channelObject;
        }
    }

}

const service = new Parser();

module.exports = service;