import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  Lightbulb, 
  Trophy, 
  Calendar,
  LogOut,
  ChevronLeft,
  Youtube
} from "lucide-react";
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LearningResources() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);

  const handleBack = () => {
    navigate('/');
  };

  // DSA YouTube videos data with Coder Army videos
  const dsaVideos = [
    // Coder Army videos
     {
      id: 'gGlfzqPT-hE',
      title: 'Sacrifice - But We Are Taking Revenge | DSA Course | Coder Army',
      description: 'Motivational video for DSA learners by Coder Army',
      tags: ['motivation', 'coder army', 'sacrifice', 'dsa']
    },
   {
  "id": "Sxb152a5Am8",
  "title": "Binary Search Algorithm Explained",
  "description": "A detailed explanation of the Binary Search algorithm, including implementation and examples by Coder Army.",
  "tags": ["binary search", "algorithm", "data structures", "coder army"]
},

  {
  "id": "FkaIZAQKmWU",
  "title": "Introductions To STRINGS in C++",
  "description": "A tutorial on string operations in C++ by Coder Army (posted Mon–Fri at 6 AM).",
  "tags": ["C++", "strings", "tutorial", "Coder Army"]
},

  {
  "id": "0Hwpzd-bSck",
  "title": "Binary Search Tree",
  "description": "A tutorial on binary search operations in C++ by Coder Army (posted Mon–Fri at 6 AM)",
  "tags": ["tag1", "tag2", "tag3", "..."]
},

    
    // Original videos
  {
  "id": "_b0bfpO3b4I",
  "title": "Introduction to DSA",
  "description": "In this video, we delve into the fundamentals of Data Structures and Algorithms (DSA), covering key concepts and their importance in programming.",
  "tags": ["DSA", "Data Structures", "Algorithms", "Programming", "Coder Army"]
},

   {
  "id": "9_B6TmAHveU",
  "title": "Linked List in C++ | Introduction and Implementation",
  "description": "In this video, we explore the fundamentals of Linked Lists in C++, covering their structure, types, and how to implement them effectively.",
  "tags": ["Linked List", "C++", "Data Structures", "Programming", "Coder Army"]
},

  {
  "id": "hUdqNPhXOh4",
  "title": "Lecture 18: Time and Space Complexity From Zero To Advance",
  "description": "In this lecture, we delve into the fundamentals of time and space complexity, covering Big O notation and its applications in analyzing algorithms.",
  "tags": ["Time Complexity", "Space Complexity", "Big O Notation", "Algorithm Analysis", "Coder Army"]
},

   {
  "id": "j_n1W5YgN_4",
  "title": "Introduction to Recursion",
  "description": "In this video, we delve into the concept of recursion, explaining its principles and demonstrating its application in solving problems.",
  "tags": ["Recursion", "Programming", "Coder Army"]
},
  {
  "id": "moZNKL37w-s",
  "title": "Introduction To Arrays in C++",
  "description": "Lecture 16: Master Arrays By Solving Problems. This lecture covers the fundamentals of arrays in C++, including their definition, implementation, and practical examples.",
  "tags": ["arrays", "C++", "data structures", "programming", "Coder Army"]
},
   {
  "id": "CE150x4w0bo",
  "title": "Delete Last Node in DLL Step-by-Step | C Data Structures",
  "description": "In this tutorial, we demonstrate how to delete the last node in a Doubly Linked List (DLL) using C programming. Step-by-step explanation with code walkthrough.",
  "tags": ["C programming", "Doubly Linked List", "Data Structures", "DLL", "Coder Army"]
},
   {
  "id": "iw1Xf_33YM0",
  "title": "Introduction to Linked Lists in C++",
  "description": "In this video, we explore the fundamentals of linked lists in C++, covering their structure, types, and how to implement them effectively.",
  "tags": ["Linked Lists", "C++", "Data Structures", "Programming", "Coder Army"]
}
,
   {
  "id": "_kio3U6CV2c",
  "title": "Introduction To Dynamic Programming",
  "description": "This is the first video of Dynamic Programming, starting from the basics to build the foundation and gradually moving to advanced problems.",
  "tags": ["dynamic programming", "algorithm", "coding", "DSA", "Coder Army"]
}

  ];

  const filteredVideos = dsaVideos.filter(video => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(lowerCaseQuery) ||
      video.description.toLowerCase().includes(lowerCaseQuery) ||
      video.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
    );
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Handle different YouTube URL types
  const getYouTubeUrl = (video) => {
    if (video.id.startsWith('PL')) {
      return `https://www.youtube.com/embed/videoseries?list=${video.id}`;
    }
    return `https://www.youtube.com/embed/${video.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex">
      {/* Gradient Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gradient-to-b from-gray-900 to-black shadow-xl p-4 flex flex-col border-r border-gray-800"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2 mb-8"
        >
          <BookOpen className="text-orange-500 h-8 w-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Learning Resources
          </span>
        </motion.div>
        
        <nav className="flex flex-col space-y-2">
          <NavLink to="/" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/problems" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <Lightbulb className="h-5 w-5" />
            <span>Problems</span>
          </NavLink>
          <NavLink to="/learning-resources" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow">
            <Youtube className="h-5 w-5" />
            <span>Learning Resources</span>
          </NavLink>
          <NavLink to="/achievements" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
          </NavLink>
          <NavLink to="/study-plan" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <BookOpen className="h-5 w-5" />
            <span>Study Plan</span>
          </NavLink>
        </nav>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-auto"
        >
          <Button 
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 hover:from-gray-700 hover:to-gray-800 flex items-center justify-center shadow-md hover:shadow-gray-800/30 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 py-4"
        >
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleBack}
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <p className="text-sm text-gray-400">Pages / Learning Resources</p>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                DSA Learning Resources
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search videos..."
              className="w-full max-w-md bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.header>

        {/* Videos Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVideos.length > 0 ? (
              filteredVideos.map(video => (
                <motion.div 
                  key={video.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-xl"
                >
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <iframe
                      src={getYouTubeUrl(video)}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{video.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-1 bg-gray-700/50 rounded-full border border-gray-600 text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <div className="mx-auto bg-gray-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Youtube className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                  No Videos Found
                </h3>
                <p className="text-gray-400 mt-2">
                  Try different search keywords
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Learning Path Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Recommended Learning Path
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange-500 rounded-full p-2 mr-4">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Data Structures Fundamentals</h3>
                <p className="text-sm text-gray-400">Arrays, Linked Lists, Stacks, Queues, Hash Tables</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-500 rounded-full p-2 mr-4">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Algorithms Part 1</h3>
                <p className="text-sm text-gray-400">Sorting, Searching, Recursion, Complexity Analysis</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-500 rounded-full p-2 mr-4">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Algorithms Part 2</h3>
                <p className="text-sm text-gray-400">Trees, Graphs, Dynamic Programming, Greedy Algorithms</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-500 rounded-full p-2 mr-4">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold">Problem Solving Patterns</h3>
                <p className="text-sm text-gray-400">Two Pointers, Sliding Window, BFS/DFS, Backtracking</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default LearningResources;