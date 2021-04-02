import "./style.scss";

const Channel = ({ alias }) => {
    return (
        <div className="channel">
            <p className="alias">
                {alias}
            </p>
            <div className="balance" />
            <div className="capacity">
                <p className="value">1000</p>
                <p className="value">20000</p>
            </div>
        </div>
    )
}

export default Channel;