'use client'
import { motion } from 'framer-motion'
import { Sparkles, Target, Users, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Aditya Nishad",
      role: "Team Lead",
      image: "/team/aditya.jpg", // Add your image to public/team/
      description: "Leading the vision and technical architecture"
    },
    {
      name: "Kaushal Patil",
      role: "UI/UX Designer",
      image: "/team/kaushal.jpg",
      description: "Building seamless user experiences"
    },
    {
      name: "Vinaykumar Singh",
      role: "Backend Developer",
      image: "/team/vinaykumar.jpg",
      description: "Powering the AI infrastructure"
    },
    {
      name: "Ravnit Yadav",
      role: "AI Specialist",
      image: "/team/ravnit.jpg",
      description: "Crafting beautiful interfaces"
    }
  ]

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Mission Driven",
      description: "Democratizing interview preparation with AI"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "User First",
      description: "Building tools that truly help candidates succeed"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "Delivering the best AI-powered interview experience"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-medium text-violet-600">Our Story</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Meet the Team Behind MockMate AI
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're a passionate team building the future of interview preparation
        </p>
      </motion.div>

      {/* Team Section */}
      <div className="container mx-auto px-4 max-w-6xl mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="relative p-6 bg-white hover:shadow-2xl transition-all duration-300 border-gray-100 h-full group">
                <div className="text-center">
                 
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-full object-contain group-hover:scale-110 transition-transform "
                  />
                 
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-violet-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-violet-50 to-indigo-50 py-16"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Our Values
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg text-violet-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 max-w-4xl mt-20 text-center"
      >
        <Card className="p-10 bg-white shadow-xl border-gray-100">
          <h2 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Our Mission
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            MockMate AI is revolutionizing interview preparation by making AI-powered coaching accessible to everyone. 
            We believe that with the right preparation and confidence, anyone can ace their dream interview. 
            Our platform combines cutting-edge AI technology with human insight to deliver personalized, 
            effective interview practice that adapts to each user's unique needs and goals.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

export default AboutUsPage