import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Truck, Shield } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { UserRole } from '../types';
import { cn } from '../lib/utils';

const roles = [
    {
        id: 'PASSENGER' as UserRole,
        icon: User,
        title: 'Passenger',
        description: 'Track buses, mark attendance, and access safety features',
        color: 'from-blue-500/20 to-blue-600/5',
        borderColor: 'hover:border-blue-500/50',
    },
    {
        id: 'DRIVER' as UserRole,
        icon: Truck,
        title: 'Driver',
        description: 'Manage trips, generate QR codes, and share location',
        color: 'from-green-500/20 to-green-600/5',
        borderColor: 'hover:border-green-500/50',
    },
    {
        id: 'ADMIN' as UserRole,
        icon: Shield,
        title: 'Administrator',
        description: 'Full fleet management, analytics, and system control',
        color: 'from-primary/20 to-orange-600/5',
        borderColor: 'hover:border-primary/50',
    },
];

export function RoleSelectionPage() {
    const navigate = useNavigate();
    const setUserRole = useAppStore((state) => state.setUserRole);

    const handleRoleSelect = (role: UserRole) => {
        setUserRole(role);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl font-bold mb-3">Select Your Role</h1>
                    <p className="text-muted-foreground">
                        Choose how you'll be using SmartBus today
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {roles.map((role, index) => (
                        <motion.button
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleRoleSelect(role.id)}
                            className={cn(
                                'group relative flex flex-col items-center p-8 rounded-2xl border border-border bg-card text-left transition-all duration-300',
                                role.borderColor,
                                'hover:shadow-lg hover:-translate-y-1'
                            )}
                        >
                            <div
                                className={cn(
                                    'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity',
                                    role.color
                                )}
                            />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <role.icon className="h-8 w-8 text-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
                                <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
