import { Balance } from "../index";
import "./style.scss";

const Channel = ({ channel, onSelect, selected }) => {
    if (selected) {
        return null;
    }

    return (
        <div className="channel" onClick={() => onSelect(channel)}>
            <p className="alias">
                {channel.pubkey}
            </p>
            {/* <div className="balance" /> */}
            <Balance local_balance={channel.localBalance} remote_balance={channel.remoteBalance} />
            <div className="capacity">
                <p className="value">Local: {channel.localBalance}</p>
                <p className="value">Remote: {channel.remoteBalance}</p>
            </div>
        </div>
    )
}


export default Channel;