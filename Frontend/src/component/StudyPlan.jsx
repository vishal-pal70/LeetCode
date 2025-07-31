import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Target, 
  ChevronLeft,
  BarChart,
  Bookmark,
  Flag,
  BookText,
  Library,
  NotebookPen,
  X,
  LayoutDashboard,
  Lightbulb, 
  Trophy
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useState, useMemo, useEffect } from 'react';
import axiosClient from '@/utils/axiosClient';

function StudyPlan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [studyPlans, setStudyPlans] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(null);


  const presetTemplates = {
    goals: {
      title: "Achieve Learning Goals",
      description: "Plan to reach your specific learning objectives",
      duration: "4 weeks",
      level: "Beginner",
      topics: "Goal 1, Goal 2, Goal 3, Goal 4",
      color: "from-blue-500 to-indigo-600"
    },
    timeline: {
      title: "Personalized Timeline",
      description: "Structured plan to complete within the set timeframe",
      duration: "8 weeks",
      level: "Intermediate",
      topics: "Milestone 1, Milestone 2, Milestone 3, Milestone 4",
      color: "from-purple-500 to-fuchsia-600"
    },
    progress: {
      title: "Progress Tracking",
      description: "Monitor your progress through key milestones",
      duration: "12 weeks",
      level: "Advanced",
      topics: "Checkpoint 1, Checkpoint 2, Checkpoint 3, Checkpoint 4",
      color: "from-amber-500 to-orange-600"
    }
  };

 
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosClient.get('/study/allplans');
        setStudyPlans(response.data.data);
      } catch (error) {
        console.error("Failed to fetch study plans:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);


  const getProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completedTopics = topics.filter(t => t.completed).length;
    return Math.round((completedTopics / topics.length) * 100);
  };
  
  const handleToggleTopic = async (planId, topicIndex) => {
    try {
      // Find the plan to update
      const planToUpdate = studyPlans.find(plan => plan.id === planId);
      if (!planToUpdate) return;
      
      // Toggle the topic status
      const updatedTopics = [...planToUpdate.topics];
      updatedTopics[topicIndex] = {
        ...updatedTopics[topicIndex],
        completed: !updatedTopics[topicIndex].completed
      };
      
      // Update the plan on the backend
      const response = await axiosClient.put(`/study/plan/${planId}`, {
        topics: updatedTopics
      });
      
      // Update the local state with the new data
      setStudyPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === planId ? response.data.data : plan
        )
      );
    } catch (error) {
      console.error("Failed to update topic:", error);
    }
  };

  const handleBack = () => navigate('/');
  const togglePlan = (id) => setExpandedPlan(expandedPlan === id ? null : id);

  const handleCreateNewPlan = async (newPlanData) => {
    try {
      // Transform topics string to array of objects
      const topicsArray = newPlanData.topics.split(',').map(topic => ({
        name: topic.trim(),
        completed: false
      }));
      
     
      const planData = {
        title: newPlanData.title,
        description: newPlanData.description,
        duration: newPlanData.duration,
        level: newPlanData.level,
        topics: topicsArray,
        color: newPlanData.color 
      };
      
      // Create the plan on the backend
      const response = await axiosClient.post('/study/plan', planData);
      
      // Add the new plan to the local state
      setStudyPlans(prevPlans => [response.data.data, ...prevPlans]);
      
      // Close the modal
      setCreateModalOpen(false);
      setSelectedPreset(null);
    } catch (error) {
      console.error("Failed to create new plan:", error);
    }
  };

  const filteredPlans = useMemo(() => {
    const plansWithProgress = studyPlans.map(plan => ({
      ...plan,
      progress: getProgress(plan.topics)
    }));

    if (activeTab === 'all') return plansWithProgress;
    return plansWithProgress.filter(plan => plan.level.toLowerCase() === activeTab);
  }, [studyPlans, activeTab]);

  const totalPlans = studyPlans.length;
  const averageProgress = useMemo(() => {
    if (studyPlans.length === 0) return 0;
    const total = studyPlans.reduce((sum, plan) => sum + getProgress(plan.topics), 0);
    return Math.round(total / studyPlans.length);
  }, [studyPlans]);
  
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
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-t-2 border-b-2 border-orange-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gradient-to-b from-gray-900 to-black shadow-xl p-4 flex-col border-r border-gray-800 hidden md:flex"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2 mb-8"
        >
          <BookOpen className="text-orange-500 h-8 w-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Study Planner
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
          <NavLink to="/achievements" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
          </NavLink>
          <NavLink to="/study-plan" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow">
            <BookOpen className="h-5 w-5" />
            <span>Study Plan</span>
          </NavLink>
          
          <h6 className="px-3 pt-4 pb-2 text-xs font-bold uppercase text-gray-500">Resources</h6>
          
          <NavLink to="/resources" className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all">
            <BookOpen className="h-5 w-5" />
            <span>Learning Resources</span>
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
              <BookOpen className="h-4 w-4 mr-2" />
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
              <p className="text-sm text-gray-400">Pages / Study Plan</p>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                Your Learning Roadmap
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </motion.header>

        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center">
              <NotebookPen className="h-10 w-10 mr-4 opacity-80" />
              <div>
                <div className="text-3xl font-bold">{totalPlans}</div>
                <div className="text-sm opacity-80">Study Plans</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-500 to-fuchsia-700 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center">
              <BarChart className="h-10 w-10 mr-4 opacity-80" />
              <div>
                <div className="text-3xl font-bold">{averageProgress}%</div>
                <div className="text-sm opacity-80">Average Progress</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center">
              <Clock className="h-10 w-10 mr-4 opacity-80" />
              <div>
                <div className="text-3xl font-bold">96h</div>
                <div className="text-sm opacity-80">Total Learning Time</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <button 
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'all' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Plans
          </button>
          <button 
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'beginner' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('beginner')}
          >
            Beginner
          </button>
          <button 
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'intermediate' 
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('intermediate')}
          >
            Intermediate
          </button>
          <button 
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'advanced' 
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
        </motion.div>

        {/* Study Plans Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                layout
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`bg-gradient-to-br ${plan.color} rounded-xl overflow-hidden shadow-xl border border-gray-700/50`}
              >
                <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {plan.duration}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      plan.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                      plan.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {plan.level}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mt-4">{plan.title}</h3>
                <p className="text-gray-200 mt-2">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <motion.div 
                      className="bg-white h-2 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${plan.progress}%` }}
                      transition={{ duration: 0.8 }}
                    ></motion.div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-300">
                    <span>{plan.topics.filter(t => t.completed).length}/{plan.topics.length} topics</span>
                    <span>{plan.progress}% complete</span>
                  </div>
                </div>
                
                <button 
                  className="w-full mt-4 text-center text-sm text-gray-300 flex items-center justify-center"
                  onClick={() => togglePlan(plan.id)}
                >
                  {expandedPlan === plan.id ? 'Show Less' : 'View Topics'} 
                  <motion.svg 
                    animate={{ rotate: expandedPlan === plan.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24"
                  >
                    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </motion.svg>
                </button>
                
                  <AnimatePresence>
                    {expandedPlan === plan.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-700/30 overflow-hidden"
                      >
                        <h4 className="font-bold mb-3 flex items-center">
                          <BookText className="h-4 w-4 mr-2" />
                          Topics Covered
                        </h4>
                        <div className="flex flex-col gap-2">
                          {plan.topics.map((topic, index) => (
                            <label key={index} className="flex items-center p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={topic.completed}
                                onChange={() => handleToggleTopic(plan.id, index)}
                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-600"
                              />
                              <span className={`ml-3 text-sm ${topic.completed ? 'line-through text-gray-400' : ''}`}>
                                {topic.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Create New Plan Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Create Custom Study Plan
            </h3>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <Library className="h-6 w-6" />
            </div>
          </div>
          
          <p className="text-gray-400 mb-6">
            Design your own learning path tailored to your goals and schedule
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-all cursor-pointer"
              onClick={() => {
                setSelectedPreset(presetTemplates.goals);
                setCreateModalOpen(true);
              }}
            >
              <Target className="h-8 w-8 text-orange-500 mb-2" />
              <h4 className="font-bold mb-1">Define Goals</h4>
              <p className="text-sm text-gray-400">Set clear learning objectives</p>
            </div>
            <div 
              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-all cursor-pointer"
              onClick={() => {
                setSelectedPreset(presetTemplates.timeline);
                setCreateModalOpen(true);
              }}
            >
              <Calendar className="h-8 w-8 text-orange-500 mb-2" />
              <h4 className="font-bold mb-1">Set Timeline</h4>
              <p className="text-sm text-gray-400">Create a realistic schedule</p>
            </div>
            <div 
              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-all cursor-pointer"
              onClick={() => {
                setSelectedPreset(presetTemplates.progress);
                setCreateModalOpen(true);
              }}
            >
              <Flag className="h-8 w-8 text-orange-500 mb-2" />
              <h4 className="font-bold mb-1">Track Progress</h4>
              <p className="text-sm text-gray-400">Monitor your achievements</p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setSelectedPreset(null);
              setCreateModalOpen(true);
            }}
            className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg shadow-lg transition-all flex items-center justify-center"
          >
            <Bookmark className="h-5 w-5 mr-2" />
            Create New Study Plan
          </button>
        </motion.div>
      </main>

      {/* Create Plan Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePlanModal 
            onClose={() => {
              setCreateModalOpen(false);
              setSelectedPreset(null);
            }}
            onCreate={handleCreateNewPlan}
            preset={selectedPreset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal component for creating new study plans
const CreatePlanModal = ({ onClose, onCreate, preset }) => {
  const [formData, setFormData] = useState(preset || {
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    topics: '',
    color: 'from-blue-500 to-indigo-600'
  });

  // Update form data if preset changes
  useEffect(() => {
    if (preset) {
      setFormData(preset);
    } else {
      setFormData({
        title: '',
        description: '',
        duration: '',
        level: 'Beginner',
        topics: '',
        color: 'from-blue-500 to-indigo-600'
      });
    }
  }, [preset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };
  
  const colorOptions = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-fuchsia-600",
    "from-amber-500 to-orange-600",
    "from-green-500 to-emerald-600",
    "from-red-500 to-rose-600",
    "from-cyan-500 to-sky-600"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create a New Study Plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Form Fields */}
            <input 
              type="text" 
              name="title" 
              placeholder="Plan Title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full bg-gray-700/50 rounded p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
            <textarea 
              name="description" 
              placeholder="Description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows="2" 
              className="w-full bg-gray-700/50 rounded p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
            <input 
              type="text" 
              name="duration" 
              placeholder="e.g., 4 weeks" 
              value={formData.duration} 
              onChange={handleChange} 
              required 
              className="w-full bg-gray-700/50 rounded p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
            <select 
              name="level" 
              value={formData.level} 
              onChange={handleChange} 
              className="w-full bg-gray-700/50 rounded p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <textarea 
              name="topics" 
              placeholder="Topics (comma-separated)" 
              value={formData.topics} 
              onChange={handleChange} 
              required 
              rows="3" 
              className="w-full bg-gray-700/50 rounded p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
            
            {/* Color Picker */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map(color => (
                  <label key={color} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="color" 
                      value={color} 
                      checked={formData.color === color} 
                      onChange={handleChange} 
                      className="sr-only" 
                    />
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : 'scale-90 hover:scale-100'}`}></div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all">
              Create Plan
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StudyPlan;