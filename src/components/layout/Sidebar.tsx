import { NavLink, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Map,
    Route,
    ClipboardCheck,
    BarChart3,
    AlertTriangle,
    Settings,
    LogOut,
    Bus,
    ChevronLeft,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Button } from '../ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/Dialog';
import { useAppStore } from '../../stores/appStore';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'Live Map', path: '/map' },
    { icon: Route, label: 'Routes', path: '/routes' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();
    const isCollapsed = useAppStore((state) => state.sidebarCollapsed);
    const toggleSidebar = useAppStore((state) => state.toggleSidebar);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const userRole = useAppStore((state) => state.userRole);

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
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 260 }}
                transition={{ duration: 0.2 }}
                className="fixed left-0 top-0 z-40 h-screen flex flex-col bg-card border-r border-border"
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                        <Bus className="h-5 w-5 text-primary" />
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-xl"
                        >
                            Smart<span className="text-primary">Bus</span>
                        </motion.span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                                )
                            }
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium text-sm"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center hover:bg-surface transition-colors"
                >
                    <ChevronLeft
                        className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')}
                    />
                </button>

                {/* User Card */}
                <div className="p-3 border-t border-border">
                    <div
                        className={cn(
                            'flex items-center gap-3 p-2 rounded-lg',
                            !isCollapsed && 'bg-surface'
                        )}
                    >
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                            <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-medium truncate">
                                    {user?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate capitalize">
                                    {userRole?.toLowerCase() || 'Passenger'}
                                </p>
                            </motion.div>
                        )}
                        {!isCollapsed && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowLogoutModal(true)}
                                className="flex-shrink-0 h-8 w-8"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {/* Logout button when sidebar is collapsed */}
                    {isCollapsed && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full mt-2 flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </motion.button>
                    )}
                </div>
            </motion.aside>

            {/* Logout Confirmation Modal */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to sign out? You'll need to sign in again to access
                            your account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            loading={isLoggingOut}
                        >
                            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
