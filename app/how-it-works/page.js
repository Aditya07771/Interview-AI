"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Brain, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HowItWorksPage = () => {
  const steps = [
    {
      number: "01",
      icon: <Upload className="h-8 w-8" />,
      title: "Upload or Enter Details",
      description: "Upload your resume or fill in your job role and experience. Our AI reads and understands your background in seconds.",
      color: "from-violet-500 to-violet-600"
    },
    {
      number: "02",
      icon: <Brain className="h-8 w-8" />,
      title: "AI Generates Questions",
      description: "Using DeepSeek AI, we create personalized interview questions based on your skills, projects, and career goals.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      number: "03",
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Practice & Get Feedback",
      description: "Talk to our voice agent for a live interview or answer manually — receive instant, detailed feedback on your performance.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-medium text-violet-600">Simple Process</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            3 Steps to Smarter Interviews
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          In just three easy steps, get ready for the most realistic mock interview experience powered by AI.
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-violet-600">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-16 px-4"
      >
        <Link href="/dashboard">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            Start Your Interview Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HowItWorksPage;