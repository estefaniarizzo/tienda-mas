import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session && !error) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    };

    if (location.pathname === '/auth/callback') {
      handleCallback();
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando...</p>
      </div>
    </div>
  );
};

export default AuthCallback;