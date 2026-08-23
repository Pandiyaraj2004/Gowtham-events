import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { forgotPasswordSchema, ForgotPasswordFields } from '../utils/validation';

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
      toast.success('Recovery link dispatched.');
    } catch (error: any) {
      toast.error(error.message || 'Verification search failed. Check email value.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 py-12 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-600/5 blur-[100px]" />

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-3xl p-8 md:p-10 premium-shadow relative z-10">
        
        {/* Back Link */}
        <Link to="/login" className="inline-flex items-center gap-2 text-neutral-450 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-500 text-xs font-semibold uppercase tracking-wider mb-8 transition-colors">
          <FiArrowLeft /> Back to Login
        </Link>

        {!isSuccess ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-heading font-bold text-neutral-900 dark:text-zinc-50">
                Reset Password
              </h1>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 font-light leading-relaxed">
                Provide your registered email address. We will verify your database profile and dispatch instructions to reset credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-450">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-650" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="sophia@example.com"
                    {...register('email')}
                    className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-neutral-800 dark:text-zinc-200"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-heading font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md hover:shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all duration-300 cursor-pointer"
              >
                {isLoading ? (
                  <FiLoader className="animate-spin text-lg" />
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6 space-y-6"
          >
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
              <FiCheckCircle size={30} />
            </div>
            <h3 className="text-xl font-heading font-semibold text-neutral-900 dark:text-zinc-50">
              Reset Link Dispatched
            </h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto font-light">
              Check your inbox. If the email matches a secure record on file, you will receive links to reset your credentials shortly.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs font-bold text-amber-500 hover:underline block mx-auto mt-4 cursor-pointer"
            >
              Send Another Request
            </button>
          </motion.div>
        )}
      </div>

    </div>
  );
};
