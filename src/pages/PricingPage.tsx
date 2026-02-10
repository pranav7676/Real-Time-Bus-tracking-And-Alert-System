import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Star, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const plans = [
    {
        name: 'Starter',
        price: '$49',
        period: '/month',
        description: 'Perfect for small fleets',
        features: [
            'Up to 5 buses',
            'Real-time GPS tracking',
            'Basic attendance',
            'Email support',
            'Basic analytics',
        ],
        cta: 'Start Free Trial',
        popular: false,
    },
    {
        name: 'Professional',
        price: '$149',
        period: '/month',
        description: 'For growing organizations',
        features: [
            'Up to 25 buses',
            'Advanced GPS tracking',
            'QR attendance system',
            'SOS emergency alerts',
            'Priority support',
            'Advanced analytics',
            'Custom reports',
            'API access',
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large scale operations',
        features: [
            'Unlimited buses',
            'White-label solution',
            'Dedicated account manager',
            '24/7 phone support',
            'Custom integrations',
            'SLA guarantees',
            'Advanced security',
            'Training & onboarding',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export function PricingPage() {
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
                    <Button onClick={() => navigate('/select-role')}>Get Started</Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Zap className="h-4 w-4" />
                            Simple, Transparent Pricing
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Choose the Perfect <span className="gradient-text">Plan</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Start with a 14-day free trial. No credit card required. Cancel anytime.
                        </p>
                    </motion.div>

                    {/* Pricing Cards */}
                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                            <Star className="h-3 w-3 mr-1" />
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                <Card
                                    className={`h-full ${plan.popular
                                            ? 'border-primary/50 shadow-glow'
                                            : ''
                                        }`}
                                >
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {plan.description}
                                        </p>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold">{plan.price}</span>
                                            <span className="text-muted-foreground">{plan.period}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="w-full"
                                            variant={plan.popular ? 'default' : 'outline'}
                                            onClick={() => navigate('/select-role')}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Comparison */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-20"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Enterprise Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            title: 'Security & Compliance',
                                            items: ['SSO integration', 'GDPR compliant', 'Data encryption'],
                                        },
                                        {
                                            title: 'Customization',
                                            items: ['White-label app', 'Custom branding', 'API access'],
                                        },
                                        {
                                            title: 'Support',
                                            items: ['Dedicated manager', '24/7 phone support', 'Training'],
                                        },
                                    ].map((category) => (
                                        <div key={category.title}>
                                            <h3 className="font-semibold mb-3">{category.title}</h3>
                                            <ul className="space-y-2">
                                                {category.items.map((item) => (
                                                    <li
                                                        key={item}
                                                        className="text-sm text-muted-foreground flex items-center gap-2"
                                                    >
                                                        <Check className="h-4 w-4 text-success" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
