"use client";

import { motion } from "framer-motion";
import { Bot, Upload, MessageSquare, BarChart3, Star, Sparkles, Users, Award, ArrowRight, Mic, Brain, Zap, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/about-us", label: "About us" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white w-full">
     
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          />
        </div>

        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-6"
              >
                <Sparkles className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-600">AI-Powered Interview Prep</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Master Your Next
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Interview with AI
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Practice real interview questions, get instant voice feedback, and boost your confidence with personalized AI coaching.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Start Free Mock Interview
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-gray-200 hover:border-violet-600 hover:bg-violet-50 transition-all duration-300 group"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <Play className="mr-2 h-5 w-5 text-violet-600 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-8 mt-8"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-600" />
                  <span className="text-sm text-gray-600"><strong>10,000+</strong> Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600"><strong>4.9/5</strong> Rating</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Animated Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* Central AI Orb */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 opacity-20 blur-3xl"
                />
                
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-violet-600 mb-2">AI Interviewer</p>
                      <p className="text-gray-700">"Tell me about your experience with React and TypeScript?"</p>
                    </div>
                    
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-violet-200"
                    >
                      <div className="flex items-center gap-2 text-violet-600">
                        <Mic className="h-5 w-5" />
                        <span className="text-sm font-medium">Listening to your response...</span>
                      </div>
                      <div className="flex gap-1 mt-3">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: ["8px", "24px", "8px"] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                            className="w-1 bg-gradient-to-t from-violet-600 to-indigo-600 rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute top-10 right-10"
                >
                  <Brain className="h-12 w-12 text-violet-600 opacity-60" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 20, 0],
                    rotate: [360, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-10 left-10"
                >
                  <BarChart3 className="h-12 w-12 text-indigo-600 opacity-60" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Simple 4-Step Process
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From preparation to perfection in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: <Upload className="h-8 w-8" />,
                title: "Upload Resume",
                description: "Share your resume for personalized questions",
                color: "from-violet-500 to-violet-600"
              },
              {
                step: "02",
                icon: <Brain className="h-8 w-8" />,
                title: "AI Analysis",
                description: "Get role-specific interview questions",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                step: "03",
                icon: <Mic className="h-8 w-8" />,
                title: "Voice Interview",
                description: "Practice with our AI interviewer",
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "04",
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Get Feedback",
                description: "Receive detailed performance insights",
                color: "from-pink-500 to-pink-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <Card className="relative p-8 h-full bg-white hover:shadow-2xl transition-all duration-300 border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className={`relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-5xl font-bold text-gray-100 mb-2">{item.step}</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-6">
                <Zap className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-600">Live Demo</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Experience the Power
                </span>
                <br />
                <span className="text-gray-900">of AI Interviews</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Bot className="h-6 w-6" />,
                    title: "Natural Conversations",
                    description: "AI that understands context and provides relevant follow-ups"
                  },
                  {
                    icon: <CheckCircle className="h-6 w-6" />,
                    title: "Instant Scoring",
                    description: "Get real-time scores and improvement suggestions"
                  },
                  {
                    icon: <Award className="h-6 w-6" />,
                    title: "Skill Assessment",
                    description: "Comprehensive evaluation of technical and soft skills"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <div className="text-violet-600">{feature.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Try Demo Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-violet-50 to-indigo-50 p-8">
                <div className="aspect-video bg-white rounded-xl flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-center"
                  >
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                      <Mic className="h-16 w-16 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Click to start demo</p>
                  </motion.div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {["Confidence", "Clarity", "Content"].map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        {85 + index * 5}%
                      </div>
                      <div className="text-sm text-gray-600">{metric}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-violet-600" />
              Join 10,000+ successful candidates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                content: "MockMate AI transformed my interview prep. The real-time feedback was invaluable!",
                rating: 5,
                image: "SC"
              },
              {
                name: "Raj Patel",
                role: "Product Manager at Meta",
                content: "Practiced 50+ mock interviews. Landed my dream job with confidence!",
                rating: 5,
                image: "RP"
              },
              {
                name: "Emma Wilson",
                role: "Data Scientist at Amazon",
                content: "The AI questions were spot-on. Felt completely prepared for the real thing.",
                rating: 5,
                image: "EW"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full bg-white hover:shadow-2xl transition-all duration-300 border-gray-100 group">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Improved Design */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                <Award className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            {/* Heading */}
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">
              Ready to <span className="text-yellow-300">Master</span> Your
              <br />Next Interview?
            </h2>
            
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands who've already transformed their interview performance. 
              Start your AI-powered practice session now and land your dream job.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                "✓ No Credit Card Required",
                "✓ 5 Free Mock Interviews",
                "✓ Instant AI Feedback"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-white/90"
                >
                  <span className="text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-violet-600 hover:bg-gray-100 shadow-2xl text-lg px-8 py-6 font-bold group"
                >
                  <Sparkles className="mr-2 h-6 w-6 text-yellow-500 group-hover:rotate-12 transition-transform" />
                  Start Free Mock Interview
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 font-bold"
                >
                  View Pricing Plans
                </Button>
              </motion.div>
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 border-2 border-white" />
                ))}
              </div>
              <span className="text-white text-sm">
                <strong>2,847</strong> interviews completed today
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default Index;