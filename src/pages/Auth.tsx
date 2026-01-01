import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';
import hqPowerLogo from '@/assets/hq-power-logo.png';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateField = (field: string, value: string, schema: z.ZodString) => {
    try {
      schema.parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateField('email', email, emailSchema);
    const isPasswordValid = validateField('password', password, passwordSchema);
    
    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please try again.'
          : error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
    navigate('/');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateField('email', email, emailSchema);
    if (!isEmailValid) return;

    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setResetEmailSent(true);
    toast({
      title: "Email sent",
      description: "Check your inbox for the password reset link.",
    });
  };

  // Email sent confirmation screen
  if (resetEmailSent) {
    return (
      <div className="min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/30 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
            <img src={hqPowerLogo} alt="HQ Power" className="w-48 h-auto mb-8 drop-shadow-2xl animate-pulse-glow" />
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">HQ Power</h1>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              Powering your fleet operations with intelligent maintenance management
            </p>
          </div>
          {/* Decorative sun rays */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-secondary/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Right Panel - Content */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <img src={hqPowerLogo} alt="HQ Power" className="w-24 h-auto mx-auto mb-4" />
            </div>

            <div className="bg-card rounded-2xl shadow-corporate-lg border border-border/50 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to<br />
                <span className="font-semibold text-foreground">{email}</span>
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                  setEmail('');
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Forgot password form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/30 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
            <img src={hqPowerLogo} alt="HQ Power" className="w-48 h-auto mb-8 drop-shadow-2xl animate-pulse-glow" />
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">HQ Power</h1>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              Powering your fleet operations with intelligent maintenance management
            </p>
          </div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-secondary/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <img src={hqPowerLogo} alt="HQ Power" className="w-24 h-auto mx-auto mb-4" />
            </div>

            <div className="bg-card rounded-2xl shadow-corporate-lg border border-border/50 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
                <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12 rounded-xl border-border/60 focus:border-primary"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-12 rounded-xl"
                  onClick={() => setShowForgotPassword(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main login form
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/30 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <img 
            src={hqPowerLogo} 
            alt="HQ Power" 
            className="w-56 h-auto mb-8 drop-shadow-2xl animate-pulse-glow" 
          />
          <h1 className="text-5xl font-bold text-primary-foreground mb-4 tracking-tight">HQ Power</h1>
          <p className="text-xl text-primary-foreground/80 max-w-md leading-relaxed">
            Fleet & Maintenance Management System
          </p>
          
          {/* Features list */}
          <div className="mt-12 space-y-4 text-left">
            {[
              'Real-time fleet monitoring',
              'Intelligent maintenance scheduling',
              'Comprehensive audit trails',
              'Department-level reporting'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-primary-foreground/90">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-secondary/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-l from-secondary/20 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={hqPowerLogo} alt="HQ Power" className="w-28 h-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">HQ Power</h1>
          </div>

          {/* Login card */}
          <div className="bg-card rounded-2xl shadow-corporate-lg border border-border/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl border-border/60 focus:border-primary transition-colors"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-12 rounded-xl border-border/60 focus:border-primary pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 mt-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                Need access? Contact your system administrator
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            © {new Date().getFullYear()} HQ Power. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}