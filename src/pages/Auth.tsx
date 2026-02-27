import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Sparkles, User, IdCard } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });
const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
const employeeSchema = z.object({
  employee_id: z.string().trim().min(1, { message: "Employee ID is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; employee_id?: string }>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'employee'>('admin');
  
  const { signIn, signUp, signInWithGoogle, resetPassword, user, loading } = useAuth();
  const { signIn: employeeSignIn, employee, loading: employeeLoading } = useEmployeeAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailError('');
    try { emailSchema.parse(forgotEmail); } catch (error) { if (error instanceof z.ZodError) setForgotEmailError(error.errors[0].message); return; }
    
    setIsForgotLoading(true);
    const { error } = await resetPassword(forgotEmail);
    setIsForgotLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Failed to send reset email", description: error.message });
    } else {
      toast({ title: "Check your email", description: "We've sent you a password reset link." });
      setForgotDialogOpen(false);
      setForgotEmail('');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ variant: "destructive", title: "Google sign in failed", description: error.message });
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) navigate('/');
    if (!employeeLoading && employee) navigate('/employee-dashboard');
  }, [user, loading, employee, employeeLoading, navigate]);

  const validateAdminForm = () => {
    try { authSchema.parse({ email, password }); setErrors({}); return true; }
    catch (error) { if (error instanceof z.ZodError) { const fe: any = {}; error.errors.forEach((err) => { if (err.path[0] === 'email') fe.email = err.message; if (err.path[0] === 'password') fe.password = err.message; }); setErrors(fe); } return false; }
  };

  const validateEmployeeForm = () => {
    try { employeeSchema.parse({ employee_id: employeeId, password: employeePassword }); setErrors({}); return true; }
    catch (error) { if (error instanceof z.ZodError) { const fe: any = {}; error.errors.forEach((err) => { if (err.path[0] === 'employee_id') fe.employee_id = err.message; if (err.path[0] === 'password') fe.password = err.message; }); setErrors(fe); } return false; }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAdminForm()) return;
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) { toast({ variant: "destructive", title: "Sign in failed", description: error.message === "Invalid login credentials" ? "Invalid email or password. Please try again." : error.message }); }
    else { toast({ title: "Welcome back!", description: "You have successfully signed in." }); navigate('/'); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAdminForm()) return;
    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);
    if (error) { toast({ variant: "destructive", title: "Sign up failed", description: error.message }); }
    else { toast({ title: "Account created!", description: "You have successfully signed up and are now logged in." }); navigate('/'); }
  };

  const handleEmployeeSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmployeeForm()) return;
    setIsLoading(true);
    const { error } = await employeeSignIn(employeeId, employeePassword);
    setIsLoading(false);
    if (error) { toast({ variant: "destructive", title: "Sign in failed", description: error.message || "Invalid credentials. Please try again." }); }
    else { toast({ title: "Welcome!", description: "You have successfully signed in." }); navigate('/employee-dashboard'); }
  };

  if (loading || employeeLoading) {
    return (<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>);
  }

  const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mb-2"><Sparkles className="w-6 h-6 text-primary-foreground" /></div>
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button variant={loginType === 'admin' ? 'default' : 'outline'} className={`flex-1 ${loginType === 'admin' ? 'bg-gradient-gold hover:opacity-90' : ''}`} onClick={() => setLoginType('admin')}><User className="w-4 h-4 mr-2" />Admin</Button>
            <Button variant={loginType === 'employee' ? 'default' : 'outline'} className={`flex-1 ${loginType === 'employee' ? 'bg-gradient-gold hover:opacity-90' : ''}`} onClick={() => setLoginType('employee')}><IdCard className="w-4 h-4 mr-2" />Employee</Button>
          </div>

          {loginType === 'admin' ? (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6"><TabsTrigger value="signin">Sign In</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="signin-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" disabled={isLoading} /></div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" disabled={isLoading} /></div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    <Dialog open={forgotDialogOpen} onOpenChange={setForgotDialogOpen}>
                      <DialogTrigger asChild><button type="button" className="text-sm text-primary hover:underline">Forgot password?</button></DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Reset your password</DialogTitle><DialogDescription>Enter your email address and we'll send you a link to reset your password.</DialogDescription></DialogHeader>
                        <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
                          <div className="space-y-2"><Label htmlFor="forgot-email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="forgot-email" type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="pl-10" disabled={isForgotLoading} /></div>{forgotEmailError && <p className="text-sm text-destructive">{forgotEmailError}</p>}</div>
                          <Button type="submit" className="w-full bg-gradient-gold hover:opacity-90" disabled={isForgotLoading}>{isForgotLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : 'Send Reset Link'}</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-gold hover:opacity-90" disabled={isLoading || isGoogleLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>) : 'Sign In'}</Button>
                  <div className="relative my-4"><Separator /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or continue with</span></div>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>{isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}Continue with Google</Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" disabled={isLoading} /></div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" disabled={isLoading} /></div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-gradient-gold hover:opacity-90" disabled={isLoading || isGoogleLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>) : 'Create Account'}</Button>
                  <div className="relative my-4"><Separator /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or continue with</span></div>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>{isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}Continue with Google</Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <form onSubmit={handleEmployeeSignIn} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="employee-id">Employee ID</Label><div className="relative"><IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="employee-id" type="text" placeholder="EMP001" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="pl-10" disabled={isLoading} /></div>{errors.employee_id && <p className="text-sm text-destructive">{errors.employee_id}</p>}</div>
              <div className="space-y-2"><Label htmlFor="employee-password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="employee-password" type="password" placeholder="••••••••" value={employeePassword} onChange={(e) => setEmployeePassword(e.target.value)} className="pl-10" disabled={isLoading} /></div>{errors.password && <p className="text-sm text-destructive">{errors.password}</p>}</div>
              <Button type="submit" className="w-full bg-gradient-gold hover:opacity-90" disabled={isLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>) : 'Sign In as Employee'}</Button>
              <p className="text-xs text-center text-muted-foreground mt-4">Employee accounts are created by the administrator. Contact your admin if you don't have an account.</p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
