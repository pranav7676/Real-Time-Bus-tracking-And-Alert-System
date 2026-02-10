import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Shield, Award, Globe, Heart, Rocket } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const team = [
    {
        name: 'Sarah Chen',
        role: 'CEO & Founder',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
        bio: 'Former Google TPM with 15 years in transportation tech.',
    },
    {
        name: 'Marcus Johnson',
        role: 'CTO',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        bio: 'Ex-Uber engineering lead, specialized in real-time systems.',
    },
    {
        name: 'Emily Rodriguez',
        role: 'Head of Product',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        bio: 'Product leader from Lyft, passionate about UX.',
    },
    {
        name: 'David Park',
        role: 'VP of Engineering',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        bio: 'Scaled infrastructure at Stripe and Square.',
    },
];

const values = [
    {
        icon: Shield,
        title: 'Safety First',
        description: 'Every feature we build prioritizes the safety of passengers and drivers.',
    },
    {
        icon: Heart,
        title: 'User-Centric',
        description: 'We obsess over creating delightful experiences for every user.',
    },
    {
        icon: Rocket,
        title: 'Innovation',
        description: 'Constantly pushing boundaries with cutting-edge technology.',
    },
    {
        icon: Globe,
        title: 'Accessibility',
        description: 'Making transportation management available to organizations of all sizes.',
    },
];

const milestones = [
    { year: '2021', title: 'Founded', description: 'SmartBus launched in Silicon Valley' },
    { year: '2022', title: '100+ Clients', description: 'Reached first major milestone' },
    { year: '2023', title: 'Series A', description: 'Raised $15M to expand globally' },
    { year: '2024', title: '10,000+ Buses', description: 'Now tracking 10K+ buses daily' },
    { year: '2025', title: 'Global Launch', description: 'Expanded to 15 countries' },
    { year: '2026', title: 'AI-Powered', description: 'Introduced predictive analytics' },
];

export function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <Button onClick={() => navigate('/pricing')}>View Pricing</Button>
                </div>
            </header>

            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Target className="h-4 w-4" />
                            Our Mission
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Transforming Fleet Management for the{' '}
                            <span className="gradient-text">Modern World</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            We believe every organization deserves access to enterprise-grade fleet
                            management. Our mission is to make transportation safer, more efficient,
                            and accessible to everyone.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                    >
                        {[
                            { value: '500+', label: 'Organizations' },
                            { value: '10,000+', label: 'Buses Tracked' },
                            { value: '2M+', label: 'Trips Completed' },
                            { value: '15', label: 'Countries' },
                        ].map((stat) => (
                            <Card key={stat.label} className="text-center p-6">
                                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Our Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-20"
                    >
                        <Card className="p-8 lg:p-12">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                                    <div className="space-y-4 text-muted-foreground">
                                        <p>
                                            SmartBus was born from a simple observation: schools, businesses,
                                            and municipalities were struggling with outdated fleet management
                                            systems that couldn't keep up with modern demands.
                                        </p>
                                        <p>
                                            Our founders, veterans of Silicon Valley's top tech companies,
                                            saw an opportunity to bring enterprise-grade technology to an
                                            industry that desperately needed it.
                                        </p>
                                        <p>
                                            Today, we're proud to serve organizations across 15 countries,
                                            helping them deliver safer, more reliable transportation
                                            experiences for millions of passengers.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="aspect-video bg-gradient-to-br from-primary/20 via-surface to-orange-500/10 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                                            <p className="text-lg font-semibold">Award-Winning Platform</p>
                                            <p className="text-sm text-muted-foreground">
                                                2025 Transportation Tech Innovation
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-20"
                    >
                        <h2 className="text-2xl font-bold text-center mb-12">Our Journey</h2>
                        <div className="relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={milestone.year}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className={`flex items-center gap-6 ${
                                            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                    >
                                        <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                                            <Card className="inline-block p-4">
                                                <p className="text-primary font-bold">{milestone.year}</p>
                                                <p className="font-semibold">{milestone.title}</p>
                                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                            </Card>
                                        </div>
                                        <div className="hidden md:flex w-4 h-4 rounded-full bg-primary z-10" />
                                        <div className="flex-1 hidden md:block" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Values */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mb-20"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">Our Values</h2>
                        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                            These principles guide everything we do, from product development to customer support.
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <Card className="h-full p-6 text-center hover:border-primary/30 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <value.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{value.title}</h3>
                                        <p className="text-sm text-muted-foreground">{value.description}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Team */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-20"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">Leadership Team</h2>
                        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                            Meet the people driving SmartBus forward
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 + index * 0.1 }}
                                >
                                    <Card className="h-full overflow-hidden hover:border-primary/30 transition-colors">
                                        <div className="aspect-square bg-surface overflow-hidden">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-4 text-center">
                                            <h3 className="font-semibold">{member.name}</h3>
                                            <p className="text-sm text-primary">{member.role}</p>
                                            <p className="text-xs text-muted-foreground mt-2">{member.bio}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Journey?</h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Experience the future of fleet management. Start your free trial today.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button size="lg" onClick={() => navigate('/start-trial')}>
                                    Start Free Trial
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/careers')}>
                                    View Open Positions
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
