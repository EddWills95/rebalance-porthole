const sorters = ['local_balance', 'remote_balance'];

const sortChannels = (channels, key = "local_balance") => {
    if (!sorters.includes(key)) {
        return channels;
    }

    const calculatePercentage = (channel) => {
        return (channel[key] / channel.capacity) * 100;
    }

    return channels.sort((a, b) => {
        if (calculatePercentage(a) < calculatePercentage(b)) return -1;
        if (calculatePercentage(a) > calculatePercentage(b)) return 1;
        return 0;
    })
}

export default sortChannels;