import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import Login from './login/Login.jsx'
import Register from './register/Register.jsx'
import Recognition from './recognition/Recognition.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Recognition/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </Router>
  )
};

export default App;