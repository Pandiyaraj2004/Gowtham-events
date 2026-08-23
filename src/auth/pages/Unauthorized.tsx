import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertOctagon, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../components/Button';

export const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 py-12 text-center transition-colors duration-300">
      <div className="max-w-md p-8 md:p-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-3xl premium-shadow space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-2">
          <FiAlertOctagon size={36} />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-905 dark:text-zinc-50">
          Access Denied
        </h1>
        
        <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed font-light">
          Your credentials do not carry security rights to view this specific layout interface. Please inspect your URL coordinates.
        </p>

        <div className="flex flex-col gap-3">
          {user ? (
            <Button to={user.role === 'admin' ? '/admin' : user.role === 'partner' ? '/partner' : '/client'} variant="primary">
              Return to Your Dashboard
            </Button>
          ) : (
            <Button to="/login" variant="primary">
              Log In
            </Button>
          )}
          <button
            onClick={handleGoBack}
            className="text-xs font-semibold text-neutral-450 dark:text-zinc-500 hover:text-amber-500 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <FiArrowLeft /> Go to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};
