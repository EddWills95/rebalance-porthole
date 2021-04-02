import { Balance } from "../index";
import "./style.scss";

const Channel = ({ channel, onSelect, selected }) => {
    if (selected) {
        return null;
    }

    return (
        <div className="channel" onClick={() => onSelect(channel)}>
            <p className="alias">
                {channel.alias}
            </p>
            {/* <div className="balance" /> */}
            <Balance local_balance={channel.local_balance} remote_balance={channel.remote_balance} />
            <div className="capacity">
                <p className="value">{channel.local_balance}</p>
                <p className="value">{channel.remote_balance}</p>
            </div>
        </div>
    )
}


export default Channel;