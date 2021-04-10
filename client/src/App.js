import { useEffect, useState } from "react";
import './App.scss';
import { Channel } from './components';
import Rebalance from "./components/rebalance";
import useFetch from './hooks/use-fetch';
import { sortChannels } from './utils';

const INCOMING = "Incoming";
const OUTGOING = "Outgoing";

function App() {
  const [sort, setSort] = useState(INCOMING);
  const [selected, setSelected] = useState(undefined);

  const { loading, data: channels, error } = useFetch(
    sort === INCOMING ? "incomingCandidates" : "outgoingCandidates"
  );

  // This works well but we need a way to know if we're waiting for a rebalance
  // We also need to refresh the data after a fetch

  // useEffect(() => {
  //   let timer = setInterval(() => {
  //     fetch('http://localhost:3001/status').then(data => data.json()).then((d) => {
  //       setRebalancingState(d)
  //     })
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timer);
  //   }
  // }, []);

  const handleSelect = (channel) => {
    if (selected === channel) {
      return setSelected(undefined);
    }

    setSelected(channel);
  }

  const handleBalance = () => {
    const ws = new WebSocket('ws://localhost:3001/rebalance');

  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>
  }

  // If local balance is less than remote we do a -t
  // if remote is larger than local we do a -f 

  return (
    <div className="bos-mode">
      <select value={sort} onChange={({ target: { value } }) => setSort(value)}>
        <option value={INCOMING}>{INCOMING}</option>
        <option value={OUTGOING}>{OUTGOING}</option>
      </select>

      {loading && <h1>Loading...</h1>}

      {!loading && !selected && sortChannels(channels).map(channel =>
        <Channel key={channel.channelId} channel={channel} onSelect={handleSelect} />
      )}

      {selected && (
        <Rebalance channel={selected} onSelect={() => handleSelect(undefined)} />
      )}
    </div>
  );
}

export default App;
