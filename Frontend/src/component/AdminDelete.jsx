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
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const difficultyLower = difficulty.toLowerCase();
    const colorClass = colorMap[difficultyLower] || 'bg-gray-100 text-gray-800 border-gray-200';
    
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <span className="sr-only">Loading problems...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">Problem Management</CardTitle>
              <p className="text-gray-600 mt-1">Manage and delete coding problems</p>
            </div>
            <Button 
              variant="outline" 
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
            <Alert className="mb-6 border-green-500 text-green-700 bg-green-50">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{deleteSuccess}</AlertDescription>
            </Alert>
          )}
          {deleteError && (
            <Alert variant="destructive" className="mb-6">
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
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {difficultyFilter === 'All' ? 'Filter by Difficulty' : difficultyFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setDifficultyFilter('All')}>
                  <span className={difficultyFilter === 'All' ? 'font-semibold' : ''}>All Difficulties</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter('Easy')}>
                  <span className={difficultyFilter === 'Easy' ? 'font-semibold text-green-600' : ''}>Easy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter('Medium')}>
                  <span className={difficultyFilter === 'Medium' ? 'font-semibold text-yellow-600' : ''}>Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDifficultyFilter('Hard')}>
                  <span className={difficultyFilter === 'Hard' ? 'font-semibold text-red-600' : ''}>Hard</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {(searchTerm !== '' || difficultyFilter !== 'All') && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchTerm !== '' && (
                <Badge className="flex items-center gap-1 bg-blue-50 text-blue-700">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-1 rounded-full p-0.5 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {difficultyFilter !== 'All' && (
                <Badge className="flex items-center gap-1 bg-purple-50 text-purple-700">
                  Difficulty: {difficultyFilter}
                  <button 
                    onClick={() => setDifficultyFilter('All')}
                    className="ml-1 rounded-full p-0.5 hover:bg-purple-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error Loading Problems</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead className="min-w-[200px]">Title</TableHead>
                      <TableHead className="w-32">Difficulty</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProblems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                            <p className="text-gray-500">No problems found</p>
                            <p className="text-gray-400 text-sm mt-2">
                              Try adjusting your search or filter
                            </p>
                            <Button 
                              variant="ghost" 
                              className="mt-2"
                              onClick={resetFilters}
                            >
                              Clear all filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentProblems.map((problem, index) => (
                        <TableRow key={problem._id} className="hover:bg-gray-50">
                          <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                              <div className="font-medium">{problem.title}</div>
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
                                  variant="outline"
                                  className="text-gray-600 bg-gray-50"
                                >
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => openDeleteDialog(problem)}
                                  className="text-red-600 focus:bg-red-50"
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
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProblems.length)} of {filteredProblems.length} problems
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
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
                      <span className="px-2">...</span>
                    )}
                    {totalPages > 5 && currentPage < totalPages - 1 && (
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
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

      <Dialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Problem</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently delete this problem?
            </DialogDescription>
          </DialogHeader>
          
          {problemToDelete && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div>
                  <h4 className="font-semibold">{problemToDelete.title}</h4>
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
              onClick={closeDeleteDialog}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
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
  );
};

export default AdminDelete;