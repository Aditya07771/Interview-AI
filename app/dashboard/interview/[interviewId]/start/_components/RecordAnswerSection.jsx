// // app/dashboard/interview/[interviewId]/start/_components/RecordAnswerSection.jsx
// "use client";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Webcam from "react-webcam";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic, StopCircle } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModal.js";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";

// function RecordAnswerSection({
//   mockInterviewQuestion,
//   activeQuestionIndex,
//   interviewData,
// }) {
//   const [userAnswer, setUserAnswer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { user } = useUser();

//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//     setResults,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });

//   useEffect(() => {
//     results.forEach((result) => {
//       setUserAnswer((prevAns) => prevAns + result?.transcript);
//     });
//   }, [results]);

//   useEffect(() => {
//     if (!isRecording && userAnswer?.length > 10) {
//       UpdateUserAnswer();
//     }
//   }, [userAnswer]);

//   const StartStopRecording = async () => {
//     if (isRecording) {
//       stopSpeechToText();
//     } else {
//       startSpeechToText();
//     }
//   };

//   const saveAnswer = async (interviewId, question, userAns, correctAns, feedback, rating, userEmail) => {
//   const res = await fetch(`/api/interview/${interviewId}/answer`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ question, userAns, correctAns, feedback, rating, userEmail }),
//   });

//   if (!res.ok) {
//     console.error("Failed to save answer");
//   }
// };


//   const UpdateUserAnswer = async () => {
//     console.log("Updating user answer:", userAnswer);
//     setLoading(true);
    
//     try {
//       const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, 
//         User Answer: ${userAnswer}, 
//         Depends on question and user answer for the given interview question, 
//         please give us rating for answer and feedback as area of improvement if any 
//         in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

//       const result = await chatSession.sendMessage(feedbackPrompt);
//       const mockJsonResp = result.response
//         .text()
//         .replace("```json", "")
//         .replace("```", "");
//       console.log("AI Feedback:", mockJsonResp);
      
//       const JsonFeedbackResp = JSON.parse(mockJsonResp);

//       // Save to database via API
//       const response = await fetch("/api/interview/answer", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mockIdRef: interviewData?.mockId,
//           question: mockInterviewQuestion[activeQuestionIndex]?.question,
//           correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//           userAns: userAnswer,
//           feedback: JsonFeedbackResp?.feedback,
//           rating: JsonFeedbackResp?.rating,
//           userEmail: user?.primaryEmailAddress?.emailAddress,
//           createdAt: moment().format("DD-MM-YYYY"),
//         }),
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         toast.success("Answer recorded successfully");
//         setUserAnswer("");
//         setResults([]);
//       } else {
//         throw new Error(data.error || "Failed to save answer");
//       }
//     } catch (error) {
//       console.error("Error updating answer:", error);
//       toast.error("Failed to save your answer. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center flex-col">
//       <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20">
//         <Image
//           src="/webcam.png"
//           width={200}
//           height={200}
//           className="absolute"
//           alt="Webcam placeholder"
//         />
//         <Webcam
//           mirrored={true}
//           style={{
//             height: 300,
//             width: "100%",
//             zIndex: 10,
//           }}
//         />
//       </div>
      
//       <Button
//         disabled={loading}
//         variant="outline"
//         className="my-10"
//         onClick={StartStopRecording}
//       >
//         {isRecording ? (
//           <div className="flex items-center gap-2 text-red-600">
//             <StopCircle className="h-4 w-4" />
//             <span>Stop Recording</span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-2">
//             <Mic className="h-4 w-4" />
//             <span>Record Answer</span>
//           </div>
//         )}
//       </Button>

//       {/* Show recording status */}
//       {isRecording && (
//         <div className="text-center">
//           <p className="text-red-500 animate-pulse">Recording in progress...</p>
//           {interimResult && (
//             <p className="text-gray-600 text-sm mt-2">
//               Current: {interimResult}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Show user answer */}
//       {userAnswer && !isRecording && (
//         <div className="mt-4 p-4 border rounded-lg bg-gray-50 max-w-lg">
//           <h3 className="font-semibold mb-2">Your Answer:</h3>
//           <p className="text-gray-700">{userAnswer}</p>
//           <Button
//             onClick={() => {
//               setUserAnswer("");
//               setResults([]);
//             }}
//             variant="ghost"
//             className="mt-2"
//           >
//             Clear Answer
//           </Button>
//         </div>
//       )}

//       {/* Show error if any */}
//       {error && (
//         <div className="text-red-500 mt-2">
//           Error: {error}
//         </div>
//       )}

//       {/* Loading state */}
//       {loading && (
//         <div className="text-center mt-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="text-gray-600 mt-2">Processing your answer...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RecordAnswerSection;
// app/dashboard/interview/[interviewId]/start/_components/RecordAnswerSection.jsx
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal.js";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Reset user answer when question changes
  useEffect(() => {
    setUserAnswer("");
    setResults([]);
  }, [activeQuestionIndex, setResults]);

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  // Removed automatic saving on stop recording
  // Now we'll manually trigger save

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    if (!userAnswer || userAnswer.length < 10) {
      toast.error("Please provide a longer answer (at least 10 characters)");
      return;
    }

    console.log("Updating user answer:", userAnswer);
    setLoading(true);
    
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, 
        User Answer: ${userAnswer}, 
        Based on the question and user answer for the given interview question, 
        please provide a rating (out of 10) and feedback for areas of improvement (3-5 lines).
        Return ONLY a valid JSON object with this exact structure:
        {
          "rating": "8",
          "feedback": "Your feedback here"
        }`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      let mockJsonResp = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      
      console.log("AI Feedback Raw:", mockJsonResp);
      
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      console.log("Parsed Feedback:", JsonFeedbackResp);

      // Save to database via API
      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback || "No feedback provided",
          rating: JsonFeedbackResp?.rating || "0",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        }),
      });

      const data = await response.json();
      
      console.log("API Response:", data);

      if (response.ok && data.success) {
        toast.success("Answer recorded successfully!");
        setUserAnswer("");
        setResults([]);
      } else {
        throw new Error(data.error || "Failed to save answer");
      }
    } catch (error) {
      console.error("Error updating answer:", error);
      toast.error(error.message || "Failed to save your answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20">
        <Image
          src="/webcam.png"
          width={200}
          height={200}
          className="absolute"
          alt="Webcam placeholder"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      {/* Display Current Question */}
      <div className="mt-6 p-4 border rounded-lg bg-blue-50 max-w-2xl w-full">
        <h3 className="font-semibold text-lg mb-2 text-blue-900">
          Question {activeQuestionIndex + 1}:
        </h3>
        <p className="text-gray-800">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </p>
      </div>
      
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <div className="flex items-center gap-2 text-red-600">
            <StopCircle className="h-4 w-4" />
            <span>Stop Recording</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span>Record Answer</span>
          </div>
        )}
      </Button>

      {/* Show recording status */}
      {isRecording && (
        <div className="text-center w-full max-w-2xl">
          <p className="text-red-500 animate-pulse font-semibold">
            🔴 Recording in progress...
          </p>
          {interimResult && (
            <div className="mt-3 p-3 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Live transcription:</span> {interimResult}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Show user answer for current question */}
      {userAnswer && !isRecording && (
        <div className="mt-4 p-4 border rounded-lg bg-green-50 max-w-2xl w-full">
          <h3 className="font-semibold mb-2 text-green-900">
            Your Answer for Question {activeQuestionIndex + 1}:
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">{userAnswer}</p>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={UpdateUserAnswer}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Submitting..." : "Submit Answer"}
            </Button>
            <Button
              onClick={() => {
                setUserAnswer("");
                setResults([]);
              }}
              variant="ghost"
              size="sm"
              disabled={loading}
            >
              Clear Answer
            </Button>
          </div>
        </div>
      )}

      {/* Show error if any */}
      {error && (
        <div className="text-red-500 mt-2 p-3 bg-red-50 rounded-lg max-w-2xl w-full">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Processing your answer...</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;