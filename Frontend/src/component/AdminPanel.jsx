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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Loader2 } from 'lucide-react';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
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
  // const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create New Problem</CardTitle>
          <CardDescription>
            Fill out all required fields to create a new coding problem
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Problem title"
                    error={errors.title?.message}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Detailed problem description"
                    className="min-h-[120px]"
                    error={errors.description?.message}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select {...register('difficulty')}>
                      <SelectTrigger error={errors.difficulty?.message}>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.difficulty && (
                      <p className="text-destructive text-sm">{errors.difficulty.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Category *</Label>
                    <Select {...register('tags')}>
                      <SelectTrigger error={errors.tags?.message}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="array">Array</SelectItem>
                        <SelectItem value="linkedList">Linked List</SelectItem>
                        <SelectItem value="graph">Graph</SelectItem>
                        <SelectItem value="dp">Dynamic Programming</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tags && (
                      <p className="text-destructive text-sm">{errors.tags.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Test Cases</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Visible
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
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
                    <h3 className="font-medium">Visible Test Cases</h3>
                    <span className="text-muted-foreground text-sm ml-2">
                      (Shown to users)
                    </span>
                  </div>
                  
                  {errors.visibleTestCases?.message && (
                    <p className="text-destructive text-sm">
                      {errors.visibleTestCases.message}
                    </p>
                  )}
                  
                  <div className="space-y-4">
                    {visibleFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">
                            Test Case #{index + 1}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVisible(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Input *</Label>
                          <Textarea
                            {...register(`visibleTestCases.${index}.input`)}
                            placeholder="Input value"
                            className="font-mono text-sm"
                          />
                          {errors.visibleTestCases?.[index]?.input && (
                            <p className="text-destructive text-sm">
                              {errors.visibleTestCases[index].input.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Output *</Label>
                          <Input
                            {...register(`visibleTestCases.${index}.output`)}
                            placeholder="Expected output"
                            className="font-mono"
                          />
                          {errors.visibleTestCases?.[index]?.output && (
                            <p className="text-destructive text-sm">
                              {errors.visibleTestCases[index].output.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Explanation *</Label>
                          <Textarea
                            {...register(`visibleTestCases.${index}.explanation`)}
                            placeholder="Explanation for users"
                          />
                          {errors.visibleTestCases?.[index]?.explanation && (
                            <p className="text-destructive text-sm">
                              {errors.visibleTestCases[index].explanation.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hidden Test Cases */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="font-medium">Hidden Test Cases</h3>
                    <span className="text-muted-foreground text-sm ml-2">
                      (Used for evaluation)
                    </span>
                  </div>
                  
                  {errors.hiddenTestCases?.message && (
                    <p className="text-destructive text-sm">
                      {errors.hiddenTestCases.message}
                    </p>
                  )}
                  
                  <div className="space-y-4">
                    {hiddenFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">
                            Test Case #{index + 1}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHidden(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Input *</Label>
                          <Textarea
                            {...register(`hiddenTestCases.${index}.input`)}
                            placeholder="Input value"
                            className="font-mono text-sm"
                          />
                          {errors.hiddenTestCases?.[index]?.input && (
                            <p className="text-destructive text-sm">
                              {errors.hiddenTestCases[index].input.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Output *</Label>
                          <Input
                            {...register(`hiddenTestCases.${index}.output`)}
                            placeholder="Expected output"
                            className="font-mono"
                          />
                          {errors.hiddenTestCases?.[index]?.output && (
                            <p className="text-destructive text-sm">
                              {errors.hiddenTestCases[index].output.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Code Templates</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['C++', 'Java', 'JavaScript'].map((language, index) => (
                    <Card key={language} className="bg-muted/50">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">{language}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Initial Code *</Label>
                          <div className="relative">
                            <Textarea
                              {...register(`startCode.${index}.initialCode`)}
                              className="font-mono text-sm h-32"
                              placeholder={`${language} starter code`}
                            />
                            {errors.startCode?.[index]?.initialCode && (
                              <p className="text-destructive text-sm mt-1">
                                {errors.startCode[index].initialCode.message}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Reference Solution *</Label>
                          <div className="relative">
                            <Textarea
                              {...register(`referenceSolution.${index}.completeCode`)}
                              className="font-mono text-sm h-32"
                              placeholder={`${language} solution`}
                            />
                            {errors.referenceSolution?.[index]?.completeCode && (
                              <p className="text-destructive text-sm mt-1">
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
                  <p className="text-destructive text-sm">{errors.startCode.message}</p>
                )}
                {errors.referenceSolution?.message && (
                  <p className="text-destructive text-sm">{errors.referenceSolution.message}</p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : "Create Problem"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPanel;