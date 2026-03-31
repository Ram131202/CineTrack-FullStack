import Login from './components/Login';

function App() {
  const username = localStorage.getItem('username');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>CineTrack</h1>
      {username ? (
        <div>
          <h2>Welcome, {username}!</h2>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;