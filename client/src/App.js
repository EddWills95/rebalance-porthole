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

  const { loading, data: channels, error, refetch } = useFetch(
    sort === INCOMING ? "incomingCandidates" : "outgoingCandidates"
  );

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
      <select value={sort} onChange={({ target: { value } }) => setSort(value)}>
        <option value={INCOMING}>{INCOMING}</option>
        <option value={OUTGOING}>{OUTGOING}</option>
      </select>

      {loading && <h1>Loading...</h1>}

      {!loading && !selected && sortChannels(channels).map(channel =>
        <Channel key={channel.channelId} channel={channel} onSelect={handleSelect} />
      )}

      {selected && (
        <Rebalance channel={selected} onSelect={() => handleSelect(undefined)} refetch={refetch} />
      )}
    </div>
  );
}

export default App;
