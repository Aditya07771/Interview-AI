"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import InterviewItemCard from "./InterviewItemCard"

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
    // Refresh the list when an interview is deleted
    getInterviewList();
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p>Loading interviews...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
      {interviewList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No interviews found. Create your first interview above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard 
              interview={interview} 
              key={interview.mockId || index}
              onDelete={handleInterviewDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;