import { memo } from "react";
import "./style.scss";

const Balance = ({ remote_balance, local_balance }) => {
    // calculate % widths for each side

    const capacity = remote_balance + local_balance;

    const outboundStyle = {
        width: `${(local_balance / capacity) * 100}%`
    }

    const inboundStyle = {
        width: `${(remote_balance / capacity) * 100}%`
    }

    return (
        <div className="balance">
            <div className="outbound" style={{ ...outboundStyle }} />
            <div className="inbound" style={{ ...inboundStyle }} />
        </div>
    );
}

export default memo(Balance);