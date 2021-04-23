import { useState, useContext, useEffect } from "react";
import './App.scss';
import { Channel } from './components';
import Rebalance from "./components/rebalance";
import { sortChannels } from './utils';

import { ReactComponent as BackArrow } from "./components/channel/arrow_back_black_24dp.svg";
import { store } from "./store/store";
import { SET_LOADING_TRUE, FETCH_CHANNELS, SET_LOADING_FALSE } from "./store/actions";

function App() {
  const [selected, setSelected] = useState(undefined);
  const { state: { channels, loading, error }, dispatch } = useContext(store);

  useEffect(() => {
    const fetchChannels = async () => {
      dispatch(SET_LOADING_TRUE);

      const response = await fetch('http://localhost:3001/channels');
      const channels = await response.json();

      dispatch({ ...FETCH_CHANNELS, payload: channels });
      dispatch(SET_LOADING_FALSE);
    }

    if (!channels.length) {
      // Fetch channels from API
      fetchChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (channel) => {
    if (selected === channel) {
      return setSelected(undefined);
    }

    setSelected(channel);
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>
  }

  return (
    <div className="bos-mode">
      <h1>🤖 BOS-Mode ⚡️</h1>

      {loading && <h1>Loading...</h1>}

      {!loading && !selected && sortChannels(channels).map(channel =>
        <Channel key={channel.partnerPublicKey} channel={channel} onSelect={handleSelect} />
      )}

      {selected && (
        <>
          <BackArrow className="back-arrow" onClick={() => handleSelect(undefined)} />
          <Rebalance channel={selected} onSelect={() => handleSelect(undefined)} onRebalance={() => { }} />
        </>
      )}
    </div>
  );
}

export default App;
