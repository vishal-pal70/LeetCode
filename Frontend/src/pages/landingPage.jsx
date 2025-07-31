// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Code, Trophy, ChevronRight, Terminal, Zap, Shield, Cpu, Sparkles, User, Lock } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    problems: 0,
    submissions: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        users: 1250000,
        problems: 2500,
        submissions: 95000000
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation
  const handleSignIn = () => navigate('/login');
  const handleSignUp = () => navigate('/signup');

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-orange-300" />,
      title: "Lightning Fast Execution",
      description: "Optimized environment for running your code at maximum speed"
    },
    {
      icon: <Cpu className="w-6 h-6 text-orange-300" />,
      title: "AI-Powered Assistance",
      description: "Get intelligent hints and solutions when you're stuck"
    },
    {
      icon: <Shield className="w-6 h-6 text-orange-300" />,
      title: "Secure Environment",
      description: "Protect your code with industry-standard security measures"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-orange-300" />,
      title: "Personalized Learning",
      description: "Adaptive challenges tailored to your skill level"
    }
  ];

  const problemTypes = [
    {
      title: "Data Structures",
      count: 450,
      difficulty: "Beginner to Advanced",
      bg: "from-gray-800/50 to-gray-900/50"
    },
    {
      title: "Algorithms",
      count: 600,
      difficulty: "All Levels",
      bg: "from-gray-800/50 to-gray-900/50"
    },
    {
      title: "Database",
      count: 180,
      difficulty: "Intermediate",
      bg: "from-gray-800/50 to-gray-900/50"
    },
    {
      title: "System Design",
      count: 120,
      difficulty: "Advanced",
      bg: "from-gray-800/50 to-gray-900/50"
    }
  ];

  const companies = [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", 
    "Netflix", "Adobe", "Oracle", "Uber", "Twitter",
    "Airbnb", "Spotify", "Tesla", "Salesforce", "Stripe"
  ];

  const testimonials = [
    {
      name: "Alex Morgan",
      role: "Software Engineer, Google",
      content: "CodeNexus helped me land my dream job at Google. The challenges perfectly mimic real interview questions.",
      avatar: "bg-gradient-to-br from-orange-400 to-amber-500"
    },
    {
      name: "Samantha Chen",
      role: "Frontend Developer, Netflix",
      content: "The learning paths are incredibly well-structured. I went from beginner to confident in just 3 months!",
      avatar: "bg-gradient-to-br from-blue-400 to-cyan-500"
    },
    {
      name: "James Rodriguez",
      role: "Backend Engineer, Stripe",
      content: "The community support and detailed solutions helped me understand complex algorithms much faster.",
      avatar: "bg-gradient-to-br from-gray-400 to-slate-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 overflow-x-hidden font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <Terminal className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
              CodeNexus
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-orange-300 transition-all duration-300 font-medium">Features</a>
            <a href="#problems" className="text-gray-300 hover:text-orange-300 transition-all duration-300 font-medium">Problems</a>
            <a href="#companies" className="text-gray-300 hover:text-orange-300 transition-all duration-300 font-medium">Companies</a>
            <a href="#testimonials" className="text-gray-300 hover:text-orange-300 transition-all duration-300 font-medium">Testimonials</a>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <button 
              onClick={handleSignIn}
              className="px-5 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 font-medium rounded-lg flex items-center cursor-pointer"
            >
              <Lock className="w-4 h-4 mr-2" /> Sign In
            </button>
            <button 
              onClick={handleSignUp}
              className="px-5 py-2.5 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg transition-all duration-300 font-medium shadow-lg shadow-orange-500/20 flex items-center group cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" /> 
              <span>Sign Up</span>
              <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[20%] w-80 h-80 bg-orange-500 rounded-full filter blur-[100px] opacity-10"></div>
          <div className="absolute bottom-10 right-[20%] w-72 h-72 bg-amber-500 rounded-full filter blur-[90px] opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="block text-gray-200">Master the Art of</span>
              <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                Coding Interviews
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg text-gray-400 mb-8 max-w-lg"
            >
              Prepare for technical interviews with challenges, contests, and company-specific questions. 
              Join our community of developers improving their skills daily.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={handleSignUp}
                className="px-6 py-3.5 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-lg font-medium transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center group"
              >
                <span>Start Practicing</span>
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3.5 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/30 text-gray-300 rounded-lg text-lg font-medium transition-all duration-300 flex items-center"
              onClick={handleSignUp} >
                <Code className="mr-2 w-5 h-5" /> Explore Challenges
              </button>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl max-w-md w-full hover:shadow-2xl hover:border-orange-500/30 transition-all duration-500"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-700 mb-4 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium text-orange-300">Problem #215</div>
                  <div className="text-xs px-3 py-1 bg-emerald-900/30 text-emerald-300 rounded-full border border-emerald-800">Easy</div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-200">Two Sum</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Given an array of integers, return indices of the two numbers such that they add up to a specific target.
                </p>
                <div className="flex space-x-2">
                  <div className="text-xs px-3 py-1.5 bg-orange-900/30 text-orange-300 rounded-full border border-orange-800">Array</div>
                  <div className="text-xs px-3 py-1.5 bg-blue-900/30 text-blue-300 rounded-full border border-blue-800">Hash Table</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-orange-300 font-medium flex items-center group">
                  <span>Over 2.5M submissions</span>
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-xs text-gray-500">Acceptance: 45.6%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-gray-800 to-gray-900 border-y border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                {stats.problems > 0 ? stats.problems.toLocaleString() : "0"}
              </div>
              <p className="text-gray-400 mt-2">Coding Problems</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                {stats.users > 0 ? (stats.users / 1000).toFixed(0) + "K+" : "0"}
              </div>
              <p className="text-gray-400 mt-2">Active Developers</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                {stats.submissions > 0 ? (stats.submissions / 1000000).toFixed(0) + "M+" : "0"}
              </div>
              <p className="text-gray-400 mt-2">Code Submissions</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-200"
            >
              Why <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">CodeNexus</span> Stands Out
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Advanced features designed to accelerate your coding journey
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl hover:border-orange-500/30 transition-all duration-500"
              >
                <div className="mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-200">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Types Section */}
      <section id="problems" className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-200"
            >
              Comprehensive <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">Problem Library</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Covering all essential topics for technical interviews
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problemTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-gradient-to-br ${type.bg} p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl hover:border-orange-500/30 transition-all duration-500`}
              >
                <h3 className="text-xl font-bold mb-3 text-gray-200">{type.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-orange-300 font-medium">{type.count} problems</span>
                  <span className="text-xs px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full">{type.difficulty}</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(90, 70 + index * 10)}%` }}
                  ></div>
                </div>
                <button className="mt-4 text-sm text-orange-300 hover:text-orange-200 font-medium flex items-center group">
                  Explore Problems 
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-200"
            >
              Prepare for <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">Top Tech Companies</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Company-specific question banks curated by industry experts
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 flex items-center justify-center h-20 hover:shadow-lg hover:border-orange-500/30 transition-all duration-500 group"
              >
                <span className="font-medium text-gray-200 group-hover:text-orange-300 transition-colors duration-300">{company}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-200"
            >
              Success <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">Stories</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Hear from developers who transformed their careers
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-orange-500/30 transition-all duration-500"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatar}`}></div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-200">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-orange-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-200"
          >
            Ready to <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">Transform</span> Your Career?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Join thousands of developers who've accelerated their careers with CodeNexus
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <button 
              onClick={handleSignUp}
              className="px-8 py-4 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-lg font-medium transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center mx-auto group cursor-pointer"
            >
              <span>Start Your Free Trial</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 border-t border-gray-800 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Terminal className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                  CodeNexus
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-xs">
                The ultimate platform for mastering coding interviews and technical skills.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-orange-300 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-orange-300 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-orange-300 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-200 text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Problems</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Contests</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Discuss</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Interview Prep</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-200 text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Articles</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Learning Paths</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-200 text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-300 transition-all duration-300">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CodeNexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;