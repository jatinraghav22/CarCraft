/**
 * requireLogin
 * ============
 * Centralized authentication guard for all customer actions.
 *
 * Usage:
 *   import { requireLogin } from '../utils/authGuard';
 *
 *   const handleAddToCart = () => {
 *     if (requireLogin(isAuthenticated, showLoginModal)) return;
 *     // ... proceed with action
 *   };
 *
 * @param {boolean}  isAuthenticated  From useAuth()
 * @param {Function} showModal        Setter that opens the LoginRequiredModal (e.g. setShowLoginModal)
 * @returns {boolean} true if the action should be blocked (user not logged in)
 */
export function requireLogin(isAuthenticated, showModal) {
  if (!isAuthenticated) {
    if (typeof showModal === 'function') showModal(true);
    return true; // blocked
  }
  return false; // proceed
}

export default requireLogin;
