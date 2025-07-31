import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import { useEffect, useState } from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength';
import { Separator } from '@/components/ui/separator';



const signupSchema = z.object({
  firstName: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name can't exceed 50 characters"),
  emailId: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth); 

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      emailId: "",
      password: ""
    }
  });

  const password = form.watch('password', '');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      toast.success("Account created successfully!");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4  bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-950 text-gray-100">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            className="absolute top-4 left-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Join thousands of developers solving challenges
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* First Name Field */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="emailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="text-xs h-6 px-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="mt-2 space-y-1">
                      <PasswordStrengthIndicator strength={passwordStrength} />
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        <p className="font-medium mb-1">Password must contain:</p>
                        <ul className="space-y-1">
                          <li className={`flex items-center ${password.length >= 8 ? 'text-green-500' : ''}`}>
                            {password.length >= 8 ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1 text-gray-400" />}
                            At least 8 characters
                          </li>
                          <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-500' : ''}`}>
                            {/[A-Z]/.test(password) ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1 text-gray-400" />}
                            One uppercase letter
                          </li>
                          <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-500' : ''}`}>
                            {/[0-9]/.test(password) ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1 text-gray-400" />}
                            One number
                          </li>
                          <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : ''}`}>
                            {/[^A-Za-z0-9]/.test(password) ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1 text-gray-400" />}
                            One special character
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="my-6 flex items-center">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <Separator className="flex-1" />
          </div>

          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
            </span>
            <NavLink 
              to="/login" 
              className="font-medium text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              Sign in
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;