"use client";
import { SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [controlNavbar]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/about-us", label: "About us" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 transition-transform"
              >
                <Bot className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                MockMate AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative font-medium transition-colors group
                    ${path === item.href 
                      ? 'text-violet-600' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {item.label}
                  <span 
                    className={`
                      absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 
                      transition-all duration-300
                      ${path === item.href ? 'w-full' : 'w-0 group-hover:w-full'}
                    `}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05, translateY: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      px-6 py-2.5
                      bg-gradient-to-r from-violet-600 to-indigo-600 
                      hover:from-violet-700 hover:to-indigo-700 
                      text-white font-medium
                      rounded-lg
                      shadow-lg hover:shadow-xl 
                      transition-all duration-300
                      flex items-center gap-2
                    "
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10 border-2 border-violet-100",
                      userButtonPopoverCard: "shadow-xl",
                      userButtonPopoverActionButton: "hover:bg-violet-50",
                    },
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-violet-600 transition-colors"
                aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="
                fixed right-0 top-0 bottom-0
                w-[80%] max-w-sm
                bg-white shadow-2xl z-50 md:hidden
                overflow-y-auto
              "
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    MockMate AI
                  </span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`
                        block px-4 py-3 rounded-lg font-medium
                        transition-all duration-300
                        ${path === item.href
                          ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 border-l-4 border-violet-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-violet-600'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              <div className="p-4 border-t mt-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeMobileMenu}
                      className="
                        w-full px-4 py-3
                        bg-gradient-to-r from-violet-600 to-indigo-600
                        hover:from-violet-700 hover:to-indigo-700
                        text-white font-medium
                        rounded-lg
                        shadow-lg hover:shadow-xl
                        transition-all duration-300
                        flex items-center justify-center gap-2
                      "
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">Account</p>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            userButtonAvatarBox: "w-16 h-16 border-2 border-violet-100",
                            userButtonPopoverCard: "shadow-xl",
                          },
                        }}
                      />
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="
                        w-full px-4 py-2
                        bg-violet-50 text-violet-600
                        rounded-lg font-medium
                        hover:bg-violet-100
                        transition-colors
                        text-center
                      "
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </SignedIn>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  © 2025 MockMate AI. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;