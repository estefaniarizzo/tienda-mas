import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock } from 'lucide-react';
import { supabase } from '../utils/supabase';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const callback = /codesandbox\.io/.test(window.location.href)
      ? 'https://www.nerd.lat/es/workspace/jx7dhs8bhskxjr696sg4c5gm717r3cqr/j9746j22bkhvbv8yvk4pfj4xs17r3dbs'
      : `${window.location.origin}/auth/callback`;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: callback
        }
      });

      if (signInError) {
        setError('Error de login: ' + signInError.message);
        return;
      }

      if (data.user) {
        // Verificar rol en tabla custom users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('email', data.user.email)
          .single();

        if (userError || !userData || userData.role !== 'admin') {
          await supabase.auth.signOut();
          setError('Acceso denegado. Solo admins pueden entrar.');
          return;
        }

        onLogin({ ...data.user, ...userData });
        onClose();
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Entrando...' : 'Iniciar Sesión Admin'}
          </motion.button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">Configura un admin en Supabase Auth primero.</p>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;