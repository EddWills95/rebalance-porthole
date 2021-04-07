const dataPoints = ['Pubkey', 'Channel Point', 'Local ratio', 'Capacity', 'Remote balance', 'Local balance', 'Amount for 50-50']

const camelCase = require('../utils/camelCase');

class Parser {

    parseChannels(string) {
        const splitStrings = string.split(/\([0-9]*\)*/);

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
                    if (dataPoint == dataPoints[0] || dataPoint == dataPoints[1]) {
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