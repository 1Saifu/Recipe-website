import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Homepage</h2>
       <Routes>
       <Route path="/" element={<Home />} />
       </Routes>
      </header>
    </div>
  );
}

export default App;
