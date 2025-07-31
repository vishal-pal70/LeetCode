import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import profile from '../assets/profile2.jpg';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, BookOpen, CheckCircle, LogOut, User, CreditCard, Rocket, Lightbulb, Trophy, Calendar } from "lucide-react";
import { motion } from 'framer-motion';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemsRes, solvedRes] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          user ? axiosClient.get('/problem/problemSolvedByUser') : Promise.resolve({ data: [] })
        ]);

        setProblems(problemsRes.data);
        setSolvedProblems(solvedRes.data || []);

        const solvedIds = solvedRes.data ? solvedRes.data.map(p => p._id) : [];
        const solvedCount = problemsRes.data.filter(p => solvedIds.includes(p._id)).length;

  

        setStats({
          total: problemsRes.data.length,
          solved: solvedCount,
          easy: problemsRes.data.filter(p => p.difficulty === 'easy').length,
          medium: problemsRes.data.filter(p => p.difficulty === 'medium').length,
          hard: problemsRes.data.filter(p => p.difficulty === 'hard').length,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    navigate('/login');
  };

  const filteredProblems = problems.filter(problem => {
    // Ensure tags is always an array
    const tags = Array.isArray(problem.tags) ? problem.tags : [];
    
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || tags.some(t => filters.tag.includes(t));
    const statusMatch = filters.status === 'all' ||
      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id)) ||
      (filters.status === 'unsolved' && !solvedProblems.some(sp => sp._id === problem._id));

    // Fixed search functionality
    const searchMatch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'hard': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

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

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
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
            Problem Dashboard
          </span>
        </motion.div>
        
        <nav className="flex flex-col space-y-2">
          <NavLink to="/" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/problems" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
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
            onClick={handleLogout} 
            className="w-full mt-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 hover:from-gray-700 hover:to-gray-800 flex items-center justify-center shadow-md hover:shadow-gray-800/30 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <p className="text-sm text-gray-400">Pages / Dashboard</p>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Coding Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search problems..."
              className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Gradient Cards */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <BookOpen className="text-white h-6 w-6" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Total Problems</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <CheckCircle className="text-white h-6 w-6" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Solved Problems</p>
                    <p className="text-3xl font-bold">{stats.solved}</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <CreditCard className="text-white h-6 w-6" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Easy Problems</p>
                    <p className="text-3xl font-bold">{stats.easy}</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Rocket className="text-white h-6 w-6" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Medium Problems</p>
                    <p className="text-3xl font-bold">{stats.medium}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Problems List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                    Problems
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    Showing {Math.min(filteredProblems.length, 5)} of {filteredProblems.length} problems
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
                      Array.from({ length: 5 }).map((_, i) => (
                        <motion.div 
                          key={i} 
                          variants={itemVariants}
                          className="flex items-center justify-between p-4 border border-gray-700 rounded-lg"
                        >
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-32"></div>
                            <div className="h-3 bg-gray-700 rounded w-48"></div>
                          </div>
                          <div className="h-6 bg-gray-700 rounded w-16"></div>
                        </motion.div>
                      ))
                    ) : filteredProblems.length > 0 ? (
                      filteredProblems.slice(0, 5).map(problem => (
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
                            <h3 className="font-bold">{problem.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {/* Tags display */}
                            </div>
                          </div>
                          <Badge className={`px-3 py-1 ${getDifficultyBadgeColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </Badge>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-gray-400">No problems found matching your criteria</p>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* User Section (Right Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                    User Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mb-4 cursor-pointer"
                    >
                      <div className="relative">
                        <img 
                          src={profile} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-transparent"></div>
                      </div>
                    </motion.div>
                    <h3 className="text-lg font-bold">
                      {user ? `Welcome, ${user.firstName || 'User'}` : 'Welcome, Guest!'}
                    </h3>
                    <p className="text-gray-400 mt-2">
                      {user ? `You've solved ${stats.solved} problems so far!` : 'Sign in to track your progress'}
                    </p>
                    
                    {user && (
                      <div className="w-full mt-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round((stats.solved / stats.total) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(stats.solved / stats.total) * 100} 
                          className="h-2 bg-gray-700"
                          indicatorColor="bg-gradient-to-r from-orange-500 to-orange-600"
                        />
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">{stats.easy}</div>
                            <div className="text-xs text-green-400">Easy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{stats.medium}</div>
                            <div className="text-xs text-yellow-400">Medium</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{stats.hard}</div>
                            <div className="text-xs text-red-400">Hard</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Solved Problems Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                    Recently Solved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {solvedProblems.length > 0 ? (
                      solvedProblems.slice(0, 3).map((problem, index) => (
                        <motion.div 
                          key={problem._id} 
                          variants={itemVariants}
                          className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/30 backdrop-blur-sm"
                          whileHover={{ x: 5 }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{problem.title}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(problem.solvedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        {user ? "You haven't solved any problems yet" : "Sign in to see solved problems"}
                      </p>
                    )}
                  </motion.div>
                  {solvedProblems.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 border-gray-600"
                      onClick={() => navigate('/solved')}
                    >
                      View All Solved
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;