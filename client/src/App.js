import { useEffect, useState } from "react";
import './App.scss';
import { Channel } from './components';
import useFetch from './hooks/use-fetch';
import { sortChannels } from './utils';

function App() {
  const { loading, data: channels, error } = useFetch('channels');
  const [sort, setSort] = useState('local_balance');
  const [selected, setSelected] = useState(undefined);


  const handleBalance = () => { }

  // useEffect(() => {
  //   if (selected1) {
  //     if ((selected1.local_balance / selected1.capacity) * 100 > 50) {
  //       setSort('local_balance');
  //     } else {
  //       setSort('remote_balance');
  //     }
  //   } else {
  //     setSort('local_balance');
  //   }
  // }, [selected1, selected2]);



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
        <Channel key={channel.alias} channel={channel} onSelect={setSelected} />
      )}
    </div>
  );
}

export default App;
