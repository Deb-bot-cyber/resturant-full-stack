import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import MenuManager from './pages/Admin/MenuManager';
import Orders from './pages/Admin/Orders';
import UsersManager from './pages/Admin/UsersManager';
import ReviewsManager from './pages/Admin/ReviewsManager';
import POS from './pages/Admin/POS';
import EventsManager from './pages/Admin/EventsManager';
import FinanceManager from './pages/Admin/FinanceManager';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import { Toaster } from 'react-hot-toast';

import CategoryManager from './pages/Admin/CategoryManager';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#111111',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.05)',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="reviews" element={<ReviewsManager />} />
          <Route path="events" element={<EventsManager />} />
        </Route>
      </Routes>
      <AuthModal />
      <CartSidebar />
    </>
  );
}

export default App;
