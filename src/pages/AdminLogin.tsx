import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { getApiBaseUrl } from '@/config/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Swal from 'sweetalert2';
import { setInitialUserData } from '@/data/userData';
import { GoogleLogin } from '@react-oauth/google';
import { setToken, isAuthenticated } from '../utils/auth';

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).nonempty('Name is required'),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Google logo component
const GoogleLogo = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const AdminLogin: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Carousel images
  const carouselImages = [
    '/AdminPage/1stpic.jpg',
    '/AdminPage/2ndpic.jpg', 
    '/AdminPage/3rdpic.png',
    '/AdminPage/4thpic.jpg'
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLoginRequest = async (email: string, password: string) => {
    try {
      const apiUrl = getApiBaseUrl();
      const loginEndpoint = `${apiUrl}/api/auth/login`;

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Update user state
      setInitialUserData({
        name: data.user.name,
        email: data.user.email,
        profilePicture: data.user.profilePicture
      });
      setToken(data.token);

      // Navigate to admin dashboard
      navigate('/admin');

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${data.user.name}!`,
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error: any) {
      console.error('Login error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'An error occurred during login. Please try again.',
        confirmButtonColor: '#10B981'
      });
    }
  };

  const handleSignupRequest = async (name: string, email: string, password: string) => {
    try {
      const apiUrl = getApiBaseUrl();
      const signupEndpoint = `${apiUrl}/api/auth/signup`;

      const response = await fetch(signupEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Signup failed';
        throw new Error(errorMessage);
      }

      // Save user data
      setInitialUserData({
        name: data.user.name,
        email: data.user.email,
        profilePicture: data.user.profilePicture
      });
      setToken(data.token);

      // Navigate to admin dashboard
      navigate('/admin');

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: `Welcome, ${data.user.name}! Your account has been created successfully.`,
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message || 'An error occurred during signup. Please try again.',
        confirmButtonColor: '#10B981'
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Decode the JWT credential to get user info
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      
      // Extract user information
      const { email, name, picture, sub: googleId } = decoded;
      
      if (!email || !name || !googleId) {
        throw new Error('Google ID is required, Email is required, Name is required');
      }

      const apiUrl = getApiBaseUrl();
      const googleAuthEndpoint = `${apiUrl}/api/auth/google`;

      const response = await fetch(googleAuthEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          name,
          picture,
          googleId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      // Save user data
      setInitialUserData({
        name: data.user.name,
        email: data.user.email,
        profilePicture: data.user.profilePicture
      });
      setToken(data.token);

      // Navigate to admin dashboard
      navigate('/admin');

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: authMode === 'login' ? 'Login Successful!' : 'Account Created!',
        text: `Welcome, ${data.user.name}!`,
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error: any) {
      console.error('Google auth error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: error.message || 'Google authentication failed. Please try again.',
        confirmButtonColor: '#10B981'
      });
    }
  };

  const handleGoogleError = () => {
    console.error('Google login error');
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Failed to login with Google. Please try again.',
      timer: 3000,
      showConfirmButton: true
    });
  };

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    Swal.fire({
      title: 'Logging in...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      didOpen: () => {
        handleLoginRequest(values.email, values.password);
      }
    });
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    Swal.fire({
      title: 'Creating account...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      didOpen: () => {
        handleSignupRequest(values.name, values.email, values.password);
      }
    });
  };



  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Overlay with content */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-8 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 p-1">
                <img src="/LOGO/1.png" alt="BahayCebu Properties" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold">BahayCebu Properties</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4">Manage Properties Efficiently</h2>
            <p className="text-lg opacity-90 max-w-md">
              Easily track rent payments, maintenance requests, and tenant communications in one place. 
              Say goodbye to the hassle of manual management.
            </p>
          </div>
          
          {/* Carousel indicators */}
          <div className="flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 p-1">
              <img src="/LOGO/1.png" alt="BahayCebu Properties" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">BahayCebu Properties</h1>
          </div>

          {/* Login button in top right */}
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back to BahayCebu Properties!
              </h2>
              <p className="text-gray-600">
                Sign in to your account
              </p>
            </div>

            {/* Auth mode toggle */}
            <div className="flex mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg transition-colors ${
                  authMode === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg transition-colors ${
                  authMode === 'signup'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="info.madhu786@gmail.com" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              {...field} 
                              autoComplete="current-password"
                              className="h-12 pr-12"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-600">Remember Me</span>
                    </label>
                    <button type="button" className="text-sm text-blue-600 hover:underline">
                      Forgot Password?
                    </button>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Login
                  </Button>
                </form>
              </Form>
            ) : (
              // Signup Form
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              {...field} 
                              autoComplete="new-password"
                              className="h-12 pr-12"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              {...field} 
                              autoComplete="new-password"
                              className="h-12 pr-12"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Sign Up
                  </Button>
                </form>
              </Form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                width="100%"
                text={authMode === 'login' ? 'signin_with' : 'signup_with'}
              />
            </div>

            {/* Footer text */}
            <div className="mt-6 text-center text-sm text-gray-600">
              {authMode === 'login' ? (
                <p>Don't have any account?{' '}
                  <button 
                    onClick={() => setAuthMode('signup')} 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>Already have an account?{' '}
                  <button 
                    onClick={() => setAuthMode('login')} 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;