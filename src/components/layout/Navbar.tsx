import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, Facebook, Mail, Eye, EyeOff } from 'lucide-react';
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

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        handleLoginRequest(values);
      }
    });
  };

  const handleLoginRequest = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Close loading alert
      Swal.close();
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        willClose: () => {
          setIsAuthDialogOpen(false);
          navigate('/admin');
        }
      });
    } catch (err: unknown) {
      console.error('Login error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err instanceof Error ? err.message : 'An unknown error occurred.',
        timer: 1500,
        showConfirmButton: false
      });
      loginForm.reset();
    }
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

      const res = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      });

      let data;
      const responseText = await res.text();
      console.log('Raw server response:', responseText);
      
      try {
        data = JSON.parse(responseText);
        console.log('Parsed server response:', data);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Signup failed');
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

  const handleSocialLogin = (provider: 'facebook' | 'gmail') => {
    console.log(`Login with ${provider}`);
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
                          <Input type={showPassword ? "text" : "password"} {...field} />
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
                          <Input type={showPassword ? "text" : "password"} {...field} />
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
                          <Input type={showConfirmPassword ? "text" : "password"} {...field} />
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

          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50" onClick={() => handleSocialLogin('facebook')}>
              <Facebook className="mr-2 h-5 w-5 text-blue-600" /> Facebook
            </Button>
            <Button variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50" onClick={() => handleSocialLogin('gmail')}>
              <Mail className="mr-2 h-5 w-5 text-red-500" /> Gmail
            </Button>
          </div>

          <DialogFooter className="flex flex-col space-y-2">
            <div className="text-center">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;