import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, User, Phone, Mail, CheckCircle, ChevronDown, Camera, MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Footer } from '../components/layout/Footer';

const countries = [
  { code: '+91', flag: '🇮🇳', name: 'India', format: '##### #####' },
  { code: '+1', flag: '🇺🇸', name: 'USA', format: '### ### ####' },
  { code: '+44', flag: '🇬🇧', name: 'UK', format: '#### ### ####' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore', format: '#### ####' },
  { code: '+61', flag: '🇦🇺', name: 'Australia', format: '### ### ###' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
    }
  }, [user]);

  const formatPhone = (value: string, format: string) => {
    const digits = value.replace(/\D/g, '');
    let result = '';
    let digitIdx = 0;
    for (const char of format) {
      if (digitIdx >= digits.length) break;
      if (char === '#') {
        result += digits[digitIdx++];
      } else {
        result += char;
      }
    }
    return result;
  };

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (selectedCountry.code === '+91' && digits.length !== 10) {
      return 'Indian phone numbers must be 10 digits';
    }
    if (digits.length < 7) {
      return 'Phone number too short';
    }
    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const formatted = formatPhone(raw, selectedCountry.format);
    setPhone(formatted);
    setPhoneError('');
    setPhoneSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setIsSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setPhoneSaved(true);
    setTimeout(() => setPhoneSaved(false), 3000);
  };

  const getInitials = (n: string) => n.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);

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

      <div className="pt-20 max-w-3xl mx-auto px-6">
        <Breadcrumb items={[{ label: 'Profile' }]} />
      </div>

      <main className="pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile Header */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                    <AvatarFallback className="text-2xl">{getInitials(user?.fullName || 'U')}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user?.fullName || 'User'}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />{user?.primaryEmailAddress?.emailAddress}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5" />Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Profile Form */}
            <form onSubmit={handleSave}>
              <Card className="p-6 mb-6">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email (read-only from Clerk) */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <div className="input bg-surface/50 flex items-center gap-2 cursor-not-allowed opacity-70">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.primaryEmailAddress?.emailAddress || ''}</span>
                      <span className="text-xs text-muted-foreground ml-auto">Managed by Clerk</span>
                    </div>
                  </div>

                  {/* Phone with Country Dropdown */}
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Phone className="h-4 w-4" />Phone Number
                    </label>
                    <div className="flex gap-2">
                      {/* Country selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="input flex items-center gap-2 min-w-[130px] justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{selectedCountry.flag}</span>
                            <span className="text-sm font-medium">{selectedCountry.code}</span>
                          </span>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showCountryDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-1 left-0 w-60 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden"
                          >
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                  setPhone('');
                                  setPhoneError('');
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface transition-colors ${selectedCountry.code === country.code ? 'bg-primary/10 text-primary' : ''}`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="flex-1 text-left">{country.name}</span>
                                <span className="text-muted-foreground">{country.code}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>

                      {/* Phone input */}
                      <div className="flex-1 relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          className={`input w-full ${phoneError ? 'border-destructive' : ''} ${phoneSaved ? 'border-green-500' : ''}`}
                          placeholder={selectedCountry.format.replace(/#/g, '0')}
                        />
                        {phoneSaved && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    {phoneError && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive mt-2">{phoneError}</motion.p>
                    )}
                    {phoneSaved && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-green-400 mt-2">✓ Phone number saved successfully!</motion.p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <MapPin className="h-4 w-4" />Location
                    </label>
                    <input type="text" className="input" placeholder="e.g. Chennai, Tamil Nadu" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
