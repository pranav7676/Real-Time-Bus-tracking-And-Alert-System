import { useState } from 'react';
import { SignUp, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Shield, Clock, Star, Bus, Users, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const benefits = [
    { icon: Clock, text: '14-day free trial' },
    { icon: Shield, text: 'No credit card required' },
    { icon: Zap, text: 'Setup in under 5 minutes' },
    { icon: Star, text: 'Cancel anytime' },
];

const features = [
    'Real-time GPS tracking for all buses',
    'QR code attendance system',
    'SOS emergency alerts',
    'Comprehensive analytics dashboard',
    'Route optimization',
    'Parent/passenger notifications',
    'Mobile apps for iOS & Android',
    'Priority email support',
];

const testimonial = {
    quote: "SmartBus transformed how we manage our school district's fleet. The real-time tracking alone has saved us countless hours.",
    author: 'Jennifer Martinez',
    role: 'Transportation Director',
    company: 'Austin ISD',
};

export function StartTrialPage() {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const [showSignUp, setShowSignUp] = useState(false);

    if (isSignedIn) {
        return <Navigate to="/select-role" replace />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Already have an account?</span>
                        <Button variant="outline" onClick={() => navigate('/')}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Column - Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:sticky lg:top-24"
                        >
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Bus className="h-6 w-6 text-primary" />
                                    </div>
                                    <span className="font-bold text-2xl">
                                        Smart<span className="text-primary">Bus</span>
                                    </span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                                    Start Your Free Trial <span className="gradient-text">Today</span>
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Join 500+ organizations using SmartBus to manage their fleets more efficiently.
                                </p>
                            </div>

                            {/* Quick Benefits */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                {benefits.map((benefit) => (
                                    <div key={benefit.text} className="flex items-center gap-2 text-sm">
                                        <benefit.icon className="h-4 w-4 text-primary" />
                                        <span>{benefit.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Features List */}
                            <Card className="p-6 mb-8">
                                <h3 className="font-semibold mb-4">Everything you get with the trial:</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Testimonial */}
                            <Card className="p-6 bg-gradient-to-br from-primary/5 via-card to-orange-500/5 border-primary/10">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <blockquote className="text-sm italic mb-4">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{testimonial.author}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.role}, {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                {[
                                    { value: '500+', label: 'Customers' },
                                    { value: '10,000+', label: 'Buses' },
                                    { value: '99.9%', label: 'Uptime' },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center p-4 rounded-lg bg-surface">
                                        <p className="text-xl font-bold text-primary">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Column - Sign Up Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-8">
                                <div className="text-center mb-6">
                                    <Badge variant="default" className="mb-4">
                                        <Zap className="h-3 w-3 mr-1" />
                                        Professional Plan Trial
                                    </Badge>
                                    <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                                    <p className="text-muted-foreground text-sm">
                                        Get started with your 14-day free trial
                                    </p>
                                </div>

                                {showSignUp ? (
                                    <SignUp
                                        appearance={{
                                            elements: {
                                                rootBox: 'w-full',
                                                card: 'bg-transparent shadow-none border-0 p-0',
                                                headerTitle: 'hidden',
                                                headerSubtitle: 'hidden',
                                                socialButtonsBlockButton: 'bg-surface hover:bg-surface-hover border border-border',
                                                formFieldInput: 'bg-surface border-border',
                                                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                                                footerActionLink: 'text-primary',
                                            },
                                        }}
                                        routing="hash"
                                        signInUrl="/"
                                        afterSignUpUrl="/select-role"
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <Button 
                                            size="xl" 
                                            className="w-full"
                                            onClick={() => setShowSignUp(true)}
                                        >
                                            Start Free Trial
                                        </Button>
                                        
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-border" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-card px-2 text-muted-foreground">
                                                    Or sign up with
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" onClick={() => setShowSignUp(true)}>
                                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                                Google
                                            </Button>
                                            <Button variant="outline" onClick={() => setShowSignUp(true)}>
                                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                GitHub
                                            </Button>
                                        </div>

                                        <p className="text-xs text-muted-foreground text-center pt-4">
                                            By signing up, you agree to our{' '}
                                            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                                            {' '}and{' '}
                                            <a href="/security" className="text-primary hover:underline">Privacy Policy</a>
                                        </p>
                                    </div>
                                )}
                            </Card>

                            {/* Trust Badges */}
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Shield className="h-4 w-4" />
                                    <span>SOC 2 Certified</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BarChart3 className="h-4 w-4" />
                                    <span>99.99% Uptime</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>500+ Customers</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
