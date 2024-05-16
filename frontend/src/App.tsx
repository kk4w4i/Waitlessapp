import './App.css'

import { FC, ReactElement } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { CookiesProvider } from 'react-cookie'
import Hero from './pages/Hero'
import Kitchen from './pages/Kitchen/Kitchen';
import KitchenDemo from './pages/demos/KitchenDemo'
import Layout from './pages/Layout'
import LayoutDemo from './pages/demos/LayoutDemo'
import Menu from './pages/Menu/Menu'
import MenuDemo from './pages/demos/MenuDemo'
import Navbar from './components/Navbar'
import Order from './pages/Order'
import OrderDemo from './pages/demos/OrderDemo'
import Serving from './pages/Serving/Serving'
import ServingDemo from './pages/demos/ServingDemo'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import { StoreProvider } from './context/StoreContext';
import User from './pages/User'
import { useUser } from './hooks/useUser';

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element: element }) => {
  const { userId } = useUser()

  return userId ? element : <Navigate to="/signin/" replace />;
};

function App() {

  return (
      <Router>
        <CookiesProvider>
          <StoreProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Hero />} />
               <Route path="/user" element={<ProtectedRoute element={<User />} />} />
              <Route path="/menu/:store-url" element={<ProtectedRoute element={<Menu />} />} />
              <Route path="/layout/:store-url" element={<ProtectedRoute element={<Layout />} />} />
              <Route path="/serving/:store-url" element={<ProtectedRoute element={<Serving />} />} />
              <Route path="/kitchen/:store-url" element={<ProtectedRoute element={<Kitchen />} />} />
              <Route path="/order" element={<Order />} />
              <Route path="/demo/menu" element={<MenuDemo />} />
              <Route path="/demo/layout" element={<LayoutDemo />} />
              <Route path="/demo/serving" element={<ServingDemo />} />
              <Route path="/demo/kitchen" element={<KitchenDemo />} />
              <Route path="/demo/order" element={<OrderDemo />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </StoreProvider>
        </CookiesProvider>
      </Router>
  )
}

export default App
