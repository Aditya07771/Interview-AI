// app/dashboard/interview/[interviewId]/page.jsx
"use client";
import { Button } from "@/components/ui/button";
import { Lightbulb, WebcamIcon, Mic } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewMode, setInterviewMode] = useState('manual'); // 'manual' or 'voice'
  const router = useRouter();

  useEffect(() => {
    console.log("Interview ID:", params.interviewId);
    GetInterviewDetails();
  }, [params.interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
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

  const startVoiceInterview = async () => {
    try {
      setLoading(true);
      toast.info("Creating AI voice interviewer...");

      const response = await fetch('/api/vapi/create-voice-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mockId: params.interviewId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create voice interview');
      }

      const data = await response.json();
      
      // Open Vapi web call in new window
      if (data.webCallUrl) {
        window.open(data.webCallUrl, '_blank', 'width=600,height=800');
        toast.success("Voice interview started! Complete it in the new window.");
        
        // Redirect to feedback after some time or when window closes
        setTimeout(() => {
          router.push(`/dashboard/interview/${params.interviewId}/feedback`);
        }, 5000);
      }

    } catch (error) {
      console.error("Voice interview error:", error);
      toast.error(error.message || "Failed to start voice interview");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !interviewData) {
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
    <div className="my-20 mx-auto px-4">
      <h2 className="font-bold text-2xl mb-6">Let's Get Started</h2>
      
      {/* Interview Mode Selection */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Choose Interview Mode:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setInterviewMode('manual')}
            className={`p-6 rounded-lg border-2 transition-all ${
              interviewMode === 'manual'
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <WebcamIcon className={`h-12 w-12 mx-auto mb-3 ${
              interviewMode === 'manual' ? 'text-primary' : 'text-gray-400'
            }`} />
            <h4 className="font-semibold text-lg mb-2">Manual Mode</h4>
            <p className="text-sm text-gray-600">
              Record your answers at your own pace
            </p>
          </button>

          <button
            onClick={() => setInterviewMode('voice')}
            className={`p-6 rounded-lg border-2 transition-all ${
              interviewMode === 'voice'
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Mic className={`h-12 w-12 mx-auto mb-3 ${
              interviewMode === 'voice' ? 'text-primary' : 'text-gray-400'
            }`} />
            <h4 className="font-semibold text-lg mb-2">AI Voice Interview</h4>
            <p className="text-sm text-gray-600">
              Real-time conversation with AI interviewer
            </p>
          </button>
        </div>
      </div>

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
              {interviewMode === 'voice' 
                ? "You'll have a real-time conversation with an AI interviewer. Speak naturally and answer each question. The interview will be automatically transcribed and analyzed."
                : "Enable your webcam and microphone to start the interview. You'll see questions one by one and can record your answers at your own pace."}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {interviewMode === 'manual' ? (
            webCamEnabled ? (
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
            )
          ) : (
            <div className="w-full">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center p-8" 
                   style={{ height: 400 }}>
                <Mic className="h-24 w-24 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  AI Voice Interview Ready
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Click "Start Voice Interview" to begin your conversation with the AI interviewer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end items-center mt-10 gap-4">
        <Link href="/dashboard">
          <Button variant="outline">Cancel</Button>
        </Link>
        
       {interviewMode === 'voice' ? (
  <Link href={`/dashboard/interview/${params.interviewId}/voice`}>
    <Button 
      className="bg-indigo-600 hover:bg-indigo-700"
    >
      Start Voice Interview
    </Button>
  </Link>
) : (
  <Link href={`/dashboard/interview/${params.interviewId}/start`}>
    <Button 
      disabled={!webCamEnabled}
      className={!webCamEnabled ? "opacity-50 cursor-not-allowed" : ""}
    >
      Start Manual Interview
    </Button>
  </Link>
)}
      </div>
      
      {interviewMode === 'manual' && !webCamEnabled && (
        <p className="text-right text-sm text-gray-500 mt-2">
          Please enable your camera to start the manual interview
        </p>
      )}
    </div>
  );
}

export default Interview;