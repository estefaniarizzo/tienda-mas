import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ProductList from './components/ProductList';
import WhatsAppButton from './components/WhatsAppButton';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import AuthCallback from './components/AuthCallback';
import { supabase } from './utils/supabase';

const AppContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [session, setSession] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session) {
      setIsLoggedIn(true);
      // Cargar datos del usuario desde la tabla "users"
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();
      const loggedUser = { ...session.user, ...userData };
      setUser(loggedUser);

      // 🚀 Redirigir admin automáticamente al panel
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      }
    }

    supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
      if (newSession) {
        setIsLoggedIn(true);
        supabase
          .from('users')
          .select('*')
          .eq('email', newSession.user.email)
          .single()
          .then(({ data }) => {
            const loggedUser = { ...newSession.user, ...data };
            setUser(loggedUser);

            // 🚀 Redirigir admin automáticamente al panel
            if (loggedUser.role === 'admin') {
              navigate('/admin');
            }
          });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todas' || product.category === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);

    // 🚀 Redirigir admin si entra manualmente
    if (userData.role === 'admin') {
      navigate('/admin');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setShowLogin(false);
    navigate('/');
  };

  const handleWhatsApp = (product) => {
    setCurrentProduct(product);
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      setShowLogin(true);
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        onLoginClick={handleLoginClick}
        isLoggedIn={isLoggedIn}
        userRole={user?.role || ''}
      />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      {currentProduct && <WhatsAppButton product={currentProduct} />}
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/"
          element={
            <motion.main
              className="container mx-auto px-4 py-8 max-w-7xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <ProductList
                products={filteredProducts}
                onWhatsApp={handleWhatsApp}
                loading={loading}
                error={error}
              />
            </motion.main>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/admin"
          element={
            isLoggedIn && user?.role === 'admin' ? (
              <AdminPanel onLogout={handleLogout} onProductAdded={handleProductAdded} user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <CartProvider>
      <AppContent />
    </CartProvider>
  </Router>
);

export default App;
