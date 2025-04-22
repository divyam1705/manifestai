"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import { supabase } from '@/lib/supabase'; // Ensure you have the supabase client set up
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<null | object>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser(user);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUser();
    }, []);

    const handleGoogleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar',
            }
        });

        if (error) {
            alert("Error during Google login:" + error.message);
        } else {
            console.log("Google login successful:", data);
        }
    };

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error during sign out:" + error.message);
        } else {
            setUser(null);
        }
    }

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false); // Close mobile menu after clicking
        }
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-40"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
                <div className="backdrop-blur-xl bg-slate-950 rounded-lg border border-slate-900 shadow-lg px-4 py-2 flex items-center justify-between">
                    {/* Subtle glow effect */}
                    <div className="bg-slate-950 absolute inset-0 rounded-lg"></div>

                    {/* Logo */}
                    <motion.div
                        className="flex items-center relative "
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <button onClick={() => router.push("/")} className="flex items-center space-x-2 cursor-pointer">
                            <Image src="/manifest-icon.png" alt="Logo" width={45} height={45} className="rounded-lg shadow-2xl border border-neutral-900" />
                            <span className="text-white font-semibold text-xl font-raleway">
                                Manifest AI
                            </span>
                        </button>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6 relative">
                        <NavLink onClick={() => scrollToSection('features')}>Features</NavLink>
                        <NavLink onClick={() => scrollToSection('pricing')}>Pricing</NavLink>
                        <NavLink onClick={() => router.push("/privacy-policy")}>Privacy</NavLink>


                        {!user ? (
                            <Button
                                onClick={handleGoogleLogin}
                                className="bg-black hover:bg-gray-900 text-white border border-slate-800 py-2 px-4 flex items-center space-x-2"
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                    </g>
                                </svg>
                                <span>Login with Google</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={signOut}
                                className="bg-black hover:bg-gray-900 text-white border border-slate-800 py-2 px-4 flex items-center space-x-2"
                            >
                                <span>Sign Out</span>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Navigation Button */}
                    <div className="md:hidden relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-slate-700/50"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Full Screen */}
            {isMenuOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-30 md:hidden"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
                        <button
                            className="text-2xl font-raleway text-white hover:text-blue-400 transition-colors"
                            onClick={() => scrollToSection('features')}
                        >
                            Features
                        </button>

                        <button
                            className="text-2xl font-raleway text-white hover:text-blue-400 transition-colors"
                            onClick={() => scrollToSection('pricing')}
                        >
                            Pricing
                        </button>

                        {!user ? (
                            <Button
                                onClick={handleGoogleLogin}
                                className="bg-black hover:bg-gray-900 text-white border border-slate-800 py-6 px-8 text-lg flex items-center space-x-2 mt-4"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                    </g>
                                </svg>
                                Login with Google
                            </Button>
                        ) : (
                            <Button
                                onClick={signOut}
                                className="bg-black hover:bg-gray-900 text-white border border-slate-800 py-6 px-8 text-lg mt-4"
                            >
                                Sign Out
                            </Button>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
};

// Animated NavLink Component
const NavLink = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
    return (
        <button onClick={onClick} className="relative group">
            <span className="text-gray-300 hover:text-white transition-colors font-raleway">{children}</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-500 group-hover:w-full transition-all duration-300"></span>
        </button>
    );
};

export default Navbar; 