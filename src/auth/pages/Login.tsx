import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiLoader, FiShield, FiBriefcase, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { loginSchema, LoginFields } from '../utils/validation';
import { Logo } from '../../components/Logo';

export const Login: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect path
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRoleRedirect = (role: string) => {
    const cleanRole = role.toLowerCase();
    if (from && from.startsWith(`/${cleanRole}`)) {
      navigate(from, { replace: true });
    } else {
      if (cleanRole === 'admin') navigate('/admin', { replace: true });
      else if (cleanRole === 'partner') navigate('/partner', { replace: true });
      else if (cleanRole === 'client') navigate('/client', { replace: true });
      else navigate('/', { replace: true });
    }
  };

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true);
    try {
      const session = await login(data.email, data.password);
      toast.success(`Welcome back, ${session.name}!`);
      handleRoleRedirect(session.role);
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (usernameOrEmail: string, pass: string) => {
    setValue('email', usernameOrEmail);
    setValue('password', pass);
    setIsLoading(true);
    try {
      const session = await login(usernameOrEmail, pass);
      toast.success(`Signed in as ${session.name} (${session.role})`);
      handleRoleRedirect(session.role);
    } catch (error: any) {
      toast.error(error.message || 'Quick login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const session = await loginWithGoogle();
      toast.success(`Signed in as ${session.name}`);
      handleRoleRedirect(session.role);
    } catch (error: any) {
      toast.error(error.message || 'Google Sign-In failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 transition-colors duration-300">
      
      {/* Left Column: Media Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 overflow-hidden items-center justify-center">
        {/* Animated background highlights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[150px] animate-pulse-slow" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        {/* Luxury background */}
        <img 
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200" 
          alt="Luxury stage production" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
        />
        
        {/* Overlay copy card */}
        <div className="relative z-10 max-w-lg p-12 text-left space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-amber-500 text-xs font-bold tracking-widest uppercase hover:underline">
            <FiArrowLeft /> Back to Website
          </Link>
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white leading-tight">
            Curating Masterpiece <br />
            <span className="text-gradient-gold">Experiences</span>
          </h2>
          <p className="text-zinc-400 font-light leading-relaxed text-sm">
            Log in to access your event design console, collaborate on active structural layouts, inspect invoices, and track milestone details down to the second.
          </p>

          {/* Quick Demo Access Badges */}
          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-zinc-400 block">
              1-Click Demo Credentials:
            </span>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FiShield size={13} /> Admin (admin / admin123)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('partner1@gowthamevents.com', 'partner123')}
                className="px-3.5 py-1.5 rounded-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FiBriefcase size={13} /> Partner (partner1@gowthamevents.com)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sophia@gowthamevents.com', 'client123')}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FiUser size={13} /> Client (sophia@gowthamevents.com)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative overflow-hidden">
        {/* Mobile floating background elements */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-amber-500/5 blur-[50px] pointer-events-none lg:hidden" />
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo header */}
          <div className="text-center lg:text-left space-y-2">
            <Link to="/" className="inline-flex items-center gap-3 group select-none mb-4">
              <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-md">
                <Logo size={22} className="text-neutral-950" />
              </span>
              <div className="flex flex-col text-left">
                <span className="font-heading font-bold text-lg tracking-wider text-neutral-900 dark:text-zinc-50">
                  GOWTHAM
                </span>
                <span className="text-[8px] font-heading font-bold tracking-[0.25em] uppercase text-amber-500/90 -mt-1">
                  EVENTS
                </span>
              </div>
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 dark:text-zinc-100">
              Welcome back
            </h1>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 font-light leading-relaxed">
              Enter your credentials to access your protected workspace dashboard.
            </p>
          </div>

          {/* Mobile Quick Test Chips */}
          <div className="lg:hidden p-3.5 rounded-2xl bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 space-y-2">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 block">
              1-Click Demo Login:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-semibold"
              >
                Admin (admin / admin123)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('partner1@gowthamevents.com', 'partner123')}
                className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold"
              >
                Partner
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sophia@gowthamevents.com', 'client123')}
                className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
              >
                Client
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username / Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                Username or Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoCapitalize="none"
                  placeholder="admin or admin@gowthamevents.com"
                  {...register('email')}
                  className="w-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-zinc-400 block">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="admin123"
                  {...register('password')}
                  className="w-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:border-amber-500 text-neutral-900 dark:text-zinc-100 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-neutral-300 dark:border-zinc-800 text-amber-500 accent-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2.5 text-xs text-neutral-600 dark:text-zinc-400 cursor-pointer select-none">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md hover:shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all duration-300 cursor-pointer"
            >
              {isLoading ? (
                <FiLoader className="animate-spin text-lg" />
              ) : (
                'Access Portal'
              )}
            </button>
          </form>

          {/* Social Sign-In */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute left-0 right-0 h-[1px] bg-neutral-200 dark:bg-zinc-800" />
            <span className="relative z-10 px-4 text-[10px] uppercase font-bold tracking-widest text-neutral-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950">
              Or Clients can
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 border border-neutral-300 dark:border-zinc-800 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-700 dark:text-zinc-300 active:scale-95 disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            {isGoogleLoading ? (
              <FiLoader className="animate-spin text-sm" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Registration Links */}
          <div className="text-center text-xs text-neutral-500 dark:text-zinc-500 font-light space-y-2">
            <div>
              New client?{' '}
              <Link to="/register/client" className="text-amber-500 font-semibold hover:underline">
                Create Client Account
              </Link>
            </div>
            <div>
              <Link to="/register/admin" className="text-[11px] text-neutral-400 dark:text-zinc-500 hover:text-amber-500 hover:underline">
                Register Administrator Console
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
