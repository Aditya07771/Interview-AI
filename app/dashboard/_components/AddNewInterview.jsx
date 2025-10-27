//path: app/dashboard/_components/AddNewInterview.jsx

"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Sparkles, Upload, Briefcase } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ResumeUploadForm from "./AddResumeInterview";

// Job Role Suggestions
const JOB_ROLE_SUGGESTIONS = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Cloud Engineer',
  'Mobile App Developer',
  'UI/UX Designer'
];

// Tech Stack Suggestions
const TECH_STACK_SUGGESTIONS = {
  'Full Stack Developer': 'React, Node.js, Express, MongoDB, TypeScript',
  'Frontend Developer': 'React, Vue.js, Angular, TypeScript, Tailwind CSS',
  'Backend Developer': 'Python, Django, Flask, Java Spring, PostgreSQL',
  'Software Engineer': 'Java, C++, Python, AWS, Microservices',
  'DevOps Engineer': 'Docker, Kubernetes, Jenkins, AWS, Azure',
  'Data Scientist': 'Python, TensorFlow, PyTorch, Pandas, NumPy',
  'Machine Learning Engineer': 'Python, scikit-learn, Keras, TensorFlow',
  'Cloud Engineer': 'AWS, Azure, GCP, Terraform, Kubernetes',
  'Mobile App Developer': 'React Native, Flutter, Swift, Kotlin',
  'UI/UX Designer': 'Figma, Sketch, Adobe XD, InVision'
};

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState("jobDescription");
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // Auto-suggest tech stack based on job role
  const autoSuggestTechStack = (role) => {
    const suggestion = TECH_STACK_SUGGESTIONS[role];
    if (suggestion) {
      setJobDescription(suggestion);
      toast.info(`Auto-filled tech stack for ${role}`);
    } else {
      toast.error("No suggestion available for this role");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on selected option
    if (selectedOption === "resume" && !resumeFile) {
      toast.error('Please upload your resume');
      return;
    }
    
    if (selectedOption === "jobDescription" && (!jobPosition || !jobDescription)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (selectedOption === "resume") {
        // Handle resume upload
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobExperience', jobExperience);
        formData.append('method', 'resume');
        formData.append('userEmail', user?.primaryEmailAddress?.emailAddress || '');
        formData.append('createdAt', moment().format('DD-MM-YYYY'));

        response = await fetch('/api/createInterviewFromResume', {
          method: 'POST',
          body: formData
        });
      } else {
        // Handle job description
        response = await fetch('/api/createInterview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jobPosition,
            jobDescription,
            jobExperience,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-YYYY')
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create interview');
      }

      const data = await response.json();
      
      toast.success('Interview created successfully!');
      setOpenDialog(false);
      resetForm();
      
      router.push(`/dashboard/interview/${data.mockId}`);
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error(error.message || 'Failed to create interview.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJobPosition("");
    setJobDescription("");
    setJobExperience("");
    setResumeFile(null);
    setSelectedOption("jobDescription");
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className="font-bold text-lg text-center">+ Add New</h1>
      </div>
      
      <Dialog open={openDialog} onOpenChange={(open) => {
        setOpenDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Create Your Interview Preparation
            </DialogTitle>
            <DialogDescription>
              Choose how you want to create your interview preparation
            </DialogDescription>
          </DialogHeader>

          {/* Option Selection Cards - Side by Side */}
          <div className="grid grid-cols-2 gap-4 my-4">
            <div
              onClick={() => setSelectedOption("jobDescription")}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === "jobDescription"
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <Briefcase className={`h-12 w-12 ${
                  selectedOption === "jobDescription" ? "text-primary" : "text-gray-400"
                }`} />
                <h3 className="font-semibold text-lg">Job Description</h3>
                <p className="text-sm text-gray-600">
                  Enter job details and tech stack to generate interview questions
                </p>
              </div>
            </div>

            <div
              onClick={() => setSelectedOption("resume")}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === "resume"
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <Upload className={`h-12 w-12 ${
                  selectedOption === "resume" ? "text-primary" : "text-gray-400"
                }`} />
                <h3 className="font-semibold text-lg">Upload Resume</h3>
                <p className="text-sm text-gray-600">
                  Upload your resume to generate personalized interview questions
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Job Description Form */}
            {selectedOption === "jobDescription" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Job Role/Position <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      value={jobPosition}
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                      list="jobRoles"
                    />
                    <datalist id="jobRoles">
                      {JOB_ROLE_SUGGESTIONS.map(role => (
                        <option key={role} value={role} />
                      ))}
                    </datalist>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => autoSuggestTechStack(jobPosition)}
                      disabled={!jobPosition}
                      title="Auto-fill tech stack"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Job Description/Tech Stack <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex. React, Angular, NodeJs, MySql etc"
                    value={jobDescription}
                    required
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            )}

            {/* Resume Upload Form */}
            {selectedOption === "resume" && (
              <ResumeUploadForm 
                resumeFile={resumeFile} 
                setResumeFile={setResumeFile} 
              />
            )}

            {/* Years of Experience - Common for both options */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ex. 5"
                type="number"
                min="0"
                max="50"
                value={jobExperience}
                required
                onChange={(e) => setJobExperience(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter your total years of professional experience
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpenDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                    {selectedOption === "resume" ? "Processing Resume..." : "Generating Questions..."}
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;