import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Zod schema for validation
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required'),
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required'),
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required'),
    })
  ).length(3, 'All three languages required'),
  problemCreator: z.string().optional(),
});

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProblemId, setEditingProblemId] = useState(null);
  const [fetchingProblem, setFetchingProblem] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' },
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' },
      ],
      problemCreator: '',
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  // Fetch all problems initially
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single problem data and open update form
  const handleUpdateClick = async (id) => {
    setFetchingProblem(true);
    setEditingProblemId(id);
    setIsDrawerOpen(true);
    try {
      const { data } = await axiosClient.get(`/problem/problemById/${id}`);
      const problemData = data.problem || data;

      reset({
        title: problemData.title || '',
        description: problemData.description || '',
        difficulty: problemData.difficulty || 'easy',
        tags: problemData.tags || 'array',
        visibleTestCases:
          problemData.visibleTestCases?.length > 0
            ? problemData.visibleTestCases
            : [{ input: '', output: '', explanation: '' }],
        hiddenTestCases:
          problemData.hiddenTestCases?.length > 0
            ? problemData.hiddenTestCases
            : [{ input: '', output: '' }],
        startCode:
          problemData.startCode?.length === 3
            ? problemData.startCode
            : [
                { language: 'C++', initialCode: '' },
                { language: 'Java', initialCode: '' },
                { language: 'JavaScript', initialCode: '' },
              ],
        referenceSolution:
          problemData.referenceSolution?.length === 3
            ? problemData.referenceSolution
            : [
                { language: 'C++', completeCode: '' },
                { language: 'Java', completeCode: '' },
                { language: 'JavaScript', completeCode: '' },
              ],
        problemCreator: problemData.problemCreator || '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch problem data');
      console.error(err);
    } finally {
      setFetchingProblem(false);
    }
  };

  // Submit updated problem data
  const onSubmit = async (formData) => {
    if (!editingProblemId) return;
    try {
      await axiosClient.put(`/problem/update/${editingProblemId}`, formData);
      alert('Problem updated successfully!');
      setEditingProblemId(null);
      setIsDrawerOpen(false);
      fetchProblems();
    } catch (err) {
      alert('Failed to update problem');
      console.error(err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 p-4 rounded-md border border-red-700 max-w-4xl mx-auto my-4">
        <div className="flex items-center gap-2 text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-4">
      <div className="container mx-auto py-6 max-w-7xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">
            Problems Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage coding problems and their test cases
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">
                Problems List
              </CardTitle>
              <CardDescription className="text-gray-400">
                All available coding problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-800/50">
                      <TableHead className="w-1/12 text-gray-300">#</TableHead>
                      <TableHead className="w-4/12 text-gray-300">Title</TableHead>
                      <TableHead className="w-2/12 text-gray-300">Difficulty</TableHead>
                      <TableHead className="w-2/12 text-gray-300">Tags</TableHead>
                      <TableHead className="w-2/12 text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map((problem, index) => (
                      <TableRow key={problem._id} className="border-b border-gray-700 hover:bg-gray-800/30">
                        <TableCell className="text-gray-300">{index + 1}</TableCell>
                        <TableCell className="font-medium text-gray-100">{problem.title}</TableCell>
                        <TableCell>
                          <Badge className={`${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {problem.tags}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
                            onClick={() => handleUpdateClick(problem._id)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="h-[85vh] max-w-4xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700">
            <div className="mx-auto w-full">
              <DrawerHeader className="border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <DrawerTitle className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-400">
                    Update Problem
                  </DrawerTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-400 hover:bg-gray-700"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DrawerDescription className="text-gray-400">
                  Edit problem details and test cases
                </DrawerDescription>
              </DrawerHeader>
              
              {fetchingProblem ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(85vh-180px)]">
                  <div className="p-6">
                    <Tabs defaultValue="problem" className="w-full">
                      <TabsList className="grid grid-cols-3 w-full bg-gray-800/50 border border-gray-700">
                        <TabsTrigger 
                          value="problem" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/30 data-[state=active]:to-pink-500/30 data-[state=active]:text-white"
                        >
                          Problem
                        </TabsTrigger>
                        <TabsTrigger 
                          value="testCases" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/30 data-[state=active]:text-white"
                        >
                          Test Cases
                        </TabsTrigger>
                        <TabsTrigger 
                          value="code" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/30 data-[state=active]:to-emerald-500/30 data-[state=active]:text-white"
                        >
                          Code
                        </TabsTrigger>
                      </TabsList>
                      
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                        <TabsContent value="problem">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="title" className="text-gray-300">Title</Label>
                              <Input
                                id="title"
                                {...register('title')}
                                className={`bg-gray-800/50 border-gray-700 text-white ${errors.title ? 'border-red-500' : ''}`}
                              />
                              {errors.title && (
                                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="description" className="text-gray-300">Description</Label>
                              <Textarea
                                id="description"
                                {...register('description')}
                                className={`min-h-[150px] bg-gray-800/50 border-gray-700 text-white ${errors.description ? 'border-red-500' : ''}`}
                              />
                              {errors.description && (
                                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="difficulty" className="text-gray-300">Difficulty</Label>
                                <Select {...register('difficulty')} defaultValue="easy">
                                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="easy" className="hover:bg-gray-700">Easy</SelectItem>
                                    <SelectItem value="medium" className="hover:bg-gray-700">Medium</SelectItem>
                                    <SelectItem value="hard" className="hover:bg-gray-700">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="tags" className="text-gray-300">Tags</Label>
                                <Select {...register('tags')} defaultValue="array">
                                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                                    <SelectValue placeholder="Select tag" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="array" className="hover:bg-gray-700">Array</SelectItem>
                                    <SelectItem value="linkedList" className="hover:bg-gray-700">Linked List</SelectItem>
                                    <SelectItem value="graph" className="hover:bg-gray-700">Graph</SelectItem>
                                    <SelectItem value="dp" className="hover:bg-gray-700">Dynamic Programming</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="testCases">
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-300">Visible Test Cases</h3>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90"
                                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                >
                                  Add Test Case
                                </Button>
                              </div>
                              
                              <div className="space-y-4">
                                {visibleFields.map((field, idx) => (
                                  <Card key={field.id} className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
                                    <div className="flex justify-between items-center mb-3">
                                      <span className="font-medium text-gray-300">Test Case #{idx + 1}</span>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90"
                                        onClick={() => removeVisible(idx)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <div>
                                        <Label className="text-sm text-gray-300">Input</Label>
                                        <Input
                                          {...register(`visibleTestCases.${idx}.input`)}
                                          className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-300">Output</Label>
                                        <Input
                                          {...register(`visibleTestCases.${idx}.output`)}
                                          className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-300">Explanation</Label>
                                        <Input
                                          {...register(`visibleTestCases.${idx}.explanation`)}
                                          className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                                        />
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-300">Hidden Test Cases</h3>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
                                  onClick={() => appendHidden({ input: '', output: '' })}
                                >
                                  Add Test Case
                                </Button>
                              </div>
                              
                              <div className="space-y-4">
                                {hiddenFields.map((field, idx) => (
                                  <Card key={field.id} className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
                                    <div className="flex justify-between items-center mb-3">
                                      <span className="font-medium text-gray-300">Test Case #{idx + 1}</span>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90"
                                        onClick={() => removeHidden(idx)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <Label className="text-sm text-gray-300">Input</Label>
                                        <Input
                                          {...register(`hiddenTestCases.${idx}.input`)}
                                          className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-300">Output</Label>
                                        <Input
                                          {...register(`hiddenTestCases.${idx}.output`)}
                                          className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                                        />
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="code">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-3 text-gray-300">Start Code Templates</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['C++', 'Java', 'JavaScript'].map((lang, idx) => (
                                  <Card key={lang} className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
                                    <Label className="font-medium mb-2 block text-gray-300">{lang}</Label>
                                    <Textarea
                                      {...register(`startCode.${idx}.initialCode`)}
                                      rows={8}
                                      className="font-mono text-sm bg-gray-800/50 border-gray-700 text-white"
                                      placeholder={`Initial code for ${lang}`}
                                    />
                                  </Card>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-3 text-gray-300">Reference Solutions</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['C++', 'Java', 'JavaScript'].map((lang, idx) => (
                                  <Card key={lang} className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
                                    <Label className="font-medium mb-2 block text-gray-300">{lang}</Label>
                                    <Textarea
                                      {...register(`referenceSolution.${idx}.completeCode`)}
                                      rows={8}
                                      className="font-mono text-sm bg-gray-800/50 border-gray-700 text-white"
                                      placeholder={`Complete solution for ${lang}`}
                                    />
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <DrawerFooter className="px-0">
                          <div className="flex justify-end space-x-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="text-gray-300 border-gray-700 hover:bg-gray-700"
                              onClick={() => setIsDrawerOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                'Update Problem'
                              )}
                            </Button>
                          </div>
                        </DrawerFooter>
                      </form>
                    </Tabs>
                  </div>
                </ScrollArea>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default AdminUpdate;
