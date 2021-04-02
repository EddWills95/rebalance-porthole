import { useEffect, useState } from "react";
import './App.scss';
import { Channel } from './components';
import useFetch from './hooks/use-fetch';
import { sortChannels } from './utils';

function App() {
  const { loading, data: channels, error } = useFetch('channels');
  const [sort, setSort] = useState('local_balance');
  const [selected, setSelected] = useState(undefined);

  useEffect(() => {
    if (selected && (selected.local_balance / selected.capacity) * 100 > 50) {
      setSort('local_balance');
    } else {
      setSort('remote_balance');
    }
  }, [selected]);

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>
  }

  return (
    <div className="bos-mode">
      <select value={sort} onChange={({ target: { value } }) => setSort(value)}>
        <option value="local_balance">Local Balance</option>
        <option value="remote_balance">Remote Balance</option>
        <option value=''>None</option>
      </select>

      {selected &&
        <>
          <Channel channel={selected} onSelect={() => setSelected(undefined)} />
          <p>⬇️</p>
        </>
      }

      {sortChannels(channels, sort).map(channel =>
        <Channel channel={channel} onSelect={setSelected} selected={channel === selected} />
      )}
    </div>
  );
}

export default App;
