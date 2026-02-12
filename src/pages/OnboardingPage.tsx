import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Phone, CheckCircle } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Button } from '../components/ui/Button';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const userRole = useAppStore((state) => state.userRole);
  const setOnboardingDone = useAppStore((state) => state.setOnboardingDone);

  const [name, setName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${user?.id}/onboarding`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone }),
        }
      ).catch(() => {/* API may be offline */});

      setOnboardingDone(true);
      const rolePath = userRole?.toLowerCase() || 'student';
      navigate(`/dashboard/${rolePath}`);
    } catch {
      setOnboardingDone(true);
      navigate(`/dashboard/${userRole?.toLowerCase() || 'student'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, phone, user, userRole, setOnboardingDone, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/smartbus-icon.svg" alt="SmartBus" className="w-10 h-10" />
            <span className="font-bold text-xl">
              smart<span className="text-primary">bus</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Just a few more details before we set up your{' '}
            <span className="text-primary font-medium capitalize">{userRole?.toLowerCase()}</span>{' '}
            dashboard.
          </p>
        </div>

        <div className="card p-8 space-y-6">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Account created</span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Role selected</span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-sm text-foreground font-medium">Profile</span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="input pl-11"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="input pl-11"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            loading={isSubmitting}
            size="lg"
            className="w-full gap-2"
          >
            Complete Setup
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
