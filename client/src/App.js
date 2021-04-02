import { useEffect, useState } from "react";
import './App.scss';
import { Channel } from './components';
import useFetch from './hooks/use-fetch';
import { sortChannels } from './utils';

function App() {
  const { loading, data: channels, error } = useFetch('channels');
  const [sort, setSort] = useState('local_balance');
  const [selected1, setSelected1] = useState(undefined);
  const [selected2, setSelected2] = useState(undefined);

  const handleSelect = (channel) => {

    if (selected1 === channel) {
      setSelected1(undefined);
      setSelected2(undefined);
      return;
    }

    if (!selected1) {
      setSelected1(channel);
      return;
    }


    if (selected1 && !selected2) {
      setSelected2(channel);
      return;
    }

    if (selected1 && selected2) {

      if (channel === selected2) {
        setSelected2(undefined);
        return;
      }

      if (channel === selected1) {
        setSelected1(undefined);
        setSelected2(undefined);
        return;
      }
    }
  }

  const handleBalance = () => {

  }

  useEffect(() => {
    if (selected1) {
      if ((selected1.local_balance / selected1.capacity) * 100 > 50) {
        setSort('local_balance');
      } else {
        setSort('remote_balance');
      }
    } else {
      setSort('local_balance');
    }
  }, [selected1, selected2]);



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

      {selected1 &&
        <>
          <Channel channel={selected1} onSelect={handleSelect} />
          <p>⬇️</p>
        </>
      }

      {selected2 &&
        <Channel channel={selected2} onSelect={handleSelect} />
      }

      {!selected2 && sortChannels(channels, sort).map(channel =>
        <Channel key={channel.alias} channel={channel} onSelect={handleSelect} selected={channel === selected1} />
      )}

      {selected1 && selected2 && (
        <>
          <span>Time to do some balancing</span>
          <button onClick={handleBalance}>BALANCE</button>
        </>
      )}
    </div>
  );
}

export default App;
