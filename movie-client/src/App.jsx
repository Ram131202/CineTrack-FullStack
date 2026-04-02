import { Routes, Route, Link } from 'react-router-dom';
import MovieSearch from './components/MovieSearch';
import Watchlist from './components/Watchlist';
import Login from './components/Login';
import Register from './components/Register'; // Ensure the path matches where you saved the file

function App() {
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '1rem', 
        backgroundColor: '#2c3e50', 
        color: 'white' 
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>CineTrack</h2>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Search</Link>
          {username && <Link to="/watchlist" style={{ color: 'white', textDecoration: 'none' }}>My Watchlist</Link>}
        </div>
        
        <div>
          {username ? (
            <>
              <span>{username} </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<MovieSearch />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;