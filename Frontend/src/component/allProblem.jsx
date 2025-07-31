import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  Rocket, 
  Lightbulb, 
  Trophy, 
  Calendar,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { useSelector } from 'react-redux';

function AllProblems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all'
  });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/problem/getAllProblem');
        const normalizedProblems = response.data.map(problem => ({
          ...problem,
          tags: Array.isArray(problem.tags) ? problem.tags : 
                problem.tags ? [problem.tags] : []
        }));
        setProblems(normalizedProblems);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'hard': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    const titleMatch = problem.title.toLowerCase().includes(lowerCaseQuery);
    const tagsMatch = problem.tags.some(tag => 
      tag.toLowerCase().includes(lowerCaseQuery)
    );
    
    return difficultyMatch && (titleMatch || tagsMatch);
  });

 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex">
  
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
            Problem Dashboard
          </span>
        </motion.div>
        
        <nav className="flex flex-col space-y-2">
          <NavLink to="/" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/problems" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow">
            <Lightbulb className="h-5 w-5" />
            <span>Problems</span>
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
              <p className="text-sm text-gray-400">Pages / Problems</p>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                All Coding Problems
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search problems..."
              className="w-full max-w-md bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.header>

        {/* Difficulty Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex space-x-4"
        >
          <Button 
            className={`px-4 py-2 rounded-lg transition-all ${
              filters.difficulty === 'all' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setFilters({...filters, difficulty: 'all'})}
          >
            All Problems
          </Button>
          <Button 
            className={`px-4 py-2 rounded-lg transition-all ${
              filters.difficulty === 'easy' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setFilters({...filters, difficulty: 'easy'})}
          >
            Easy
          </Button>
          <Button 
            className={`px-4 py-2 rounded-lg transition-all ${
              filters.difficulty === 'medium' 
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setFilters({...filters, difficulty: 'medium'})}
          >
            Medium
          </Button>
          <Button 
            className={`px-4 py-2 rounded-lg transition-all ${
              filters.difficulty === 'hard' 
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setFilters({...filters, difficulty: 'hard'})}
          >
            Hard
          </Button>
        </motion.div>

        {/* Problems List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                Coding Problems
              </CardTitle>
              <p className="text-sm text-gray-400">
                {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
              </p>
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg"
                    >
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-48"></div>
                        <div className="h-3 bg-gray-700 rounded w-64"></div>
                      </div>
                      <div className="h-6 bg-gray-700 rounded w-20"></div>
                    </motion.div>
                  ))
                ) : filteredProblems.length > 0 ? (
                  filteredProblems.map(problem => (
                    <motion.div 
                      key={problem._id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.02,
                        background: "linear-gradient(to right, rgba(55, 65, 81, 0.7), rgba(17, 24, 39, 0.7))",
                        borderColor: "rgba(249, 115, 22, 0.5)"
                      }}
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg cursor-pointer bg-gray-800/50 backdrop-blur-sm"
                      onClick={() => navigate(`/problem/${problem._id}`)}
                    >
                      <div>
                        <h3 className="font-bold text-lg">{problem.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{problem.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {problem.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="outline"
                              className="text-xs px-2 py-1 bg-gray-700/50 border-gray-600 text-gray-200 backdrop-blur-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className={`px-3 py-1 text-sm ${getDifficultyBadgeColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="text-center py-12"
                  >
                    <Rocket className="h-16 w-16 mx-auto text-orange-500" />
                    <h3 className="text-xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                      No Problems Found
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default AllProblems;