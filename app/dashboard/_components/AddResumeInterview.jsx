// app/dashboard/_components/ResumeUploadForm.jsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, X, Info } from "lucide-react";
import { toast } from "sonner";

function ResumeUploadForm({ resumeFile, setResumeFile }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check if file is PDF or DOCX
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];

      if (!validTypes.includes(file.type)) {
        toast.error('Please upload PDF or DOCX file only.');
        e.target.value = null;
        return;
      }
      
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
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
        
        {/* Info Alert */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Supported formats:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>PDF (text-based, not scanned images)</li>
              <li>DOCX (Microsoft Word)</li>
              <li>Maximum size: 10MB</li>
            </ul>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {!resumeFile ? (
            <>
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <p className="text-xs text-gray-500 mt-1">PDF or DOCX (Max 10MB)</p>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,.doc"
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
    </div>
  );
}

export default ResumeUploadForm;