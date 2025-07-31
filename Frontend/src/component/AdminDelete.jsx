import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Trash2, 
  Search, 
  Filter, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (problem) => {
    setProblemToDelete(problem);
    setDeleteDialogOpen(true);
    setDeleteSuccess(null);
    setDeleteError(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProblemToDelete(null);
  };

  const handleDelete = async () => {
    if (!problemToDelete) return;
    
    try {
      setDeleting(true);
      await axiosClient.delete(`/problem/delete/${problemToDelete._id}`);
      
      setDeleteSuccess(`${problemToDelete.title} has been successfully deleted.`);
      setProblems(problems.filter(problem => problem._id !== problemToDelete._id));
      closeDeleteDialog();
    } catch (err) {
      setDeleteError('Failed to delete problem. Please try again.');
      console.error(err);
    } finally {
      setDeleting(false);
      setTimeout(() => {
        setDeleteSuccess(null);
        setDeleteError(null);
      }, 5000);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('All');
    setCurrentPage(1);
  };

  // Case-insensitive difficulty filter
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (problem.tags && problem.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === 'All' || 
                             problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    
    return matchesSearch && matchesDifficulty;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const difficultyBadge = (difficulty) => {
    const colorMap = {
      easy: 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      hard: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    const difficultyLower = difficulty.toLowerCase();
    const colorClass = colorMap[difficultyLower] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    
    return (
      <Badge className={`${colorClass} px-3 py-1 rounded-full font-medium border`}>
        {difficulty}
      </Badge>
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, difficultyFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <span className="sr-only">Loading problems...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="mb-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">
                    Problem Management
                  </CardTitle>
                  <p className="text-gray-400 mt-1">Manage and delete coding problems</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                  onClick={resetFilters}
                  disabled={searchTerm === '' && difficultyFilter === 'All'}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset Filters
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {deleteSuccess && (
                <Alert className="mb-6 bg-green-900/30 border-green-500/50 text-green-400">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{deleteSuccess}</AlertDescription>
                </Alert>
              )}
              {deleteError && (
                <Alert className="mb-6 bg-red-900/30 border-red-500/50 text-red-400">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search problems by title or tags..."
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-700">
                      <Filter className="h-4 w-4" />
                      {difficultyFilter === 'All' ? 'Filter by Difficulty' : difficultyFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem 
                      onClick={() => setDifficultyFilter('All')}
                      className="hover:bg-gray-700"
                    >
                      <span className={difficultyFilter === 'All' ? 'font-semibold text-orange-400' : ''}>All Difficulties</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDifficultyFilter('Easy')}
                      className="hover:bg-gray-700"
                    >
                      <span className={difficultyFilter === 'Easy' ? 'font-semibold text-green-400' : ''}>Easy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDifficultyFilter('Medium')}
                      className="hover:bg-gray-700"
                    >
                      <span className={difficultyFilter === 'Medium' ? 'font-semibold text-yellow-400' : ''}>Medium</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDifficultyFilter('Hard')}
                      className="hover:bg-gray-700"
                    >
                      <span className={difficultyFilter === 'Hard' ? 'font-semibold text-red-400' : ''}>Hard</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {(searchTerm !== '' || difficultyFilter !== 'All') && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {searchTerm !== '' && (
                    <Badge className="flex items-center gap-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Search: "{searchTerm}"
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="ml-1 rounded-full p-0.5 hover:bg-blue-500/30"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {difficultyFilter !== 'All' && (
                    <Badge className="flex items-center gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Difficulty: {difficultyFilter}
                      <button 
                        onClick={() => setDifficultyFilter('All')}
                        className="ml-1 rounded-full p-0.5 hover:bg-purple-500/30"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {error ? (
                <Alert className="mb-6 bg-red-900/30 border-red-500/50 text-red-400">
                  <AlertTitle>Error Loading Problems</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="rounded-lg border border-gray-700">
                    <Table>
                      <TableHeader className="bg-gray-800/50">
                        <TableRow>
                          <TableHead className="w-12 text-gray-300">#</TableHead>
                          <TableHead className="min-w-[200px] text-gray-300">Title</TableHead>
                          <TableHead className="w-32 text-gray-300">Difficulty</TableHead>
                          <TableHead className="text-gray-300">Tags</TableHead>
                          <TableHead className="w-24 text-right text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProblems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center justify-center">
                                <div className="bg-gray-700 border border-dashed border-gray-600 rounded-xl w-16 h-16 mb-4" />
                                <p className="text-gray-400">No problems found</p>
                                <p className="text-gray-500 text-sm mt-2">
                                  Try adjusting your search or filter
                                </p>
                                <Button 
                                  variant="ghost" 
                                  className="mt-2 text-gray-300"
                                  onClick={resetFilters}
                                >
                                  Clear all filters
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentProblems.map((problem, index) => (
                            <TableRow 
                              key={problem._id} 
                              className="hover:bg-gray-800/30 border-b border-gray-700"
                            >
                              <TableCell className="text-gray-300">{indexOfFirstItem + index + 1}</TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <div className="bg-gray-700 border border-dashed border-gray-600 rounded-xl w-16 h-16" />
                                  <div className="font-medium text-gray-100">{problem.title}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {difficultyBadge(problem.difficulty)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {problem.tags && problem.tags.split(',').map((tag, i) => (
                                    <Badge 
                                      key={i} 
                                      className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                                    >
                                      {tag.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-700">
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                                    <DropdownMenuItem
                                      onClick={() => openDeleteDialog(problem)}
                                      className="text-red-400 focus:bg-red-500/20"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-400">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProblems.length)} of {filteredProblems.length} problems
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-700"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = currentPage <= 3 
                            ? i + 1 
                            : currentPage >= totalPages - 2 
                              ? totalPages - 4 + i 
                              : currentPage - 2 + i;
                          
                          if (pageNum > 0 && pageNum <= totalPages) {
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                className={currentPage === pageNum ? "bg-gradient-to-r from-orange-500 to-pink-500" : "border-gray-700 text-gray-300 hover:bg-gray-700"}
                                size="icon"
                                onClick={() => setCurrentPage(pageNum)}
                                disabled={currentPage === pageNum}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                          return null;
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        {totalPages > 5 && currentPage < totalPages - 1 && (
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            className={currentPage === totalPages ? "bg-gradient-to-r from-orange-500 to-pink-500" : "border-gray-700 text-gray-300 hover:bg-gray-700"}
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          >
                            {totalPages}
                          </Button>
                        )}
                      </div>
                      <Button 
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-700"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <DialogContent className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">
                Delete Problem
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                This action cannot be undone. Are you sure you want to permanently delete this problem?
              </DialogDescription>
            </DialogHeader>
            
            {problemToDelete && (
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-700 border border-dashed border-gray-600 rounded-xl w-16 h-16" />
                  <div>
                    <h4 className="font-semibold text-gray-100">{problemToDelete.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {difficultyBadge(problemToDelete.difficulty)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-700"
                onClick={closeDeleteDialog}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Problem
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDelete;
