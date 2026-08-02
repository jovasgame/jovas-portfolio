import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Shield, Eye, EyeOff, AlertCircle, CheckCircle2, X, KeyRound, Flame } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdmin } = usePortfolio();

  const [username, setUsername] = useState('JovasMotion');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const isAuthorized = await loginAdmin(username.trim(), password.trim());

    if (isAuthorized) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
      }, 1000);
    } else {
      setErrorMsg('Usuario o contraseña incorrectos. Verifica tus credenciales de administrador.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        
        {/* Backdrop click to close */}
        <div 
          className="fixed inset-0"
          onClick={() => setIsLoginModalOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#1e1c21] border border-[#feba39]/30 rounded-3xl shadow-2xl overflow-hidden z-10 p-8 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#a89f9e] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff5540] to-[#feba39] p-[1px] mx-auto shadow-lg shadow-[#ff5540]/30">
              <div className="w-full h-full bg-[#141316] rounded-[15px] flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-[#feba39]" />
              </div>
            </div>

            <h3 className="font-syne font-black text-2xl text-white">
              Panel de Control Privado
            </h3>

            <p className="text-xs text-[#a89f9e]">
              Inicia sesión con tus credenciales de propietario para editar proyectos en tiempo real.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <p className="font-bold text-white text-sm">¡Acceso Concedido! Abriendo Dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89f9e] uppercase block">
                  Usuario Administrador
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#feba39] transition-colors"
                  />
                  <Shield className="w-4 h-4 text-[#a89f9e] absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#a89f9e] uppercase block">
                  Contraseña Privada
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#feba39] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#a89f9e] absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#a89f9e] hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Hint Info */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[#a89f9e] flex items-center justify-between">
                <span>Usuario: <strong className="text-white">JovasMotion</strong></span>
                <span className="text-[#feba39] font-mono">Credencial Cifrada</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5540] to-[#feba39] text-[#2c1800] font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#ff5540]/20 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
              >
                Ingresar al Dashboard
              </button>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
