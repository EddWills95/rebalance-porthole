import React from "react";

const Message = ({ message, ...props }) => {
    const messageClasses = (message = '') => {
        let classes = ['message'];
        if (message.includes('Trying route')) {
            classes.push('trying-route');
        }

        if (message.includes('Temporary channel failure')) {
            classes.push('channel-failure');
        }

        if (message.match(/([0-9]+ to (.)*)/) && !message.includes('Skipping')) {
            classes.push('channel-path');
        }

        if (message.includes('Ignoring')) {
            classes.push('ignoring-path')
        }

        if (message.includes('Could not find any suitable route')) {
            classes.push('no-route');
        }
        return classes.join(' ');
    }

    return <p {...props} className={messageClasses(message)}>{message}</p>
}

export default Message;