import { memo, useEffect, useState } from "react";
import "./style.scss";

const Balance = ({ remote_balance, local_balance }) => {
    const [outboundWidth, setOutboundWidth] = useState('0%');
    const [inboundWidth, setInboundWidth] = useState('0%');

    // calculate % widths for each side
    const capacity = remote_balance + local_balance;

    useEffect(() => {
        setOutboundWidth(`${(local_balance / capacity) * 100}%`);
        setInboundWidth(`${(remote_balance / capacity) * 100}%`)
    }, []);

    return (
        <div className="balance">
            <div className="outbound" style={{ width: outboundWidth }} />
            <div className="inbound" />
        </div>
    );
}

export default memo(Balance);