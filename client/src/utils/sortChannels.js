const sortChannels = (channels, reverse = false) => {
    const sortByRatio = channels.sort((a, b) => {
        if (a.localRatio < b.localRatio) return -1;
        if (a.localRatio > b.localRatio) return 1;
        return 0;
    });

    const sortByCandidateStatus = sortByRatio.sort((a, b) => {
        if (!a.candidate && b.candidate) return 1;
        if (a.candidate && !b.candidate) return -1;
        return 0;
    })

    if (reverse) {
        return sortByCandidateStatus.reverse();
    }

    return sortByCandidateStatus;
}

export default sortChannels;