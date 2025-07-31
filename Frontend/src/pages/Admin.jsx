import React from 'react';
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
import { useState } from 'react';

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    problems: 142,
    users: 2543,
    submissions: 18432,
    activeToday: 324
  });

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      route: '/admin/delete'
    },
    {
      id: 'manage',
      title: 'Manage Users',
      description: 'View and manage user accounts and permissions',
      icon: User,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      route: '/admin/users'
    },
    {
      id: 'analytics',
      title: 'Platform Analytics',
      description: 'View usage statistics and platform metrics',
      icon: BarChart2,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      route: '/admin/analytics'
    },
    {
      id: 'logs',
      title: 'System Logs',
      description: 'View administrative logs and activity history',
      icon: FileText,
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      route: '/admin/logs'
    }
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Zap className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Admin Panel
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            
            <div className="dropdown dropdown-end">
              <Button variant="outline" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Admin Settings
              </Button>
              <ul className="mt-2 p-2 shadow menu menu-sm dropdown-content bg-white dark:bg-gray-800 rounded-box w-52 z-50 border border-gray-200 dark:border-gray-700">
                <li><a><User className="h-4 w-4" /> My Profile</a></li>
                <li><a><Settings className="h-4 w-4" /> Settings</a></li>
                <Separator className="my-1" />
                <li><a onClick={handleLogout} className="text-red-600 dark:text-red-400"><LogOut className="h-4 w-4" /> Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-blue-200 dark:border-blue-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.problems}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total coding problems</p>
            </CardContent>
          </Card>
          
          <Card className="border border-green-200 dark:border-green-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Registered users</p>
            </CardContent>
          </Card>
          
          <Card className="border border-yellow-200 dark:border-yellow-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.submissions}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Code submissions</p>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-200 dark:border-purple-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Active Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeToday}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active users</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Admin Actions</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage platform content and settings
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Input
              type="text"
              placeholder="Search admin features..."
              className="w-full md:w-64"
            />
          </div>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <NavLink 
                to={option.route}
                key={option.id}
                className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <Card className="h-full hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg ${option.color}`}>
                        <IconComponent size={24} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">{option.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-4">
                    <Button variant="outline" className="w-full border-blue-500 text-blue-600 dark:text-blue-400">
                      Access Feature
                    </Button>
                  </CardFooter>
                </Card>
              </NavLink>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 p-2 rounded-full">
                    <Plus size={18} />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">Created new problem</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Two Sum problem added by Admin
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      2 hours ago
                    </div>
                  </div>
                  <Badge variant="success" className="ml-auto">Problem</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 p-2 rounded-full">
                    <Edit size={18} />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">Updated problem</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Modified test cases for Binary Search problem
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      5 hours ago
                    </div>
                  </div>
                  <Badge variant="warning" className="ml-auto">Update</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 p-2 rounded-full">
                    <User size={18} />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">User account modified</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Updated permissions for user@example.com
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      1 day ago
                    </div>
                  </div>
                  <Badge variant="info" className="ml-auto">User</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-200 dark:border-gray-700 py-4">
              <Button variant="ghost">View All Activity</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Admin Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Zap className="text-white h-5 w-5" />
              </div>
              <span className="font-medium">Admin Panel v2.1</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} VCode Platform. All rights reserved.
            </div>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm">Documentation</Button>
              <Button variant="ghost" size="sm">Support</Button>
              <Button variant="ghost" size="sm">API Status</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Admin;