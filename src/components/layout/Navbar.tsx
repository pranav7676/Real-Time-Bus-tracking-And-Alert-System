import { Moon, Sun, Bell, Wifi, WifiOff, LogOut, User, ChevronDown } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/Dialog';

interface NavbarProps {
    title?: string;
}

export function Navbar({ title = 'Dashboard' }: NavbarProps) {
    const { signOut } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // FIX: Separate selectors to avoid creating new object on every render
    const theme = useAppStore((state) => state.theme);
    const toggleTheme = useAppStore((state) => state.toggleTheme);
    const isConnected = useAppStore((state) => state.isConnected);
    const alerts = useAppStore((state) => state.alerts);
    const userRole = useAppStore((state) => state.userRole);

    const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center justify-between h-full px-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold">{title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface">
                            {isConnected ? (
                                <>
                                    <Wifi className="h-4 w-4 text-success" />
                                    <span className="text-xs font-medium text-success">Live</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">Offline</span>
                                </>
                            )}
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            {unresolvedAlerts > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                                    {unresolvedAlerts}
                                </span>
                            )}
                        </Button>

                        {/* Theme Toggle */}
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                                    <AvatarFallback className="text-xs">{getInitials(user?.fullName)}</AvatarFallback>
                                </Avatar>
                                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="font-medium text-sm">{user?.fullName || 'User'}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
                                            <p className="text-xs text-primary mt-1 capitalize">{userRole?.toLowerCase() || 'Passenger'}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    navigate('/settings');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                Profile Settings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    setShowLogoutModal(true);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Sign Out</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowLogoutModal(false)}
                            disabled={isLoggingOut}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
