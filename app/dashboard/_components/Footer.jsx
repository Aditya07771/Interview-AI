import React from "react";
import { Bot, CopyrightIcon, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <>
    <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  MockMate AI
                </span>
              </div>
              <p className="text-gray-600">
                AI-powered interview preparation for the next generation of professionals.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Dashboard", "API"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"]
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Privacy", "Terms"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold mb-4 text-gray-900">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">© 2025 MockMate AI. </p>
            <div className="flex gap-6">
              {["GitHub", "LinkedIn", "Twitter"].map((platform) => (
                <a
                  key={platform}
                  href="https://github.com/Aditya07771/Interview-AI"
                  className="text-gray-600 hover:text-violet-600 transition-colors font-medium"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    
    </>
    
  );
};

export default Footer;
