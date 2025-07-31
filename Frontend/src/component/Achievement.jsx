import { motion } from 'framer-motion';
import { Trophy, Star, Award, Medal, Zap, CheckCircle, ChevronLeft, Lightbulb, LayoutDashboard, BookAIcon, BookOpenIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

function Achievement() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    setTimeout(() => {
      setAchievements([
        {
          id: 1,
          title: "Code Novice",
          description: "Solve your first coding problem",
          icon: <Star size={24} />,
          progress: 100,
          unlocked: true,
          unlockDate: "2023-10-15",
          color: "from-blue-500 to-indigo-600"
        },
        {
          id: 2,
          title: "Problem Solver",
          description: "Solve 10 coding problems",
          icon: <Award size={24} />,
          progress: 80,
          unlocked: false,
          required: 10,
          current: 8,
          color: "from-purple-500 to-fuchsia-600"
        },
        {
          id: 3,
          title: "Algorithm Master",
          description: "Solve 5 medium difficulty problems",
          icon: <Medal size={24} />,
          progress: 60,
          unlocked: false,
          required: 5,
          current: 3,
          color: "from-amber-500 to-orange-600"
        },
        {
          id: 4,
          title: "Speed Coder",
          description: "Solve a problem in under 30 minutes",
          icon: <Zap size={24} />,
          progress: 40,
          unlocked: false,
          required: 1,
          current: 0,
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 5,
          title: "Consistent Learner",
          description: "Solve problems for 7 consecutive days",
          icon: <CheckCircle size={24} />,
          progress: 20,
          unlocked: false,
          required: 7,
          current: 2,
          color: "from-rose-500 to-pink-600"
        },
        {
          id: 6,
          title: "Challenge Conqueror",
          description: "Complete a weekly challenge",
          icon: <Trophy size={24} />,
          progress: 0,
          unlocked: false,
          required: 1,
          current: 0,
          color: "from-cyan-500 to-blue-600"
        }
      ]);
      
      setUserProgress({
        totalAchievements: 15,
        unlocked: 4,
        progress: 27,
        streak: 3
      });
      
      setLoading(false);
    }, 800);
  }, []);

  const handleBack = () => {
    navigate('/');
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
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
        </motion.header>

     
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
              <Zap className="h-4 w-4 text-yellow-400" />
              <Zap className="h-4 w-4 text-yellow-400" />
              <Zap className="h-4 w-4 text-yellow-400" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={loading ? "hidden" : "show"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            [...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 h-64 animate-pulse"
              >
                <div className="bg-gray-700 rounded-full w-12 h-12 mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
                <div className="h-2 bg-gray-700 rounded-full w-full mt-4"></div>
              </motion.div>
            ))
          ) : (
            achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={cardVariants}
                whileHover="hover"
                animate="visible"
                initial="hidden"
                className={`bg-gradient-to-br ${achievement.color} rounded-xl overflow-hidden shadow-xl border border-gray-700/50`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                      {achievement.icon}
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
                        <span>{achievement.current || 0}/{achievement.required}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full" 
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
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
            ))
          )}
        </motion.div>

        {!loading && achievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Trophy className="h-20 w-20 mx-auto text-orange-500 mb-4" />
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              No Achievements Yet
            </h3>
            <p className="text-gray-400 mt-4 max-w-md mx-auto">
              Start solving coding challenges to unlock your first achievement. The more you code, the more achievements you'll earn!
            </p>
            <button 
              onClick={() => navigate('/problems')}
              className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-6 rounded-lg shadow-lg transition-all"
            >
              Start Coding
            </button>
          </motion.div>
        )}

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
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">Bronze</div>
              <div className="text-lg font-bold">2/5</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">Silver</div>
              <div className="text-lg font-bold">1/5</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">Gold</div>
              <div className="text-lg font-bold">0/5</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Achievement;