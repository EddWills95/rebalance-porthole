const sortChannels = (channels, reverse = false) => {
    const sorted = channels.sort((a, b) => {
        if (a.localRatio < b.localRatio) return -1;
        if (a.localRatio > b.localRatio) return 1;
        return 0;
    });

    if (reverse) {
        return sorted.reverse();
    }

    return sorted;
}

export default sortChannels;