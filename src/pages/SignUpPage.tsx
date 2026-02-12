import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-center px-8"
        >
          <img src="/smartbus-icon.svg" alt="SmartBus" className="w-20 h-20 mx-auto mb-8" />
          <h1 className="text-3xl font-bold mb-4">
            Join{' '}
            <span className="gradient-text">SmartBus</span>
          </h1>
          <p className="text-muted-foreground">
            Create your account to start tracking buses in real-time, manage attendance, and stay connected.
          </p>
        </motion.div>
      </div>

      {/* Right: Sign Up */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/smartbus-icon.svg" alt="SmartBus" className="w-10 h-10" />
            <span className="font-bold text-xl">
              smart<span className="text-primary">bus</span>
            </span>
          </div>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/select-role"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-card border border-border shadow-none w-full',
                headerTitle: 'text-foreground',
                headerSubtitle: 'text-muted-foreground',
                formFieldLabel: 'text-foreground',
                formFieldInput: 'bg-surface border-border text-foreground',
                formButtonPrimary: 'bg-primary hover:opacity-90',
                footerActionLink: 'text-primary',
              },
            }}
          />
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/sign-in')}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
