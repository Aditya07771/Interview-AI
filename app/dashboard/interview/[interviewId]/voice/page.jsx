"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";

export default function VoiceInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");
  const [transcript, setTranscript] = useState([]);
  const [assistantId, setAssistantId] = useState(null);
  const vapiRef = useRef(null);

  useEffect(() => {
    // Initialize Vapi with PUBLIC key
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      console.error("NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set");
      toast.error("Vapi configuration error");
      return;
    }

    console.log("Initializing Vapi with public key");
    vapiRef.current = new Vapi(publicKey);

    // Set up event listeners
    vapiRef.current.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
      setCallStatus("active");
      toast.success("Interview started!");
    });

    vapiRef.current.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setCallStatus("ended");
      toast.info("Interview ended");
      
      // Save transcript after a short delay
      setTimeout(() => {
        saveTranscriptAndRedirect();
      }, 1000);
    });

    vapiRef.current.on("speech-start", () => {
      console.log("Assistant started speaking");
    });

    vapiRef.current.on("speech-end", () => {
      console.log("Assistant stopped speaking");
    });

    vapiRef.current.on("message", (message) => {
      console.log("Message received:", message);
      
      // Handle different message types
      if (message.type === "transcript") {
        if (message.transcriptType === "final") {
          setTranscript(prev => [...prev, {
            role: message.role,
            text: message.transcript,
            timestamp: new Date().toISOString(),
          }]);
        }
      }
    });

    vapiRef.current.on("error", (error) => {
      console.error("Vapi error:", error);
      toast.error("Interview error occurred");
      setCallStatus("idle");
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startInterview = async () => {
    try {
      setCallStatus("connecting");
      toast.info("Creating your AI interviewer...");

      // Create assistant on backend
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create interview');
      }

      const data = await response.json();
      console.log("Assistant created:", data);

      setAssistantId(data.assistantId);

      toast.info("Connecting to voice interview...");

      // Start the call with Vapi using the assistant ID
      await vapiRef.current.start(data.assistantId);

      console.log("Call started with assistant:", data.assistantId);

    } catch (error) {
      console.error("Start interview error:", error);
      toast.error(error.message || "Failed to start interview");
      setCallStatus("idle");
    }
  };

  const endInterview = async () => {
    if (vapiRef.current) {
      console.log("Ending call...");
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
      toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
    }
  };

  const saveTranscriptAndRedirect = async () => {
    try {
      console.log("Saving transcript...", transcript);

      if (transcript.length === 0) {
        toast.error("No responses recorded");
        router.push(`/dashboard/interview/${params.interviewId}`);
        return;
      }

      toast.info("Saving your responses...");

      // Save transcript and generate feedback
      const response = await fetch('/api/vapi/save-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mockId: params.interviewId,
          transcript: transcript,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save transcript');
      }

      const result = await response.json();
      console.log("Transcript saved:", result);

      toast.success("Responses saved! Generating feedback...");
      
      // Redirect to feedback page
      setTimeout(() => {
        router.push(`/dashboard/interview/${params.interviewId}/feedback`);
      }, 1500);

    } catch (error) {
      console.error("Save transcript error:", error);
      toast.error("Failed to save responses");
      
      // Still redirect even if save fails
      setTimeout(() => {
        router.push(`/dashboard/interview/${params.interviewId}`);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Voice Interview
            </h1>
            <p className="text-gray-600">
              {callStatus === "idle" && "Click 'Start Interview' to begin"}
              {callStatus === "connecting" && "Connecting to AI interviewer..."}
              {callStatus === "active" && "Interview in progress - Speak clearly!"}
              {callStatus === "ended" && "Interview completed"}
            </p>
          </div>

          {/* Call Status Indicator */}
          <div className="mb-8">
            <div className={`
              h-32 rounded-lg flex items-center justify-center transition-all
              ${callStatus === "active" ? "bg-gradient-to-br from-green-400 to-green-600" : "bg-gray-100"}
            `}>
              {callStatus === "active" ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Mic className="h-10 w-10 text-green-600" />
                  </div>
                  <p className="text-white font-semibold">Interview Active</p>
                </div>
              ) : (
                <div className="text-center">
                  <MicOff className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {callStatus === "connecting" ? "Connecting..." : "Not Connected"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transcript Display */}
          {transcript.length > 0 && (
            <div className="mb-6 max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Conversation:</h3>
              <div className="space-y-3">
                {transcript.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.role === "assistant"
                        ? "bg-indigo-100 text-indigo-900"
                        : "bg-green-100 text-green-900"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {msg.role === "assistant" ? "🤖 AI Interviewer" : "👤 You"}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {callStatus === "active" && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                💡 <strong>Tip:</strong> Listen to the AI interviewer's question, then speak your answer clearly. 
                The AI will automatically move to the next question after you finish.
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="space-y-4">
            {callStatus === "idle" && (
              <Button
                onClick={startInterview}
                className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700"
              >
                <Phone className="mr-2 h-5 w-5" />
                Start Interview
              </Button>
            )}

            {callStatus === "connecting" && (
              <Button disabled className="w-full h-14 text-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connecting...
              </Button>
            )}

            {callStatus === "active" && (
              <>
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  className="w-full h-14 text-lg"
                >
                  {isMuted ? (
                    <>
                      <MicOff className="mr-2 h-5 w-5" />
                      Unmute Microphone
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      Mute Microphone
                    </>
                  )}
                </Button>

                <Button
                  onClick={endInterview}
                  variant="destructive"
                  className="w-full h-14 text-lg"
                >
                  <PhoneOff className="mr-2 h-5 w-5" />
                  End Interview
                </Button>
              </>
            )}

            {callStatus === "ended" && (
              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/dashboard/interview/${params.interviewId}/feedback`)}
                  className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                >
                  View Feedback & Results
                </Button>
                <Button
                  onClick={startInterview}
                  variant="outline"
                  className="w-full h-14 text-lg"
                >
                  Retake Interview
                </Button>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push(`/dashboard/interview/${params.interviewId}`)}
              disabled={callStatus === "active"}
            >
              ← Back to Interview Options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}