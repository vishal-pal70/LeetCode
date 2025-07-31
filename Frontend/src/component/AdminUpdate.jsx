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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/15 p-4 rounded-md border border-destructive max-w-4xl mx-auto my-4">
        <div className="flex items-center gap-2 text-destructive">
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
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problems Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage coding problems and their test cases
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problems List</CardTitle>
          <CardDescription>
            All available coding problems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/12">#</TableHead>
                  <TableHead className="w-4/12">Title</TableHead>
                  <TableHead className="w-2/12">Difficulty</TableHead>
                  <TableHead className="w-2/12">Tags</TableHead>
                  <TableHead className="w-2/12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((problem, index) => (
                  <TableRow key={problem._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{problem.title}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          problem.difficulty.toLowerCase() === 'easy' ? 'success' : 
                          problem.difficulty.toLowerCase() === 'medium' ? 'warning' : 'destructive'
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary">
                        {problem.tags}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[85vh] max-w-4xl mx-auto">
          <div className="mx-auto w-full">
            <DrawerHeader>
              <div className="flex justify-between items-center">
                <DrawerTitle>Update Problem</DrawerTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DrawerDescription>
                Edit problem details and test cases
              </DrawerDescription>
            </DrawerHeader>
            
            {fetchingProblem ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-[calc(85vh-180px)]">
                <div className="p-6">
                  <Tabs defaultValue="problem" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="problem">Problem</TabsTrigger>
                      <TabsTrigger value="testCases">Test Cases</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                    </TabsList>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                      <TabsContent value="problem">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              {...register('title')}
                              className={errors.title ? 'border-destructive' : ''}
                            />
                            {errors.title && (
                              <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              {...register('description')}
                              className={`min-h-[150px] ${errors.description ? 'border-destructive' : ''}`}
                            />
                            {errors.description && (
                              <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="difficulty">Difficulty</Label>
                              <Select {...register('difficulty')} defaultValue="easy">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="tags">Tags</Label>
                              <Select {...register('tags')} defaultValue="array">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tag" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="array">Array</SelectItem>
                                  <SelectItem value="linkedList">Linked List</SelectItem>
                                  <SelectItem value="graph">Graph</SelectItem>
                                  <SelectItem value="dp">Dynamic Programming</SelectItem>
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
                              <h3 className="font-semibold">Visible Test Cases</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                              >
                                Add Test Case
                              </Button>
                            </div>
                            
                            <div className="space-y-4">
                              {visibleFields.map((field, idx) => (
                                <Card key={field.id} className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">Test Case #{idx + 1}</span>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeVisible(idx)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                      <Label className="text-sm">Input</Label>
                                      <Input
                                        {...register(`visibleTestCases.${idx}.input`)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm">Output</Label>
                                      <Input
                                        {...register(`visibleTestCases.${idx}.output`)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm">Explanation</Label>
                                      <Input
                                        {...register(`visibleTestCases.${idx}.explanation`)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-semibold">Hidden Test Cases</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendHidden({ input: '', output: '' })}
                              >
                                Add Test Case
                              </Button>
                            </div>
                            
                            <div className="space-y-4">
                              {hiddenFields.map((field, idx) => (
                                <Card key={field.id} className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">Test Case #{idx + 1}</span>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeHidden(idx)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-sm">Input</Label>
                                      <Input
                                        {...register(`hiddenTestCases.${idx}.input`)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm">Output</Label>
                                      <Input
                                        {...register(`hiddenTestCases.${idx}.output`)}
                                        className="mt-1"
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
                            <h3 className="font-semibold mb-3">Start Code Templates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {['C++', 'Java', 'JavaScript'].map((lang, idx) => (
                                <Card key={lang} className="p-4">
                                  <Label className="font-medium mb-2 block">{lang}</Label>
                                  <Textarea
                                    {...register(`startCode.${idx}.initialCode`)}
                                    rows={8}
                                    className="font-mono text-sm"
                                    placeholder={`Initial code for ${lang}`}
                                  />
                                </Card>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3">Reference Solutions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {['C++', 'Java', 'JavaScript'].map((lang, idx) => (
                                <Card key={lang} className="p-4">
                                  <Label className="font-medium mb-2 block">{lang}</Label>
                                  <Textarea
                                    {...register(`referenceSolution.${idx}.completeCode`)}
                                    rows={8}
                                    className="font-mono text-sm"
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
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
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
  );
};

export default AdminUpdate;