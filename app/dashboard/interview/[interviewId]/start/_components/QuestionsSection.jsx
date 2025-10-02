// app/dashboard/interview/[interviewId]/start/_components/QuestionSection.jsx
"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, Your browser doesn't support text to speech");
    }
  };

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return (
      <div className="p-5 border rounded-lg bg-gray-50">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion.map((question, index) => (
          <div key={index}>
            <h2
              className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex === index
                  ? "bg-primary text-white"
                  : "bg-secondary"
              }`}
            >
              Question #{index + 1}
            </h2>
          </div>
        ))}
      </div>
      
      <h2 className="my-5 text-lg md:text-xl font-semibold">
        {currentQuestion?.question}
      </h2>
      
      <Volume2
        className="cursor-pointer hover:text-primary transition-colors"
        onClick={() => textToSpeech(currentQuestion?.question)}
      />

      <div className="border rounded-lg p-5 bg-blue-100 mt-10">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb className="h-5 w-5" />
          <strong>Note:</strong>
        </h2>
        <p className="text-sm text-primary my-2">
          Click on the Record Answer button when you are ready to answer the question.
          At the end of the interview, we will give you feedback along with the correct
          answer for each question and your answer to compare it.
        </p>
      </div>
    </div>
  );
}

export default QuestionSection;