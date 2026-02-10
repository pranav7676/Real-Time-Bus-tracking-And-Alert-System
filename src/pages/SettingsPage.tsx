import { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, LogOut } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';

export function SettingsPage() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { theme, toggleTheme, userRole } = useAppStore((state) => ({
        theme: state.theme,
        toggleTheme: state.toggleTheme,
        userRole: state.userRole,
    }));

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
    });

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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                                <AvatarFallback className="text-xl">
                                    {getInitials(user?.fullName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{user?.fullName || 'User'}</h3>
                                <p className="text-muted-foreground">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                                <p className="text-sm text-primary capitalize mt-1">
                                    {userRole?.toLowerCase()} Account
                                </p>
                            </div>
                            <Button variant="outline">Edit Profile</Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Appearance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Theme</p>
                                <p className="text-sm text-muted-foreground">
                                    Choose between dark and light mode
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => theme === 'dark' && toggleTheme()}
                                >
                                    Light
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => theme === 'light' && toggleTheme()}
                                >
                                    Dark
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                            { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                            { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.label}</p>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() =>
                                        setNotifications((prev) => ({
                                            ...prev,
                                            [item.key]: !prev[item.key as keyof typeof prev],
                                        }))
                                    }
                                    className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications]
                                            ? 'bg-primary'
                                            : 'bg-surface'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications]
                                                ? 'translate-x-7'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                Enable
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Active Sessions</p>
                                <p className="text-sm text-muted-foreground">
                                    Manage your active devices
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                Manage
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Sign Out */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="border-destructive/30">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-destructive">Sign Out</p>
                                <p className="text-sm text-muted-foreground">
                                    Sign out from your account
                                </p>
                            </div>
                            <Button variant="destructive" onClick={() => signOut()}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
