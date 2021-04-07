import { useEffect, useState } from "react";
import './App.scss';
import { Channel } from './components';
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

  if (error) {
    return <p>{JSON.stringify(error)}</p>
  }

  return (
    <div className="bos-mode">
      <select value={sort} onChange={({ target: { value } }) => setSort(value)}>
        <option value={INCOMING}>{INCOMING}</option>
        <option value={OUTGOING}>{OUTGOING}</option>
      </select>

      {loading && <h1>Loading...</h1>}

      {!selected && sortChannels(channels, sort).map(channel =>
        <Channel key={channel.alias} channel={channel} onSelect={setSelected} />
      )}

      {selected && (
        <Channel channel={selected} onSelect={() => setSelected(undefined)} />
      )}
    </div>
  );
}

export default App;
