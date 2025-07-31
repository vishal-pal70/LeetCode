import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.enum(['array', 'linkedList', 'graph', 'dp'])).min(1, 'At least one tag is required'),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      tags: [],
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      
      toast({
        title: "Problem Created",
        description: "Your problem has been successfully created",
        duration: 3000,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center p-6 border-b border-gray-800"
      >
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-400">Create and manage coding problems</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 max-w-5xl"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
                Create New Problem
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill out all required fields to create a new coding problem
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-300">Title *</Label>
                        <Input
                          id="title"
                          {...register('title')}
                          placeholder="Problem title"
                          className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
                          error={errors.title?.message}
                        />
                        {errors.title && (
                          <p className="text-red-400 text-sm">{errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">Description *</Label>
                        <Textarea
                          id="description"
                          {...register('description')}
                          placeholder="Detailed problem description"
                          className="min-h-[120px] bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
                          error={errors.description?.message}
                        />
                        {errors.description && (
                          <p className="text-red-400 text-sm">{errors.description.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="difficulty" className="text-gray-300">Difficulty *</Label>
                          <Select {...register('difficulty')}>
                            <SelectTrigger 
                              className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
                              error={errors.difficulty?.message}
                            >
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="easy" className="hover:bg-gray-700">
                                <span className="flex items-center">
                                  <span className={`w-3 h-3 rounded-full ${getDifficultyColor('easy')} mr-2`}></span>
                                  Easy
                                </span>
                              </SelectItem>
                              <SelectItem value="medium" className="hover:bg-gray-700">
                                <span className="flex items-center">
                                  <span className={`w-3 h-3 rounded-full ${getDifficultyColor('medium')} mr-2`}></span>
                                  Medium
                                </span>
                              </SelectItem>
                              <SelectItem value="hard" className="hover:bg-gray-700">
                                <span className="flex items-center">
                                  <span className={`w-3 h-3 rounded-full ${getDifficultyColor('hard')} mr-2`}></span>
                                  Hard
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.difficulty && (
                            <p className="text-red-400 text-sm">{errors.difficulty.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags" className="text-gray-300">Category *</Label>
                          <Select 
                            {...register('tags')}
                            onValueChange={(value) => {
                              const currentTags = control._formValues.tags || [];
                              if (!currentTags.includes(value)) {
                                control._formValues.tags = [...currentTags, value];
                              }
                            }}
                          >
                            <SelectTrigger 
                              className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
                              error={errors.tags?.message}
                            >
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="array" className="hover:bg-gray-700">Array</SelectItem>
                              <SelectItem value="linkedList" className="hover:bg-gray-700">Linked List</SelectItem>
                              <SelectItem value="graph" className="hover:bg-gray-700">Graph</SelectItem>
                              <SelectItem value="dp" className="hover:bg-gray-700">Dynamic Programming</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {control._formValues.tags?.map((tag, index) => (
                              <div 
                                key={index} 
                                className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded text-xs flex items-center"
                              >
                                {tag}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    control._formValues.tags = control._formValues.tags.filter(t => t !== tag);
                                  }}
                                  className="ml-2 text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          {errors.tags && (
                            <p className="text-red-400 text-sm">{errors.tags.message}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Test Cases */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                          Test Cases
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white cursor-pointer"
                            onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Visible
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white cursor-pointer"
                            onClick={() => appendHidden({ input: '', output: '' })}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Hidden
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-8">
                      {/* Visible Test Cases */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-300">Visible Test Cases</h3>
                          <span className="text-gray-500 text-sm ml-2">
                            (Shown to users)
                          </span>
                        </div>
                        
                        {errors.visibleTestCases?.message && (
                          <p className="text-red-400 text-sm">
                            {errors.visibleTestCases.message}
                          </p>
                        )}
                        
                        <div className="space-y-4">
                          {visibleFields.map((field, index) => (
                            <motion.div 
                              key={field.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-700 rounded-lg p-4 space-y-3 bg-gray-800/30"
                            >
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-gray-300">
                                  Test Case #{index + 1}
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-400 hover:bg-red-500/20"
                                  onClick={() => removeVisible(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300">Input *</Label>
                                <Textarea
                                  {...register(`visibleTestCases.${index}.input`)}
                                  placeholder="Input value"
                                  className="font-mono text-sm h-20 bg-gray-800 border-gray-700 text-white"
                                />
                                {errors.visibleTestCases?.[index]?.input && (
                                  <p className="text-red-400 text-sm">
                                    {errors.visibleTestCases[index].input.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300">Output *</Label>
                                <Input
                                  {...register(`visibleTestCases.${index}.output`)}
                                  placeholder="Expected output"
                                  className="font-mono bg-gray-800 border-gray-700 text-white"
                                />
                                {errors.visibleTestCases?.[index]?.output && (
                                  <p className="text-red-400 text-sm">
                                    {errors.visibleTestCases[index].output.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300">Explanation *</Label>
                                <Textarea
                                  {...register(`visibleTestCases.${index}.explanation`)}
                                  placeholder="Explanation for users"
                                  className="bg-gray-800 border-gray-700 text-white"
                                />
                                {errors.visibleTestCases?.[index]?.explanation && (
                                  <p className="text-red-400 text-sm">
                                    {errors.visibleTestCases[index].explanation.message}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Hidden Test Cases */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-300">Hidden Test Cases</h3>
                          <span className="text-gray-500 text-sm ml-2">
                            (Used for evaluation)
                          </span>
                        </div>
                        
                        {errors.hiddenTestCases?.message && (
                          <p className="text-red-400 text-sm">
                            {errors.hiddenTestCases.message}
                          </p>
                        )}
                        
                        <div className="space-y-4">
                          {hiddenFields.map((field, index) => (
                            <motion.div 
                              key={field.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-700 rounded-lg p-4 space-y-3 bg-gray-800/30"
                            >
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-gray-300">
                                  Test Case #{index + 1}
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-400 hover:bg-red-500/20"
                                  onClick={() => removeHidden(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300">Input *</Label>
                                <Textarea
                                  {...register(`hiddenTestCases.${index}.input`)}
                                  placeholder="Input value"
                                  className="font-mono text-sm h-20 bg-gray-800 border-gray-700 text-white"
                                />
                                {errors.hiddenTestCases?.[index]?.input && (
                                  <p className="text-red-400 text-sm">
                                    {errors.hiddenTestCases[index].input.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300">Output *</Label>
                                <Input
                                  {...register(`hiddenTestCases.${index}.output`)}
                                  placeholder="Expected output"
                                  className="font-mono bg-gray-800 border-gray-700 text-white"
                                />
                                {errors.hiddenTestCases?.[index]?.output && (
                                  <p className="text-red-400 text-sm">
                                    {errors.hiddenTestCases[index].output.message}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Code Templates */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                        Code Templates
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['C++', 'Java', 'JavaScript'].map((language, index) => (
                          <Card 
                            key={language} 
                            className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700"
                          >
                            <CardHeader className="py-3">
                              <CardTitle className="text-lg text-gray-300">{language}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-gray-300">Initial Code *</Label>
                                <div className="relative">
                                  <Textarea
                                    {...register(`startCode.${index}.initialCode`)}
                                    className="font-mono text-sm h-32 bg-gray-800 border-gray-700 text-white"
                                    placeholder={`${language} starter code`}
                                  />
                                  {errors.startCode?.[index]?.initialCode && (
                                    <p className="text-red-400 text-sm mt-1">
                                      {errors.startCode[index].initialCode.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300">Reference Solution *</Label>
                                <div className="relative">
                                  <Textarea
                                    {...register(`referenceSolution.${index}.completeCode`)}
                                    className="font-mono text-sm h-32 bg-gray-800 border-gray-700 text-white"
                                    placeholder={`${language} solution`}
                                  />
                                  {errors.referenceSolution?.[index]?.completeCode && (
                                    <p className="text-red-400 text-sm mt-1">
                                      {errors.referenceSolution[index].completeCode.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {errors.startCode?.message && (
                        <p className="text-red-400 text-sm">{errors.startCode.message}</p>
                      )}
                      {errors.referenceSolution?.message && (
                        <p className="text-red-400 text-sm">{errors.referenceSolution.message}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end"
                >
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg w-full md:w-auto cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : "Create Problem"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  );
}

export default AdminPanel;
