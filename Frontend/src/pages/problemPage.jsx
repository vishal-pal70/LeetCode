import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../component/SubmissionHistory";
import ChatAi from '../component/ChatAi';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  Code2, 
  BookText, 
  Lightbulb, 
  FileCode2, 
  History, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  Loader2,
  ScrollText,
  Copy,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [leftPanelActiveTab, setLeftPanelActiveTab] = useState('description');
  const [rightPanelActiveTab, setRightPanelActiveTab] = useState('code');
  const [isResetting, setIsResetting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  let { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode?.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
        
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode?.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setRunResult(response.data);
      setLoading(false);
      setRightPanelActiveTab('run');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setRightPanelActiveTab('run');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setLoading(false);
      setRightPanelActiveTab('submit');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        success: false,
        error: 'Submission failed'
      });
      setLoading(false);
      setRightPanelActiveTab('submit');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'hard': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'success' || status === 'accepted') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'pending') {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const resetToInitialCode = () => {
    setIsResetting(true);
    setTimeout(() => {
      if (problem) {
        const initialCode = problem.startCode?.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
        setCode(initialCode);
      }
      setIsResetting(false);
    }, 500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getAiSuggestions = async () => {
    try {
      const response = await axiosClient.post(`/ai/suggestions/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setAiSuggestions(response.data.suggestions);
   
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
  
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm py-3 px-4 sm:px-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="hidden sm:inline-flex text-gray-300 hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Code2 className="h-6 w-6 text-blue-400 mr-2" />
              </motion.div>
              <h1 className="text-xl font-bold text-gray-100">Code Nexus</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem Description Panel */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0 border-r border-gray-700 bg-gray-900">
          <Tabs value={leftPanelActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="bg-gray-800 px-2 py-1 sm:px-4 sm:py-2 border-b border-gray-700 flex-nowrap overflow-x-auto">
              <TabsTrigger 
                value="description" 
                className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all"
                onClick={() => setLeftPanelActiveTab('description')}
              >
                <BookText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="editorial" 
                className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all"
                onClick={() => setLeftPanelActiveTab('editorial')}
              >
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Editorial
              </TabsTrigger>
              <TabsTrigger 
                value="solutions" 
                className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all"
                onClick={() => setLeftPanelActiveTab('solutions')}
              >
                <FileCode2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Solutions
              </TabsTrigger>
              <TabsTrigger 
                value="submissions" 
                className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all"
                onClick={() => setLeftPanelActiveTab('submissions')}
              >
                <History className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Submissions
              </TabsTrigger>
              <TabsTrigger 
                value="chatAI" 
                className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all"
                onClick={() => setLeftPanelActiveTab('chatAI')}
              >
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                AI Assistant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-900">
              {problem && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                    <Badge className={`${getDifficultyColor(problem.difficulty)} px-3 py-1 rounded-full`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </Badge>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags?.split(',').map((tag, idx) => (
                        <Badge variant="secondary" key={idx} className="text-sm bg-gray-700 text-gray-300">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="mb-6 bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <div className="prose prose-invert max-w-none text-gray-300">
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {problem.description}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Examples:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {problem.visibleTestCases?.map((example, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                              <CardTitle className="text-base text-white">Example {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <div className="font-semibold text-sm mb-1 text-gray-400">Input:</div>
                                  <div className="bg-gray-700 p-2 rounded font-mono text-gray-200">
                                    {example.input}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-sm mb-1 text-gray-400">Output:</div>
                                  <div className="bg-gray-700 p-2 rounded font-mono text-gray-200">
                                    {example.output}
                                  </div>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <div className="font-semibold text-sm mb-1 text-gray-400">Explanation:</div>
                                    <div className="bg-gray-700 p-2 rounded text-gray-300">
                                      {example.explanation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="editorial" className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-900">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Editorial</CardTitle>
                    <CardDescription className="text-gray-400">Approaches and solutions for this problem</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <h3 className="text-white">Optimal Solution</h3>
                      <p className="text-gray-300">
                        The optimal solution for this problem involves using a two-pointer technique 
                        to efficiently find the solution without extra space.
                      </p>
                      
                      <h3 className="mt-6 text-white">Complexity Analysis</h3>
                      <ul className="text-gray-300">
                        <li>Time Complexity: O(n)</li>
                        <li>Space Complexity: O(1)</li>
                      </ul>
                      
                      <h3 className="mt-6 text-white">Solution Code</h3>
                      <pre className="bg-gray-700 p-4 rounded overflow-x-auto">
                        <code className="text-gray-200">
                          {`function solution(nums, target) {
  // Implementation goes here
}`}
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="solutions" className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-900">
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-2 text-white">Available Solutions</h2>
                <p className="text-gray-400 mb-6">
                  Browse through different approaches to solve this problem
                </p>
                
                {problem?.referenceSolution?.length > 0 ? (
                  problem.referenceSolution.map((solution, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="border border-gray-700 bg-gray-800 overflow-hidden">
                        <CardHeader className="bg-gray-700 px-4 py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-base sm:text-lg text-white">
                                {solution?.language} Solution
                              </CardTitle>
                              <CardDescription className="mt-1 text-gray-300">
                                {problem?.title}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300">Reference</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="bg-gray-900 p-4 max-h-80 overflow-y-auto">
                            <pre className="text-sm">
                              <code className="text-gray-300">{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-700 px-4 py-3 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all flex items-center"
                            onClick={() => copyToClipboard(solution?.completeCode)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mb-4">
                      <ScrollText className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-white">Solutions Locked</h3>
                    <p className="text-gray-400 mb-4 max-w-md mx-auto">
                      Solve the problem to unlock all available solutions and approaches
                    </p>
                    <Button 
                      variant="default"
                      onClick={() => setLeftPanelActiveTab('description')}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all"
                    >
                      Solve Problem
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-900">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Submission History</CardTitle>
                  <CardDescription className="text-gray-400">Your previous solutions for this problem</CardDescription>
                </CardHeader>
                <CardContent>
                  <SubmissionHistory problemId={problemId} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chatAI" className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-900">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Assistant</CardTitle>
                  <CardDescription className="text-gray-400">Get help solving this problem</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChatAi problem={problem} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Code Editor & Results Panel */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0 bg-gray-900">
          <Tabs 
            value={rightPanelActiveTab} 
            onValueChange={setRightPanelActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <TabsList className="bg-gray-800 px-2 py-1 sm:px-4 sm:py-2 border-b border-gray-700 flex-nowrap overflow-x-auto">
              <TabsTrigger value="code" className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all">
                <Code2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="run" className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all">
                <Cpu className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Run Results
              </TabsTrigger>
              <TabsTrigger value="submit" className="flex items-center whitespace-nowrap text-xs sm:text-sm text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-gray-700 transition-all">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Submission
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 flex flex-col min-h-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-4 border-b border-gray-700 gap-2">
                <div className="w-full sm:w-auto">
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-gray-300">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                      <SelectItem value="javascript" className="hover:bg-gray-700">JavaScript</SelectItem>
                      <SelectItem value="java" className="hover:bg-gray-700">Java</SelectItem>
                      <SelectItem value="cpp" className="hover:bg-gray-700">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs sm:text-sm bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg transition-all flex items-center"
                    onClick={resetToInitialCode}
                    disabled={isResetting}
                  >
                    {isResetting ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-1" />
                    )}
                    Reset Code
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              <div className="p-2 sm:p-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between gap-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setRightPanelActiveTab('run')}
                    className="text-xs sm:text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
                  >
                    View Console
                  </Button>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRun}
                    disabled={loading}
                    className="text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg transition-all"
                  >
                    {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1 sm:mr-2" /> : null}
                    Run Code
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSubmitCode}
                    disabled={loading}
                    className="text-xs sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all"
                  >
                    {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1 sm:mr-2" /> : null}
                    Submit Solution
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="run" className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-900">
              <Card className="h-full bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Test Results</CardTitle>
                  <CardDescription className="text-gray-400">Output from your code execution</CardDescription>
                </CardHeader>
                <CardContent>
                  {runResult ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`mb-6 p-4 rounded-lg ${runResult.success ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                        <div className="flex items-center">
                          {getStatusIcon(runResult.success ? 'success' : 'error')}
                          <div className="ml-3">
                            <h3 className={`font-bold text-lg ${runResult.success ? 'text-green-400' : 'text-red-400'}`}>
                              {runResult.success ? 'All Test Cases Passed!' : 'Test Cases Failed'}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Runtime: {runResult.runtime} sec
                              </div>
                              <div className="flex items-center">
                                <MemoryStick className="h-4 w-4 mr-1" />
                                Memory: {runResult.memory} KB
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 className="font-semibold mb-3 text-gray-300">Test Case Details:</h4>
                      <div className="space-y-4">
                        {runResult.testCases?.map((tc, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                          >
                            <Card className={`${tc.status_id === 3 ? 'border-green-900/30' : 'border-red-900/30'} bg-gray-800`}>
                              <CardHeader className="py-3">
                                <div className="flex items-center text-gray-300">
                                  {getStatusIcon(tc.status_id === 3 ? 'success' : 'error')}
                                  <span className="ml-2">Test Case {i + 1}</span>
                                  <Badge 
                                    variant={tc.status_id === 3 ? 'success' : 'destructive'} 
                                    className="ml-auto"
                                  >
                                    {tc.status_id === 3 ? 'Passed' : 'Failed'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="font-semibold mb-1 text-gray-400">Input:</div>
                                    <div className="bg-gray-700 p-2 rounded font-mono text-gray-200">
                                      {tc.stdin}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-semibold mb-1 text-gray-400">Expected Output:</div>
                                    <div className="bg-gray-700 p-2 rounded font-mono text-gray-200">
                                      {tc.expected_output}
                                    </div>
                                  </div>
                                  <div className="md:col-span-2">
                                    <div className="font-semibold mb-1 text-gray-400">Your Output:</div>
                                    <div className="bg-gray-700 p-2 rounded font-mono text-gray-200">
                                      {tc.stdout || "No output"}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Cpu className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2 text-white">No Results Yet</h3>
                      <p className="text-gray-400 mb-4">
                        Run your code to see test results here
                      </p>
                      <Button 
                        variant="default"
                        onClick={handleRun}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all"
                      >
                        Run Code
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submit" className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-900">
              <Card className="h-full bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Submission Result</CardTitle>
                  <CardDescription className="text-gray-400">Evaluation of your solution</CardDescription>
                </CardHeader>
                <CardContent>
                  {submitResult ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`mb-6 p-4 rounded-lg ${submitResult.accepted ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                        <div className="flex items-center">
                          {getStatusIcon(submitResult.accepted ? 'success' : 'error')}
                          <div className="ml-3">
                            <h3 className={`font-bold text-xl ${submitResult.accepted ? 'text-green-400' : 'text-red-400'}`}>
                              {submitResult.accepted ? 'Accepted!' : submitResult.error || 'Submission Failed'}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-gray-300">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Runtime: {submitResult.runtime} sec
                              </div>
                              <div className="flex items-center">
                                <MemoryStick className="h-4 w-4 mr-1" />
                                Memory: {submitResult.memory} KB
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {submitResult.passedTestCases}/{submitResult.totalTestCases} cases passed
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!submitResult.accepted && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3 text-gray-300">Error Details:</h4>
                          <Card className="bg-red-900/20 border-red-900/30">
                            <CardContent className="p-4">
                              <pre className="text-red-300 overflow-x-auto">
                                {submitResult.errorDetails || "No additional error information available"}
                              </pre>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex justify-between mb-2 text-gray-300">
                          <span>Test Cases Passed</span>
                          <span>{submitResult.passedTestCases}/{submitResult.totalTestCases}</span>
                        </div>
                        <Progress 
                          value={(submitResult.passedTestCases / submitResult.totalTestCases) * 100} 
                          className="h-2 bg-gray-700"
                          indicatorColor={submitResult.accepted ? "bg-green-500" : "bg-red-500"}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gray-700 border-gray-600">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base text-white">Runtime Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-white">{submitResult.runtime} sec</div>
                            <div className="text-sm text-gray-400 mt-1">
                              Faster than 72% of submissions
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-700 border-gray-600">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base text-white">Memory Usage</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-white">{submitResult.memory} KB</div>
                            <div className="text-sm text-gray-400 mt-1">
                              Better than 65% of submissions
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2 text-white">No Submission Yet</h3>
                      <p className="text-gray-400 mb-4">
                        Submit your solution to see the results
                      </p>
                      <Button 
                        variant="default"
                        onClick={handleSubmitCode}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all"
                      >
                        Submit Solution
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-center border-t border-gray-700 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setLeftPanelActiveTab('submissions')}
                    className="bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
                  >
                    View Submission History
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;