import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, Eye, EyeOff, Mail } from 'lucide-react';
import { getApiBaseUrl } from '@/config/api';
import ContactModal from '@/components/ui/ContactModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { showSuccessAlert, showErrorAlert, showLoadingAlert, showToast } from '@/utils/sweetAlert';
import Swal from 'sweetalert2';
import { setInitialUserData } from '@/data/userData';
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { setToken, removeToken, isAuthenticated } from '../../utils/auth';

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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
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

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Add Google logo as an SVG component
const GoogleLogo = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');
  const [tempToken, setTempToken] = useState<string>('');
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePropertiesClick = () => {
    navigate('/properties');
    setIsMenuOpen(false);
  };

  const openAuthDialog = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthDialogOpen(true);
  };

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
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

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log('Login submitted with values:', values);
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

  const handleLoginRequest = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      
      // Use proper API configuration
      const apiUrl = getApiBaseUrl();
      
      const loginEndpoint = `${apiUrl}/api/auth/login`;
      console.log('Login endpoint:', loginEndpoint);

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      // Read response as text first for debugging
      const responseText = await response.text();
      console.log('Raw login response:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse login response as JSON:', e);
        console.error('Response text:', responseText);
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful:', data);

      // Store the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update the user state
      setInitialUserData({
        name: data.user.name,
        email: data.user.email,
        profilePicture: data.user.profilePicture
      });
      setToken(data.token);

      // Close the modal
      setIsAuthDialogOpen(false);
      navigate('/admin');

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error instanceof Error ? error.message : "An error occurred during login",
        timer: 3000,
        showConfirmButton: true
      });
      loginForm.reset();
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    console.log('Signup submitted with values:', values);
    Swal.fire({
      title: 'Creating account...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      didOpen: () => {
        handleSignupRequest(values);
      }
    });
  };

  const handleSignupRequest = async (values: z.infer<typeof signupSchema>) => {
    try {
      console.log('Sending signup request with values:', {
        name: values.name,
        email: values.email,
        passwordLength: values.password.length
      });

      const apiUrl = getApiBaseUrl();
      console.log('Using API URL:', apiUrl);
      
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
        credentials: 'include'
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));
      
      let data;
      const responseText = await res.text();
      console.log('Raw server response:', responseText);
      console.log('Response text length:', responseText.length);
      
      try {
        data = JSON.parse(responseText);
        console.log('Parsed server response:', data);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        console.error('Response text:', responseText);
        throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}`);
      }

      if (!res.ok) {
        const errorMessage = data.message || data.error || 'Signup failed';
        console.error('Signup error response:', errorMessage, data);
        throw new Error(errorMessage);
      }

      // Save user data
      setInitialUserData({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Close loading alert
      Swal.close();
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Account Created Successfully!',
        text: 'You can now log in to your account.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        willClose: () => {
          setIsAuthDialogOpen(false);
          signupForm.reset();
          setAuthMode('login');
        }
      });
    } catch (err: unknown) {
      console.error('Signup error:', err);
      let errorMessage = 'An unknown error occurred.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String(err.message);
      }

      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: true
      });
      signupForm.reset();
    }
  };

  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send OTP');
      }

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'Please check your email for the OTP code.',
        timer: 3000,
        showConfirmButton: true,
      });

      setResetStep('otp');
    } catch (error) {
      console.error('Request OTP error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to send OTP',
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  const onOTPSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotPasswordForm.getValues('email'),
          otp: values.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      setTempToken(data.tempToken);
      setResetStep('password');
    } catch (error) {
      console.error('Verify OTP error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to verify OTP',
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  const onResetPasswordSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reset password');
      }

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful',
        text: 'You can now log in with your new password.',
        timer: 3000,
        showConfirmButton: true,
      });

      setIsForgotPasswordOpen(false);
      setResetStep('email');
      setTempToken('');
    } catch (error) {
      console.error('Reset password error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to reset password',
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  const handleGoogleSuccess = async (response: { access_token: string }) => {
    try {
      console.log('Google login response:', response);
      
      // Get user info from Google
      const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`);
      const userInfo = await userInfoResponse.json();
      console.log('Google user info:', userInfo);

      // Call backend API route for user authentication
      console.log('Calling backend API route...');
      const apiUrl = getApiBaseUrl();
      const authEndpoint = `${apiUrl}/api/auth/google`;
      console.log('Auth endpoint:', authEndpoint);

      let authResponse;
      try {
        const requestBody = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.sub
        };

        console.log('Request body:', JSON.stringify(requestBody));

        authResponse = await fetch(authEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        console.log('Backend API call completed');
        console.log('Response status:', authResponse.status);
        console.log('Response URL:', authResponse.url);
        console.log('Response headers:', Object.fromEntries(authResponse.headers.entries()));
      } catch (error) {
        console.error('Backend API call failed:', error);
        throw error;
      }

      // Read the response as text first for debugging
      const responseText = await authResponse.text();
      console.log('Raw response text:', responseText);
      console.log('Response text length:', responseText.length);
      console.log('Response text starts with:', responseText.substring(0, 100));

      if (!authResponse.ok) {
        console.error('Auth response not ok:', authResponse.status, responseText);
        throw new Error(`Authentication failed: ${authResponse.status} - ${responseText.substring(0, 200)}`);
      }

      // Try to parse as JSON
      let authData;
      try {
        authData = JSON.parse(responseText);
        console.log('Auth data received:', authData);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
      }

      // Store the token and user data
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      // Update the user state
      setInitialUserData({
        name: authData.user.name,
        email: authData.user.email,
        profilePicture: authData.user.profilePicture
      });
      setToken(authData.token);

      // Close the modal
      setIsAuthDialogOpen(false);
      navigate('/admin');

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error('Google login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error instanceof Error ? error.message : "An error occurred during login",
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('Google login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Failed to login with Google. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    },
    flow: 'implicit',
    scope: 'email profile openid',
  });

  // Update debug logging
  useEffect(() => {
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Google OAuth Config:', {
      redirect_uri: process.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`,
      mode: process.env.NODE_ENV,
      baseUrl: process.env.VITE_API_URL || window.location.origin
    });
  }, []);

  const handleSocialLogin = (provider: 'gmail') => {
    if (provider === 'gmail') {
      googleLogin();
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-serif font-bold text-bahayCebu-darkGray">
            <span className="text-orange-800">Bahay</span><span className="text-bahayCebu-green">Cebu</span>
            <span className="ml-3">Properties</span>
          </h1>
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            Home
          </Link>
          <button onClick={handlePropertiesClick} className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            Properties
          </button>
          <Link to="/about" className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            About
          </Link>
          <Link to="/contact" className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            Agent
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" className="border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green hover:text-white" onClick={() => openAuthDialog('login')}>
              Login
            </Button>
            <Button variant="default" className="bg-bahayCebu-green hover:bg-bahayCebu-green/90" onClick={() => openAuthDialog('signup')}>
              Sign Up
            </Button>
          </div>
          <button onClick={toggleMenu} className="lg:hidden text-bahayCebu-darkGray p-2 focus:outline-none">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 p-5 lg:hidden">
          <nav className="flex flex-col space-y-4 text-lg">
            <Link to="/" onClick={toggleMenu} className="text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              Home
            </Link>
            <button onClick={handlePropertiesClick} className="text-left text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              Properties
            </button>
            <Link to="/about" onClick={toggleMenu} className="text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              About
            </Link>
            <Link to="/contact" onClick={toggleMenu} className="text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              Agent
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Button variant="outline" className="border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green hover:text-white" onClick={() => { toggleMenu(); openAuthDialog('login'); }}>
                Login
              </Button>
              <Button variant="default" className="bg-bahayCebu-green hover:bg-bahayCebu-green/90" onClick={() => { toggleMenu(); openAuthDialog('signup'); }}>
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}

      <ContactModal isOpen={isModalOpen} onClose={closeModal} />

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-center">
            <DialogTitle>{authMode === 'login' ? 'Login to your account' : 'Create an account'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login' ? 'Enter your credentials to access your account.' : 'Fill in the details below to create your account.'}
            </DialogDescription>
          </DialogHeader>

          {authMode === 'login' ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
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
                          <Input type={showPassword ? "text" : "password"} {...field} autoComplete="current-password" />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-bahayCebu-green hover:bg-bahayCebu-green/90">
                  Login
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthDialogOpen(false);
                      setIsForgotPasswordOpen(true);
                    }}
                    className="text-sm text-bahayCebu-green hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
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
                          <Input type={showPassword ? "text" : "password"} {...field} autoComplete="new-password" />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                          <Input type={showConfirmPassword ? "text" : "password"} {...field} autoComplete="new-password" />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-bahayCebu-green hover:bg-bahayCebu-green/90">
                  Sign Up
                </Button>
              </form>
            </Form>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="w-full border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#dadce0] focus:ring-4 focus:ring-[#4285f4]/50 active:bg-[#f1f3f4] text-[#3c4043] font-medium text-sm flex items-center justify-center gap-2 h-10 px-4 rounded-md"
              onClick={() => handleSocialLogin('gmail')}
            >
              <GoogleLogo />
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            {authMode === 'login' ? (
              <p>Don't have an account?{' '}
                <button onClick={() => setAuthMode('signup')} className="text-bahayCebu-green hover:underline font-medium">
                  Sign up
                </button>
              </p>
            ) : (
              <p>Already have an account?{' '}
                <button onClick={() => setAuthMode('login')} className="text-bahayCebu-green hover:underline font-medium">
                  Login
                </button>
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isForgotPasswordOpen} onOpenChange={(open) => {
        setIsForgotPasswordOpen(open);
        if (!open) {
          setResetStep('email');
          setTempToken('');
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {resetStep === 'email' && 'Reset Password'}
              {resetStep === 'otp' && 'Enter OTP'}
              {resetStep === 'password' && 'Create New Password'}
            </DialogTitle>
            <DialogDescription>
              {resetStep === 'email' && 'Enter your email address to receive a password reset OTP.'}
              {resetStep === 'otp' && 'Enter the 6-digit OTP code sent to your email.'}
              {resetStep === 'password' && 'Enter your new password.'}
            </DialogDescription>
          </DialogHeader>

          {resetStep === 'email' && (
            <Form {...forgotPasswordForm}>
              <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-bahayCebu-green hover:bg-bahayCebu-green/90">
                  Send OTP
                </Button>
              </form>
            </Form>
          )}

          {resetStep === 'otp' && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setResetStep('email')}
                    className="text-sm"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="bg-bahayCebu-green hover:bg-bahayCebu-green/90">
                    Verify OTP
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {resetStep === 'password' && (
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                <FormField
                  control={resetPasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={resetPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setResetStep('otp')}
                    className="text-sm"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="bg-bahayCebu-green hover:bg-bahayCebu-green/90">
                    Reset Password
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;