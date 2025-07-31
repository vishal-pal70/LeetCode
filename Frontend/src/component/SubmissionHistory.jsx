import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Info, Copy, X } from 'lucide-react';
// import { useToast } from "@/components/ui/use-toast";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  // const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(Array.isArray(response.data) ? response.data : response.data.submissions || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'wrong': return 'destructive';
      case 'error': return 'warning';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedSubmission?.code || '');
    // toast({
    //   title: "Code copied!",
    //   description: "Submission code has been copied to clipboard",
    //   duration: 2000,
    // });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3 bg-gray-700" />
        <div className="rounded-xl border border-gray-700">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                {[...Array(8)].map((_, i) => (
                  <TableHead key={i} className="bg-gray-800">
                    <Skeleton className="h-6 w-full bg-gray-700" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i} className="bg-gray-900">
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-gray-700" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4 bg-red-900/30 border-red-900/30">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="text-red-400">Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Submission History</CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <Alert className="bg-blue-900/30 border-blue-900/30">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-400">No submissions found</AlertTitle>
            <AlertDescription className="text-gray-400">
              You haven't submitted any solutions for this problem yet.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="rounded-xl border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow>
                    <TableHead className="hidden sm:table-cell bg-gray-800 text-gray-400">#</TableHead>
                    <TableHead className="bg-gray-800 text-gray-400">Language</TableHead>
                    <TableHead className="bg-gray-800 text-gray-400">Status</TableHead>
                    <TableHead className="hidden md:table-cell bg-gray-800 text-gray-400">Runtime</TableHead>
                    <TableHead className="hidden lg:table-cell bg-gray-800 text-gray-400">Memory</TableHead>
                    <TableHead className="bg-gray-800 text-gray-400">Test Cases</TableHead>
                    <TableHead className="hidden xl:table-cell bg-gray-800 text-gray-400">Submitted</TableHead>
                    <TableHead className="bg-gray-800 text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub, index) => (
                    <TableRow key={sub._id} className="hover:bg-gray-800/50 bg-gray-900">
                      <TableCell className="hidden sm:table-cell font-medium text-gray-300">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono text-gray-300">{sub.language}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusVariant(sub.status)} 
                          className="capitalize bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all"
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-gray-300">
                        {sub.runtime} sec
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-gray-300">
                        {formatMemory(sub.memory)}
                      </TableCell>
                      <TableCell className="font-mono text-gray-300">
                        {sub.testCasesPassed}/{sub.testCasesTotal}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-gray-300">
                        {formatDate(sub.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all"
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          View Code
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Showing {submissions.length} submissions
            </p>
          </>
        )}

        {/* Code View Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Submission Details: {selectedSubmission.language}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge 
                        variant={getStatusVariant(selectedSubmission.status)} 
                        className="capitalize bg-opacity-20"
                      >
                        {selectedSubmission.status}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-700/50 text-gray-300">
                        Runtime: {selectedSubmission.runtime}s
                      </Badge>
                      <Badge variant="outline" className="bg-gray-700/50 text-gray-300">
                        Memory: {formatMemory(selectedSubmission.memory)}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-700/50 text-gray-300">
                        Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {selectedSubmission.errorMessage && (
                  <Alert variant="destructive" className="mt-4 bg-red-900/30 border-red-900/30">
                    <Terminal className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      {selectedSubmission.errorMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="relative flex-1 overflow-auto bg-gray-900 p-4">
                <Button 
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4 z-10 gap-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <pre className="text-sm text-gray-200 overflow-x-auto">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>
              
              <div className="p-4 border-t border-gray-700 flex justify-end">
                <Button 
                  onClick={() => setSelectedSubmission(null)}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white transition-all"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionHistory;