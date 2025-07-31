import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  RefreshCw, 
  Zap, 
  Settings, 
  User, 
  LogOut,
  BarChart2,
  FileText
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    problems: null,
    users: null,
    submissions: null,
    activeToday: null
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user/stats');
        setStats({
          problems: response.data.totalProblems ?? 0,
          users: response.data.totalUsers ?? 0,
          submissions: response.data.totalSubmissions ?? 0,
          activeToday: response.data.activeToday ?? 0
        });
        console.log(response.data.totalProblems);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/user/stats');
      setStats({
          problems: response.data.totalProblems ?? 0,
          users: response.data.totalUsers ?? 0,
          submissions: response.data.totalSubmissions ?? 0,
          activeToday: response.data.activeToday ?? 0
        });
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'from-orange-500 to-amber-500',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'from-blue-500 to-cyan-500',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'from-green-500 to-emerald-500',
      route: '/admin/delete'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Created new problem',
      details: 'Two Sum problem added by Admin',
      time: '2 hours ago',
      icon: Plus,
      badge: 'Problem',
      color: 'from-orange-500 to-amber-500'
    },
    {
      id: 2,
      action: 'Updated problem',
      details: 'Modified test cases for Binary Search problem',
      time: '5 hours ago',
      icon: Edit,
      badge: 'Update',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      action: 'User account modified',
      details: 'Updated permissions for user@example.com',
      time: '1 day ago',
      icon: User,
      badge: 'User',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Admin Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 py-4 px-6 border-b border-gray-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg"
            >
              <Zap className="text-white h-6 w-6" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">
              Admin Panel
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="flex items-center bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={refreshStats}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
            
            <div className="dropdown dropdown-end">
              <Button 
                variant="outline" 
                className="flex items-center bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin 
              </Button>
              <ul className="mt-2 p-2 shadow menu menu-sm dropdown-content bg-gray-800 rounded-box w-52 z-50 border border-gray-700">
                <Separator className="my-1 bg-gray-700" />
                <li><a onClick={handleLogout} className="text-red-400 hover:bg-red-500/20"><LogOut className="h-4 w-4" /> Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Problems Card - Orange Gradient */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-300">Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-300">
                  {loading ? (
                    <div className="h-8 w-16 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded animate-pulse"></div>
                  ) : (
                    stats.problems 
                  )}
                </div>
                <p className="text-sm text-amber-200/60 mt-1">Total coding problems</p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Users Card - Blue Gradient */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-300">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-300">
                  {loading ? (
                    <div className="h-8 w-16 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded animate-pulse"></div>
                  ) : (
                    stats.users
                  )}
                </div>
                <p className="text-sm text-cyan-200/60 mt-1">Registered users</p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Submissions Card - Green Gradient */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-300">Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-300">
                  {loading ? (
                    <div className="h-8 w-20 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded animate-pulse"></div>
                  ) : (
                    stats.submissions
                  )}
                </div>
                <p className="text-sm text-emerald-200/60 mt-1">Code submissions</p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Active Today Card - Pink Gradient */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-300">Active Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-300">
                  {loading ? (
                    <div className="h-8 w-12 bg-gradient-to-r from-pink-500/30 to-rose-500/30 rounded animate-pulse"></div>
                  ) : (
                    stats.activeToday
                  )}
                </div>
                <p className="text-sm text-rose-200/60 mt-1">Active users</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">Admin Actions</h2>
            <p className="text-gray-400">
              Manage platform content and settings
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Input
              type="text"
              placeholder="Search admin features..."
              className="w-full md:w-64 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 text-gray-300"
            />
          </div>
        </motion.div>

        {/* Admin Options Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <motion.div
                key={option.id}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink to={option.route}>
                  <Card className={`h-full bg-gradient-to-br ${option.color}/20 border ${option.color}/30 backdrop-blur-sm hover:${option.color}/50 transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color}`}>
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-100">{option.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 pb-4">
                      <Button 
                        variant="outline" 
                        className={`w-full border-transparent bg-gradient-to-r ${option.color} text-white hover:opacity-90`}
                      >
                        Access Feature
                      </Button>
                    </CardFooter>
                  </Card>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">Recent Activity</h2>
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <motion.div 
                      key={activity.id}
                      whileHover={{ x: 5 }}
                      className={`flex items-start p-4 rounded-lg bg-gradient-to-r ${activity.color}/10 border-l-4 ${activity.color}/50`}
                    >
                      <div className={`p-2 rounded-full bg-gradient-to-br ${activity.color}`}>
                        <ActivityIcon className="text-white" size={18} />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-100">{activity.action}</div>
                        <div className="text-sm text-gray-400">
                          {activity.details}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </div>
                      </div>
                      <Badge className={`ml-auto bg-gradient-to-br ${activity.color} text-white`}>
                        {activity.badge}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-700 py-4">
              <Button 
                variant="ghost" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90"
              >
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Admin Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
                <Zap className="text-white h-5 w-5" />
              </div>
              <span className="font-medium text-gray-300">Admin Panel v2.1</span>
            </div>
            
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} NexusCode Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Admin;
