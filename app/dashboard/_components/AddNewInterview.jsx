"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
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
import { LoaderCircle, Sparkles, Upload, Briefcase, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ResumeUploadForm from "./AddResumeInterview";

// Keep all existing constants and logic...
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

  // Keep all existing functions...
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
      let data;
      
      if (selectedOption === "resume") {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobExperience', jobExperience || '0');
        formData.append('userEmail', user?.primaryEmailAddress?.emailAddress || '');
        formData.append('createdAt', moment().format('DD-MM-YYYY'));

        console.log("Uploading resume...", resumeFile.name);

        response = await fetch('/api/createInterviewFromResume', {
          method: 'POST',
          body: formData
        });
      } else {
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

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned invalid response. Please try again.");
      }

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create interview');
      }

      console.log("Interview created:", data);
      
      toast.success('Interview created successfully!');
      setOpenDialog(false);
      resetForm();
      
      router.push(`/dashboard/interview/${data.mockId}`);
      
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error(error.message || 'Failed to create interview. Please try again.');
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
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
        <div className="relative bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold text-xl text-gray-900">Create New Interview</h3>
          <p className="text-gray-500 text-sm mt-2">Start practicing now</p>
        </div>
      </motion.div>
      
      <Dialog open={openDialog} onOpenChange={(open) => {
        setOpenDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Create Your Interview Session
            </DialogTitle>
            <DialogDescription>
              Choose your preferred method to start practicing
            </DialogDescription>
          </DialogHeader>

          {/* Option Selection Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedOption("jobDescription")}
              className={`relative p-6 rounded-xl cursor-pointer transition-all ${
                selectedOption === "jobDescription"
                  ? "bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-500"
                  : "bg-white border-2 border-gray-200 hover:border-violet-300"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-14 h-14 rounded-xl ${
                  selectedOption === "jobDescription" 
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600" 
                    : "bg-gray-100"
                } flex items-center justify-center transition-all`}>
                  <Briefcase className={`h-7 w-7 ${
                    selectedOption === "jobDescription" ? "text-white" : "text-gray-500"
                  }`} />
                </div>
                <h3 className="font-semibold text-lg">Job Description</h3>
                <p className="text-sm text-gray-600">
                  Enter job details and tech stack
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedOption("resume")}
              className={`relative p-6 rounded-xl cursor-pointer transition-all ${
                selectedOption === "resume"
                  ? "bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-500"
                  : "bg-white border-2 border-gray-200 hover:border-violet-300"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-14 h-14 rounded-xl ${
                  selectedOption === "resume" 
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600" 
                    : "bg-gray-100"
                } flex items-center justify-center transition-all`}>
                  <Upload className={`h-7 w-7 ${
                    selectedOption === "resume" ? "text-white" : "text-gray-500"
                  }`} />
                </div>
                <h3 className="font-semibold text-lg">Upload Resume</h3>
                <p className="text-sm text-gray-600">
                  Upload your resume for personalized questions
                </p>
              </div>
            </motion.div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Job Description Form */}
            {selectedOption === "jobDescription" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Job Role/Position <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      value={jobPosition}
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                      list="jobRoles"
                      className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
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
                      className="hover:bg-violet-50"
                    >
                      <Sparkles className="h-4 w-4 text-violet-600" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description/Tech Stack <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex. React, Angular, NodeJs, MySql etc"
                    value={jobDescription}
                    required
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={5}
                    className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
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

            {/* Years of Experience */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
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
                className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
              <p className="text-xs text-gray-500">
                Enter your total years of professional experience
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpenDialog(false);
                  resetForm();
                }}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                    {selectedOption === "resume" ? "Processing..." : "Generating..."}
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