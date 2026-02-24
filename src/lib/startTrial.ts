import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const PLAN_NAMES: Record<string, string> = {
  basic: 'Basic Plan',
  pro: 'Pro Plan',
  enterprise: 'Enterprise Plan',
};

/**
 * Reusable hook for handling "Start Trial" actions across the app.
 *
 * Logic:
 * - If signed out → navigates to /sign-up
 * - If signed in → saves plan to localStorage cart, navigates to /cart
 * - Prevents duplicate cart entries
 * - Shows toast feedback
 */
export function useStartTrial() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleStartTrial = (planId: string) => {
    if (!isSignedIn) {
      navigate('/sign-up');
      return;
    }

    // Prevent duplicates — if same plan already in cart, just navigate
    try {
      const saved = localStorage.getItem('smartbus_cart');
      if (saved) {
        const existing = JSON.parse(saved);
        if (existing.plan === planId) {
          showToast('This plan is already in your cart', 'info');
          navigate(`/cart?plan=${planId}`);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    // Add selected plan to localStorage cart
    localStorage.setItem(
      'smartbus_cart',
      JSON.stringify({ plan: planId, quantity: 1 })
    );

    showToast(`${PLAN_NAMES[planId] || 'Plan'} added to cart!`, 'success');
    navigate(`/cart?plan=${planId}`);
  };

  return { handleStartTrial };
}
