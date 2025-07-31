import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser } from '../authSlice';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema validation for login
const loginSchema = z.object({
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({ 
    resolver: zodResolver(loginSchema) 
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-950 text-gray-100">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-1"></div>
        
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">NexusCode</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Continue your coding journey
          </CardDescription>
        </CardHeader>
        
        <CardContent>          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="emailId" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="emailId"
                type="email"
                placeholder="john@example.com"
                className={`${errors.emailId ? 'border-destructive' : ''} dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <p className="text-destructive text-sm mt-1 dark:text-red-400">{errors.emailId.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <NavLink 
                  to="/forgot-password" 
                  className="text-sm text-yellow-600 hover:text-yellow-800 dark:text-yellow-500 dark:hover:text-yellow-400 hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>
              
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pr-10 ${errors.password ? 'border-destructive' : ''} dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500`}
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Yellow Gradient Button */}
            <Button
              type="submit"
              className="w-full mt-2 cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : 'Login'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <NavLink 
              to="/signup" 
              className="font-medium text-yellow-600 hover:text-yellow-800 dark:text-yellow-500 dark:hover:text-yellow-400 hover:underline"
            >
              Sign up
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login;