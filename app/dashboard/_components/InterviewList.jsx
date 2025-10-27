"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import InterviewItemCard from "./InterviewItemCard";
import { FileQuestion, Sparkles, Clock, TrendingUp } from "lucide-react";

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getInterviewList();
    }
  }, [user]);

  const getInterviewList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/getInterviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: user.primaryEmailAddress.emailAddress
        })
      });

      if (response.ok) {
        const data = await response.json();
        setInterviewList(data.interviews || []);
      } else {
        console.error('Failed to fetch interviews');
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewDeleted = () => {
    getInterviewList();
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Custom Loading Animation */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="w-full h-full rounded-full border-4 border-violet-200 border-t-violet-600" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2"
            >
              <div className="w-full h-full rounded-full border-4 border-indigo-200 border-b-indigo-600" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-violet-600" />
            </div>
          </div>
          <p className="text-lg font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Loading your interviews...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {interviewList.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Empty State Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 via-white to-indigo-50 border border-violet-100 p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center max-w-md mx-auto">
              {/* Icon Container */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 
                }}
                className="relative inline-block mb-6"
              >
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-200 flex items-center justify-center">
                  <FileQuestion className="h-12 w-12 text-white" />
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-xl"
                />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Interviews Yet
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Start your first AI-powered mock interview to begin practicing and track your progress over time
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { icon: <Clock className="h-4 w-4" />, text: "5-10 min sessions" },
                  { icon: <TrendingUp className="h-4 w-4" />, text: "Track progress" },
                  { icon: <Sparkles className="h-4 w-4" />, text: "AI-powered" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
                  >
                    <span className="text-violet-600">{item.icon}</span>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Interview Count Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-full"
          >
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-600">
              {interviewList.length} Interview{interviewList.length !== 1 ? 's' : ''} Completed
            </span>
          </motion.div>

          {/* Interview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {interviewList.map((interview, index) => (
              <motion.div
                key={interview.mockId || index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.4,
                  delay: Math.min(index * 0.08, 0.3),
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="relative group"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-indigo-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                
                {/* Interview Card */}
                <div className="relative">
                  <InterviewItemCard 
                    interview={interview} 
                    onDelete={handleInterviewDeleted}
                  />
                </div>

                {/* Index Badge (for first 3 items) */}
                {index < 3 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="absolute -top-2 -right-2 z-10"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Load More or Stats Section (Optional) */}
          {interviewList.length > 8 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500">
                Showing all {interviewList.length} interviews
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InterviewList;