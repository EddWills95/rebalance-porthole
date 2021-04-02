import { useState } from "react";
import './App.css';
import { Channel } from './components';
import useFetch from './hooks/use-fetch';
import { sortChannels } from './utils';

function App() {
  const { loading, data: channels, error } = useFetch('channels');
  const [sort, setSort] = useState('local_balance');

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
      {sortChannels(channels, sort).map(channel =>
        <Channel {...channel} />
      )}
    </div>
  );
}

export default App;
