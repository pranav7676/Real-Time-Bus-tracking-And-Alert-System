import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { ArrowLeft, Settings, Palette, Bell, Shield, Globe, Moon, Sun, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useAppStore } from '../stores/appStore';
import { Footer } from '../components/layout/Footer';

const languages = ['English', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Marathi (मराठी)', 'Bengali (বাংলা)'];
const timezones = ['Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)', 'Asia/Singapore (SGT)'];

export function SettingsPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const theme = useAppStore((state) => state.theme);
    const toggleTheme = useAppStore((state) => state.toggleTheme);

    const [language, setLanguage] = useState('English');
    const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(true);
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: Settings },
        { id: 'preferences', label: 'Preferences', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />Back
                    </Button>
                    <span className="font-bold text-xl">smart<span className="text-primary">bus</span></span>
                    <div />
                </div>
            </header>

            <div className="pt-20 max-w-5xl mx-auto px-6">
                <Breadcrumb items={[{ label: 'Settings' }]} />
            </div>

            <main className="pt-8 pb-16">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Settings className="h-7 w-7 text-primary" /> Settings
                        </h1>
                        <p className="text-muted-foreground mb-8">Manage your account preferences and configuration</p>

                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Sidebar Tabs */}
                            <div className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-surface'}`}
                                    >
                                        <tab.icon className="h-4 w-4" />{tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Account */}
                                {activeTab === 'account' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle>Account Information</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-4">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                                        <p className="mt-1 font-medium">{user?.fullName || 'Not set'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                                        <p className="mt-1 font-medium">{user?.primaryEmailAddress?.emailAddress || 'Not set'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                                        <p className="mt-1 font-mono text-sm text-muted-foreground">{user?.id}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Created</label>
                                                        <p className="mt-1 text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" onClick={() => openUserProfile()}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />Manage Clerk Profile
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Danger Zone */}
                                        <Card className="p-6 border-destructive/30">
                                            <CardHeader className="p-0 mb-4">
                                                <CardTitle className="text-destructive flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5" />Danger Zone
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Once you delete your account, there is no going back. Please be certain.
                                                </p>
                                                <Button variant="destructive" size="sm">Delete Account</Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Preferences */}
                                {activeTab === 'preferences' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Appearance</CardTitle></CardHeader>
                                            <CardContent className="p-0">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Theme</p>
                                                        <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                                                    </div>
                                                    <button
                                                        onClick={toggleTheme}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-primary/30 transition-all"
                                                    >
                                                        {theme === 'dark' ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                                                        <span className="text-sm font-medium capitalize">{theme}</span>
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />Regional</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">Language</label>
                                                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input max-w-xs">
                                                        {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">Timezone</label>
                                                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input max-w-xs">
                                                        {timezones.map((t) => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Notifications */}
                                {activeTab === 'notifications' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-6"><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Notification Preferences</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-6">
                                                {[
                                                    { label: 'Email Notifications', description: 'Receive trip updates, reports, and alerts via email', value: emailNotif, setter: setEmailNotif },
                                                    { label: 'SMS Notifications', description: 'Get critical alerts via SMS to your registered phone', value: smsNotif, setter: setSmsNotif },
                                                    { label: 'Push Notifications', description: 'Browser push notifications for real-time updates', value: pushNotif, setter: setPushNotif },
                                                ].map((item) => (
                                                    <div key={item.label} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">{item.label}</p>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => item.setter(!item.value)}
                                                            className={`relative w-12 h-6 rounded-full transition-colors ${item.value ? 'bg-primary' : 'bg-muted'}`}
                                                            role="switch"
                                                            aria-checked={item.value}
                                                        >
                                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${item.value ? 'translate-x-6' : ''}`} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Security */}
                                {activeTab === 'security' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Session Information</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-3">
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-sm text-muted-foreground">Current session</span>
                                                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">Active</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-sm text-muted-foreground">Last sign in</span>
                                                    <span className="text-sm">{user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}</span>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => openUserProfile()}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />Manage Sessions in Clerk
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
                                            <CardContent className="p-0">
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Add an extra layer of security to your account. 2FA is managed through your Clerk profile.
                                                </p>
                                                <Button variant="outline" onClick={() => openUserProfile()}>
                                                    <Shield className="h-4 w-4 mr-2" />Configure 2FA
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
