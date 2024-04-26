import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

// Page imports
import Hero from './pages/Hero'
import Menu from './pages/Menu'
import Navbar from './components/Navbar'
import Layout from './pages/Layout'
import Serving from './pages/Serving'
import Kitchen from './pages/Kitchen'
import Order from './pages/Order'
import Signup from './pages/Signup'
import Signin from './pages/Signin'

function App() {

  return (
      <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/layout" element={<Layout />} />
            <Route path="/serving" element={<Serving />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/order" element={<Order />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
      </Router>
  )
}

export default App
