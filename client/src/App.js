import { useContext, useEffect, useState } from "react";
import { Channel, Rebalance } from './components';
import { ReactComponent as BackArrow } from "./components/channel/arrow_back_black_24dp.svg";
import { FETCH_CHANNELS, SET_LOADING_FALSE, SET_LOADING_TRUE } from "./store/actions";
import { store, INCOMING, OUTGOING } from "./store/store";
import { Radio } from "antd";

import './App.scss';


const CANDIDATE_DIRECTION_OPTIONS = [{ label: "Incoming", value: INCOMING }, { label: "Outgoing", value: OUTGOING }];

function App() {
  const [candidateDirection, setCandidateDirection] = useState(INCOMING);
  const [selected, setSelected] = useState(undefined);
  const { state: { channels, loading, error }, dispatch } = useContext(store);

  const fetchChannels = async (direction = INCOMING) => {
    dispatch({ type: SET_LOADING_TRUE });

    const response = await fetch(`http://${process.env.REACT_APP_API_URL}/${direction === INCOMING ? 'incomingCandidates' : 'outgoingCandidates'}`);
    const channels = await response.json();

    dispatch({ type: FETCH_CHANNELS, payload: channels });
    dispatch({ type: SET_LOADING_FALSE });
  }

  useEffect(() => {
    if (!channels.length) {
      // Fetch channels from API
      fetchChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleCandidateDirectionChange = ({ target: { value } }) => {
    fetchChannels(value);

    setCandidateDirection(value);
  }

  const handleSelect = (channel) => {
    if (!channel) {
      return setSelected(undefined);
    }

    if (selected === channel.pubkey) {
      return setSelected(undefined);
    }

    setSelected(channel.pubkey);
  }

  const getSelectedChannel = () => {
    return channels.find(c => c.pubkey === selected);
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>
  }

  return (
    <div className="bos-mode">
      <h1>🤖 BOS-Mode ⚡️</h1>

      <Radio.Group
        disabled={loading}
        options={CANDIDATE_DIRECTION_OPTIONS}
        onChange={handleCandidateDirectionChange}
        value={candidateDirection}
        optionType="button"
      />

      {loading && <h1>Loading...</h1>}

      {!loading && !selected && channels.map(channel =>
        <Channel key={channel.pubkey} channel={channel} onSelect={handleSelect} />
      )}

      {selected && (
        <>
          <BackArrow className="back-arrow" onClick={() => handleSelect(undefined)} />
          <Rebalance channel={getSelectedChannel()} onSelect={() => handleSelect(undefined)} onRebalance={() => { }} />
        </>
      )}
    </div>
  );
}

export default App;
