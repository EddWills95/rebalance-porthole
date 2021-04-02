import { Balance } from "../index";
import "./style.scss";

const Channel = ({ alias, remote_balance, local_balance, ...channel }) => (
    <div className="channel">
        <p className="alias">
            {alias}
        </p>
        {/* <div className="balance" /> */}
        <Balance local_balance={local_balance} remote_balance={remote_balance} />
        <div className="capacity">
            <p className="value">{local_balance}</p>
            <p className="value">{remote_balance}</p>
        </div>
    </div>
)


export default Channel;