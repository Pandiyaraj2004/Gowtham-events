import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiKey, FiEye, FiEyeOff, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { adminRegisterSchema, AdminRegisterFields } from '../utils/validation';
import { Logo } from '../../components/Logo';

export const RegisterAdmin: React.FC = () => {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegisterFields>({
    resolver: zodResolver(adminRegisterSchema),
  });

  const onSubmit = async (data: AdminRegisterFields) => {
    setIsLoading(true);
    try {
      const session = await registerAdmin(data.email, data.name, data.adminAccessCode, data.password);
      toast.success(`Admin registered successfully! Welcome, ${session.name}.`);
      navigate('/admin', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Admin Registration failed. Check credentials or Access Code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 transition-colors duration-300">
      
      {/* Left Column: Media Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 overflow-hidden items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200" 
          alt="Luxury conference hall setup" 
          className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity"
        />
        
        <div className="relative z-10 max-w-lg p-12 text-left space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-amber-500 text-xs font-bold tracking-widest uppercase hover:underline">
            <FiArrowLeft /> Back to Website
          </Link>
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white leading-tight">
            Gowtham Admin <br />
            <span className="text-gradient-gold">Management Console</span>
          </h2>
          <p className="text-zinc-400 font-light leading-relaxed text-sm">
            Setting up administrative rights requires a backend-authorized Access Code. Once created, you can approve partner credentials, manage corporate bookings, upload galleries, and audit global finances.
          </p>
        </div>
      </div>

      {/* Right Column: Admin Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative overflow-hidden">
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-amber-500/5 blur-[50px] pointer-events-none lg:hidden" />
        
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
              Register Administrator
            </h1>
            <p className="text-xs text-neutral-450 dark:text-zinc-500 font-light">
              Admin registration is locked by secure environmental Access Codes.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-505 dark:text-zinc-500">
                Admin Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650" />
                <input
                  type="text"
                  required
                  placeholder="Harrison Sterling"
                  {...register('name')}
                  className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-505 dark:text-zinc-500">
                Admin Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650" />
                <input
                  type="email"
                  required
                  placeholder="admin@gowthamevents.com"
                  {...register('email')}
                  className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Access Code Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-450 block">
                Gowtham Master Access Code
              </label>
              <div className="relative">
                <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650" />
                <input
                  type="text"
                  required
                  placeholder="GOWTHAM_ADMIN_2026"
                  {...register('adminAccessCode')}
                  className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-850 dark:text-zinc-200"
                />
              </div>
              {errors.adminAccessCode && (
                <p className="text-xs text-red-500 font-medium">{errors.adminAccessCode.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-505 dark:text-zinc-500">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  {...register('password')}
                  className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-505 dark:text-zinc-500">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  {...register('confirmPassword')}
                  className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650"
                >
                  {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md hover:shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all duration-300 cursor-pointer"
            >
              {isLoading ? (
                <FiLoader className="animate-spin text-lg" />
              ) : (
                'Register Admin'
              )}
            </button>
          </form>

          {/* Login Redirection */}
          <div className="text-center text-xs text-neutral-500 dark:text-zinc-500">
            Already registered?{' '}
            <Link to="/login" className="text-amber-500 font-semibold hover:underline">
              Log In
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
};
