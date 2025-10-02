// app/dashboard/interview/[interviewId]/page.jsx
"use client";
import { Button } from "@/components/ui/button";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Interview ID:", params.interviewId);
    GetInterviewDetails();
  }, [params.interviewId]);

  /**
   * Fetch Interview Details from API
   */
  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API route instead of using Prisma directly
      const response = await fetch(`/api/interview/${params.interviewId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Interview data:", result);
      setInterviewData(result);
    } catch (error) {
      console.error("Interview details fetch error:", error);
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
          <p className="mt-4 text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Error loading interview: {error}</p>
          <Button onClick={GetInterviewDetails} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No interview data found</p>
      </div>
    );
  }

  return (
    <div className="my-10 mx-auto max-w-7xl px-4">
      <h2 className="font-bold text-2xl mb-6">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col p-5 rounded-lg border gap-5 bg-white shadow-sm">
            <div className="space-y-3">
              <h2 className="text-lg">
                <strong className="text-gray-700">Job Role/Job Position:</strong>{" "}
                <span className="text-gray-900">{interviewData.jobPosition}</span>
              </h2>
              <h2 className="text-lg">
                <strong className="text-gray-700">Job Description/Tech Stack:</strong>{" "}
                <span className="text-gray-900">{interviewData.jobDesc}</span>
              </h2>
              <h2 className="text-lg">
                <strong className="text-gray-700">Years of Experience:</strong>{" "}
                <span className="text-gray-900">{interviewData.jobExperience}</span>
              </h2>
            </div>
          </div>
          
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-50">
            <h2 className="flex gap-2 items-center text-yellow-700 font-semibold">
              <Lightbulb className="h-5 w-5" />
              Information
            </h2>
            <p className="mt-3 text-yellow-700 text-sm leading-relaxed">
              {process.env.NEXT_PUBLIC_INFORMATION || 
               "Enable your webcam and microphone to start the AI-powered mock interview. " +
               "The interview will consist of 5 questions related to your job position. " +
               "You'll have unlimited time to answer each question. Speak clearly and confidently!"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {webCamEnabled ? (
            <div className="w-full">
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                className="rounded-lg border shadow-lg w-full"
                style={{
                  height: 400,
                  width: "100%",
                }}
              />
              <p className="text-center text-sm text-gray-600 mt-2">
                Camera enabled - You're ready to start!
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center" 
                   style={{ height: 400 }}>
                <WebcamIcon className="h-24 w-24 text-gray-400" />
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end items-center mt-10 gap-4">
        <Link href="/dashboard">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Link
          href={`/dashboard/interview/${params.interviewId}/start`}
        >
          <Button 
            disabled={!webCamEnabled}
            className={!webCamEnabled ? "opacity-50 cursor-not-allowed" : ""}
          >
            Start Interview
          </Button>
        </Link>
      </div>
      
      {!webCamEnabled && (
        <p className="text-right text-sm text-gray-500 mt-2">
          Please enable your camera to start the interview
        </p>
      )}
    </div>
  );
}

export default Interview;