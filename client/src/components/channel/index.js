import { Balance } from "../index";
import { ReactComponent as ArrowBack } from "./arrow_back_black_24dp.svg"
import { ReactComponent as ArrowForward } from "./arrow_forward_black_24dp.svg";

import "./style.scss";

const Channel = ({ channel, onSelect, selected }) => {
    if (selected) {
        return null;
    }

    const isCandidate = channel.candidate;
    // Add something if the channel is closing / opening
    // maybe a flash?

    return (
        <div className={`channel ${isCandidate ? '' : 'not-candidate'}`} onClick={() => isCandidate && onSelect(channel)}>
            <p className="alias">
                {isCandidate && (channel.candidate === 'incoming' ? <ArrowForward /> : <ArrowBack />)}
                {channel.alias}
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