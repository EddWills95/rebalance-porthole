import './App.css';
import { Channel } from './components';
import useFetch from './hooks/use-fetch';

function App() {
  const { loading, data: channels, error } = useFetch('channels');

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>
  }

  return (
    <div className="bos-mode">
      {channels.map(channel =>
        <Channel {...channel} />
      )}
    </div>
  );
}

export default App;
