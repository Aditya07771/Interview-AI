// app/dashboard/interview/[interviewId]/start/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// import QuestionSection from "./_components/QuestionSection";
import QuestionSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview() {
  const params = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.interviewId) {
      GetInterviewDetails();
    }
  }, [params.interviewId]);

  /**
   * Fetch Interview Details from API
   */
  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from the API route instead of using Prisma directly
      const response = await fetch(`/api/interview/${params.interviewId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch interview: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Interview data fetched:", result);
      
      // Parse the JSON mock response
      if (result && result.jsonMockResp) {
        const questions = JSON.parse(result.jsonMockResp);
        console.log("Parsed questions:", questions);
        setMockInterviewQuestion(questions);
        setInterviewData(result);
      } else {
        throw new Error("No interview questions found");
      }
    } catch (error) {
      console.error("Failed to fetch interview details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Link href={`/dashboard/interview/${params.interviewId}`}>
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No interview questions found</p>
          <Link href={`/dashboard/interview/${params.interviewId}`}>
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Question Section */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Record Answer Section */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <div className="flex gap-2">
          {activeQuestionIndex > 0 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            >
              Previous Question
            </Button>
          )}
          {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            >
              Next Question
            </Button>
          )}
        </div>
        
        {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button className="bg-red-500 hover:bg-red-600">
              End Interview
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;