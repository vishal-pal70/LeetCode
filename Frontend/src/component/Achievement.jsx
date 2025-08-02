import { motion } from 'framer-motion';
import { Trophy, Star, Award, Medal, Zap, CheckCircle, ChevronLeft, Lightbulb, LayoutDashboard, BookOpenIcon, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import React from 'react';

// Icon mapping to resolve icon names to components
const iconComponents = {
  trophy: Trophy,
  star: Star,
  award: Award,
  medal: Medal,
  zap: Zap,
  checkCircle: CheckCircle
};

function Achievement() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [activeTask, setActiveTask] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Initialize achievements
  useEffect(() => {
    const storedAchievements = localStorage.getItem('achievements');
    const storedProgress = localStorage.getItem('userProgress');
    
    if (storedAchievements && storedProgress) {
      setAchievements(JSON.parse(storedAchievements));
      setUserProgress(JSON.parse(storedProgress));
    } else {
      const initialAchievements = [
        {
          id: 1,
          title: "Code Novice",
          description: "Solve your first coding problem",
          iconName: "star",
          progress: 0,
          unlocked: false,
          required: 1,
          current: 0,
          color: "from-blue-500 to-indigo-600",
          type: "bronze",
          xp: 50,
          problemType: "any"
        },
        {
          id: 2,
          title: "Problem Solver",
          description: "Solve 10 coding problems",
          iconName: "award",
          progress: 0,
          unlocked: false,
          required: 10,
          current: 0,
          color: "from-purple-500 to-fuchsia-600",
          type: "silver",
          xp: 150,
          problemType: "any"
        },
        {
          id: 3,
          title: "Algorithm Master",
          description: "Solve 5 medium difficulty problems",
          iconName: "medal",
          progress: 0,
          unlocked: false,
          required: 5,
          current: 0,
          color: "from-amber-500 to-orange-600",
          type: "silver",
          xp: 200,
          problemType: "medium"
        },
        {
          id: 4,
          title: "Speed Coder",
          description: "Solve a problem in under 30 minutes",
          iconName: "zap",
          progress: 0,
          unlocked: false,
          required: 1,
          current: 0,
          color: "from-green-500 to-emerald-600",
          type: "bronze",
          xp: 100,
          problemType: "any"
        },
        {
          id: 5,
          title: "Consistent Learner",
          description: "Solve problems for 7 consecutive days",
          iconName: "checkCircle",
          progress: 0,
          unlocked: false,
          required: 7,
          current: 0,
          color: "from-rose-500 to-pink-600",
          type: "gold",
          xp: 250,
          problemType: "any"
        },
        {
          id: 6,
          title: "Challenge Conqueror",
          description: "Complete a weekly challenge",
          iconName: "trophy",
          progress: 0,
          unlocked: false,
          required: 1,
          current: 0,
          color: "from-cyan-500 to-blue-600",
          type: "gold",
          xp: 300,
          problemType: "hard"
        }
      ];
      
      const initialProgress = {
        totalAchievements: initialAchievements.length,
        unlocked: 0,
        progress: 0,
        streak: 0,
        totalXP: 0,
        level: 1,
        bronze: 0,
        silver: 0,
        gold: 0
      };
      
      setAchievements(initialAchievements);
      setUserProgress(initialProgress);
      
      // Save to localStorage
      localStorage.setItem('achievements', JSON.stringify(initialAchievements));
      localStorage.setItem('userProgress', JSON.stringify(initialProgress));
    }
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const startTask = async (achievement) => {
    if (achievement.unlocked) return;
    
    setActiveTask(achievement);
    setLoadingProblems(true);
    setShowProblemModal(true);
    
    try {
      // Fetch problems based on achievement requirements
      const response = await axiosClient.get('/problem/getAllProblem');
      const allProblems = response.data.map(problem => ({
        ...problem,
        tags: Array.isArray(problem.tags) ? problem.tags : 
              problem.tags ? [problem.tags] : []
      }));
      
      // Filter problems based on achievement type
      let filteredProblems = [];
      
      if (achievement.problemType === 'any') {
        filteredProblems = allProblems;
      } else if (achievement.problemType === 'medium') {
        filteredProblems = allProblems.filter(p => p.difficulty === 'medium');
      } else if (achievement.problemType === 'hard') {
        filteredProblems = allProblems.filter(p => p.difficulty === 'hard');
      } else {
        filteredProblems = allProblems;
      }
      
      // Limit to the number of problems needed
      const neededProblems = achievement.required - achievement.current;
      filteredProblems = filteredProblems.slice(0, neededProblems);
      
      setProblems(filteredProblems);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoadingProblems(false);
    }
  };

  const completeProblem = (problemId) => {
    // Update the active task progress
    const updatedAchievements = achievements.map(a => {
      if (a.id === activeTask.id) {
        const newCurrent = a.current + 1;
        const newProgress = Math.min(100, (newCurrent / a.required) * 100);
        const unlocked = newCurrent >= a.required;
        
        const updated = {
          ...a,
          current: newCurrent,
          progress: newProgress,
          unlocked: unlocked,
          unlockDate: unlocked ? new Date().toLocaleDateString() : a.unlockDate
        };
        
        return updated;
      }
      return a;
    });
    
    // Update user progress if achievement is completed
    const unlockedAchievement = updatedAchievements.find(a => 
      a.id === activeTask.id && a.unlocked
    );
    
    if (unlockedAchievement) {
      // Update user progress
      const unlockedCount = updatedAchievements.filter(a => a.unlocked).length;
      const progressPercentage = Math.round((unlockedCount / updatedAchievements.length) * 100);
      
      // Update type counts
      const bronze = updatedAchievements.filter(a => a.type === 'bronze' && a.unlocked).length;
      const silver = updatedAchievements.filter(a => a.type === 'silver' && a.unlocked).length;
      const gold = updatedAchievements.filter(a => a.type === 'gold' && a.unlocked).length;
      
      const newProgress = {
        ...userProgress,
        unlocked: unlockedCount,
        progress: progressPercentage,
        totalXP: userProgress.totalXP + unlockedAchievement.xp,
        bronze,
        silver,
        gold
      };
      
      // Level up logic
      if (newProgress.totalXP >= newProgress.level * 500) {
        newProgress.level += 1;
      }
      
      setUserProgress(newProgress);
      setShowCompletion(true);
      
      // Save to localStorage
      localStorage.setItem('userProgress', JSON.stringify(newProgress));
      
      // Auto-close completion message
      setTimeout(() => setShowCompletion(false), 3000);
    }
    
    setAchievements(updatedAchievements);
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    
    // Remove completed problem
    setProblems(prev => prev.filter(p => p.id !== problemId));
    
    // Close modal if all problems are solved
    if (problems.length === 1) {
      setShowProblemModal(false);
    }
  };

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
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.4,
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
      {/* Sidebar */}
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
          <Trophy className="text-orange-500 h-8 w-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Achievement Hub
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
          <NavLink to="/achievements" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow">
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
          </NavLink>
          <NavLink to="/study-plan" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <BookOpenIcon className="h-5 w-5" />
            <span>Study Plan</span>
          </NavLink>
        </nav>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-auto"
        >
          <button 
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 hover:from-gray-700 hover:to-gray-800 flex items-center justify-center shadow-md hover:shadow-gray-800/30 transition-all py-2 rounded-lg"
          >
            <span className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Logout
            </span>
          </button>
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
            <button 
              onClick={handleBack}
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 py-2 px-4 rounded-lg flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <div>
              <p className="text-sm text-gray-400">Pages / Achievements</p>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                Your Coding Achievements
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-400">Level {userProgress.level || 1}</div>
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-amber-400 mr-1" />
                <span className="font-bold">{userProgress.totalXP || 0} XP</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-5 shadow-lg"
          >
            <div className="text-3xl font-bold">{userProgress.unlocked || 0}</div>
            <div className="text-sm opacity-80">Achievements Unlocked</div>
            <div className="mt-2 h-1 bg-orange-400/30 rounded-full">
              <div 
                className="h-1 bg-white rounded-full" 
                style={{ width: `${userProgress.progress || 0}%` }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-500 to-fuchsia-700 rounded-xl p-5 shadow-lg"
          >
            <div className="text-3xl font-bold">{userProgress.totalAchievements || 0}</div>
            <div className="text-sm opacity-80">Total Achievements</div>
            <div className="mt-2 flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-purple-300 rounded-full opacity-50"></div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl p-5 shadow-lg"
          >
            <div className="text-3xl font-bold">{userProgress.progress || 0}%</div>
            <div className="text-sm opacity-80">Completion Rate</div>
            <div className="mt-2 text-xs">
              {userProgress.unlocked || 0} of {userProgress.totalAchievements || 0} completed
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl p-5 shadow-lg"
          >
            <div className="text-3xl font-bold">{userProgress.streak || 0} days</div>
            <div className="text-sm opacity-80">Current Streak</div>
            <div className="mt-2 flex">
              {[...Array(Math.min(userProgress.streak || 0, 5))].map((_, i) => (
                <Zap key={i} className="h-4 w-4 text-yellow-400" />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievements.map((achievement) => {
            const IconComponent = iconComponents[achievement.iconName] || Star;
            
            return (
              <motion.div
                key={achievement.id}
                variants={cardVariants}
                whileHover="hover"
                animate="visible"
                initial="hidden"
                className={`bg-gradient-to-br ${achievement.color} rounded-xl overflow-hidden shadow-xl border border-gray-700/50 relative cursor-pointer ${achievement.unlocked ? '' : 'hover:opacity-90'}`}
                onClick={() => !achievement.unlocked && startTask(achievement)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                      <IconComponent size={24} />
                    </div>
                    {achievement.unlocked ? (
                      <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Unlocked
                      </div>
                    ) : (
                      <div className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs">
                        Locked
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mt-4">{achievement.title}</h3>
                  <p className="text-gray-200 mt-2 text-sm">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <div className="mt-4 text-xs text-gray-300">
                      Unlocked on {achievement.unlockDate}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.current}/{achievement.required}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full" 
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs flex justify-between">
                        <span className="flex items-center">
                          <Trophy className="h-3 w-3 mr-1 text-amber-400" />
                          {achievement.xp} XP
                        </span>
                        <span className="capitalize">{achievement.type}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {achievement.unlocked && (
                  <div className="bg-black/20 p-3 text-center text-xs text-gray-300 border-t border-gray-700/30">
                    You earned this achievement!
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Problem Solving Modal */}
        {showProblemModal && activeTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl"
            >
              <div className="p-6 relative">
                <button 
                  onClick={() => setShowProblemModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm mr-4">
                    {activeTask.iconName && iconComponents[activeTask.iconName] ? 
                      React.createElement(iconComponents[activeTask.iconName], { size: 24 }) : 
                      <Star size={24} />
                    }
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{activeTask.title}</h3>
                    <p className="text-gray-400 text-sm">{activeTask.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm">
                    Problems to solve: <span className="font-bold">{activeTask.required - activeTask.current}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Trophy className="h-4 w-4 text-amber-400 mr-1" />
                    <span>Reward: {activeTask.xp} XP</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Problems to Complete:</h4>
                  
                  {loadingProblems ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-800/50 p-4 rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : problems.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      No problems found for this achievement
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {problems.map(problem => (
                        <div 
                          key={problem.id} 
                          className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => completeProblem(problem.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{problem.title}</h5>
                              <div className="flex items-center mt-1 text-sm text-gray-400">
                                <span className={`px-2 py-1 rounded mr-2 ${
                                  problem.difficulty === 'easy' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : problem.difficulty === 'medium'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {problem.difficulty}
                                </span>
                                <span className="flex items-center">
                                  {problem.tags?.map(tag => (
                                    <span key={tag} className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs mr-1">
                                      {tag}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            </div>
                            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-lg text-sm">
                              Solve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Solve problems to complete this achievement
                  </div>
                  <button 
                    onClick={() => setShowProblemModal(false)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Completion Toast */}
        {showCompletion && activeTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-300" />
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div>{activeTask.title}</div>
                <div className="text-xs mt-1">+{activeTask.xp} XP</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Achievement Progress
            </h3>
            <div className="text-sm">
              <span className="text-orange-400">{userProgress.unlocked || 0}</span>/
              <span>{userProgress.totalAchievements || 0}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-700/50 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full flex items-center justify-end"
              style={{ width: `${userProgress.progress || 0}%` }}
            >
              <div className="bg-white h-6 w-6 rounded-full flex items-center justify-center shadow-lg -mr-2">
                <Trophy className="h-3 w-3 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg">
              <div className="text-sm">Bronze</div>
              <div className="text-lg font-bold">{userProgress.bronze || 0}/{
                achievements.filter(a => a.type === 'bronze').length
              }</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg">
              <div className="text-sm">Silver</div>
              <div className="text-lg font-bold">{userProgress.silver || 0}/{
                achievements.filter(a => a.type === 'silver').length
              }</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg">
              <div className="text-sm">Gold</div>
              <div className="text-lg font-bold">{userProgress.gold || 0}/{
                achievements.filter(a => a.type === 'gold').length
              }</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Achievement;
