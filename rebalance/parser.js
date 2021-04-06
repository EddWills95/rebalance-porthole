const dataPoints = ['Pubkey', 'Channel Point', 'Local ratio', 'Capacity', 'Remote balance', 'Local balance', 'Amount for 50-50']

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
                    channelObject[dataPoint] = channelString.split(`${dataPoint}:`)[1];
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