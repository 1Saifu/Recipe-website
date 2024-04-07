import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="App">
      <header className="App-header">
       <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/pages/Login" element={<Login />} />
        <Route path="/pages/Register" element={<Register />} />
       </Routes>
      </header>
    </div>
  );
}

export default App;
