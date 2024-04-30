import { FC, ReactElement } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { StoreProvider } from './context/StoreContext';
// Page imports

// Public Pages
import Hero from './pages/Hero'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Signin from './pages/Signin'

// Protected Pages
import Menu from './pages/Menu'
import User from './pages/User'

// Demo Pages
import MenuDemo from './pages/demos/MenuDemo'
import LayoutDemo from './pages/demos/LayoutDemo'
import ServingDemo from './pages/demos/ServingDemo'
import KitchenDemo from './pages/demos/KitchenDemo'
import OrderDemo from './pages/demos/OrderDemo'

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element: element }) => {
  const token = localStorage.getItem('access-token');
  console.log(token);

  return token ? element : <Navigate to="/signin/" replace />;
};

function App() {

  return (
      <Router>
        <StoreProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/user" element={<User />}/>
            <Route path="/user" element={<ProtectedRoute element={<User />} />} />
            <Route path="/menu/:store-url" element={<ProtectedRoute element={<Menu />} />} />
            <Route path="/demo/menu" element={<MenuDemo />} />
            <Route path="/demo/layout" element={<LayoutDemo />} />
            <Route path="/demo/serving" element={<ServingDemo />} />
            <Route path="/demo/kitchen" element={<KitchenDemo />} />
            <Route path="/demo/order" element={<OrderDemo />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </StoreProvider>
      </Router>
  )
}

export default App
