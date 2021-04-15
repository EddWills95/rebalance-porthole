import { useEffect, useState } from "react";
import './App.scss';
import { Channel } from './components';
import Rebalance from "./components/rebalance";
import useFetch from './hooks/use-fetch';
import { sortChannels } from './utils';

import { ReactComponent as BackArrow } from "./components/channel/arrow_back_black_24dp.svg";

function App() {
  const [selected, setSelected] = useState(undefined);

  const { loading, data: channels, error, refetch } = useFetch('channels');

  const handleSelect = (channel) => {
    if (selected === channel) {
      return setSelected(undefined);
    }

    setSelected(channel);
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>
  }

  // If local balance is less than remote we do a -t
  // if remote is larger than local we do a -f 

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
          <Rebalance channel={selected} onSelect={() => handleSelect(undefined)} onRebalance={refetch} />
        </>
      )}
    </div>
  );
}

export default App;
