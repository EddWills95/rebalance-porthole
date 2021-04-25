import { memo, useEffect, useState } from "react";
import "./style.scss";

const Balance = ({ remote_balance, local_balance }) => {
    const [outboundWidth, setOutboundWidth] = useState('0%');

    // calculate % widths for each side
    const capacity = remote_balance + local_balance;

    useEffect(() => {
        setOutboundWidth(`${(local_balance / capacity) * 100}%`);
    }, [local_balance, capacity]);

    return (
        <div className="balance">
            <div className="outbound" style={{ width: outboundWidth }} />
        </div>
    );
}

export default memo(Balance);