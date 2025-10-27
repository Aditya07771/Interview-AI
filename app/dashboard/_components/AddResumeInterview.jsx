// app/dashboard/_components/ResumeUploadForm.jsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import { toast } from "sonner";

function ResumeUploadForm({ resumeFile, setResumeFile }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only');
        e.target.value = null;
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        e.target.value = null;
        return;
      }
      
      setResumeFile(file);
      toast.success('Resume uploaded successfully');
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = null;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Upload Your Resume <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {!resumeFile ? (
            <>
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <p className="text-xs text-gray-500 mt-1">PDF only (Max 5MB)</p>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          We'll analyze your resume to generate relevant interview questions
        </p>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default ResumeUploadForm;