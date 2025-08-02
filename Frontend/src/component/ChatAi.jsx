import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../chatSlice';
import { Send } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ChatAi({ problem }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.ai.messages);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [currentMessageId, setCurrentMessageId] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingResponse]);

  // Handle streaming effect
  useEffect(() => {
    if (!isStreaming || !currentMessageId) return;

    const lastMessage = messages.find(msg => msg.id === currentMessageId);
    if (!lastMessage) return;

    const fullText = lastMessage.parts[0].text;
    
    if (currentStreamIndex < fullText.length) {
      const timer = setTimeout(() => {
        setStreamingResponse(fullText.substring(0, currentStreamIndex + 1));
        setCurrentStreamIndex(currentStreamIndex + 1);
      }, 10); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timer);
    } else {
      // Streaming completed
      setIsStreaming(false);
      setStreamingResponse("");
      setCurrentStreamIndex(0);
    }
  }, [isStreaming, currentStreamIndex, messages, currentMessageId]);

  const onSubmit = async (data) => {
    const userMessage = { 
      role: 'user', 
      parts: [{ text: data.message }],
      id: Date.now() // Unique ID for each message
    };
    dispatch(addMessage(userMessage));
    reset();

    try {
      setIsStreaming(true);
      const response = await axiosClient.post("/ai/chat", {
        messages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      const modelMessage = {
        role: 'model',
        parts: [{ text: response.data.message }],
        id: Date.now() // Unique ID for each message
      };
      
      dispatch(addMessage(modelMessage));
      setCurrentMessageId(modelMessage.id);
      setStreamingResponse("");
      setCurrentStreamIndex(0);
    } catch (error) {
      console.error("API Error:", error);
      dispatch(addMessage({
        role: 'model',
        parts: [{ text: "Sorry, I'm having trouble responding. Please try again later." }],
        id: Date.now()
      }));
      setIsStreaming(false);
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[80vh] min-h-[500px] w-full border-0 shadow-lg overflow-hidden">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-indigo-500 text-white font-bold">AI</AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">Code Assistant</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 border-indigo-300 truncate max-w-[160px]">
                Problem: {problem.title}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 border-emerald-300">
                {isStreaming ? "Typing..." : "Online"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Send className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">How can I help you today?</h3>
                <p className="text-gray-500 max-w-md mt-2">
                  Ask me anything about the problem, code structure, or request help with debugging.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
                  {[
                    { title: "Explain the problem", example: '"Can you explain the requirements?"' },
                    { title: "Optimize code", example: '"How can I improve this solution?"' },
                    { title: "Debug help", example: '"Why is this test case failing?"' },
                    { title: "Algorithm suggestion", example: '"What approach should I take?"' },
                  ].map((item, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-3 text-sm border border-blue-100">
                      <p className="font-medium text-blue-800 truncate">{item.title}</p>
                      <p className="text-blue-600 mt-1 truncate">{item.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[90%] flex ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={`h-8 w-8 flex-shrink-0 ${msg.role === "user" ? "ml-3" : "mr-3"}`}>
                      {msg.role === "user" ? (
                        <>
                          <AvatarImage src="/user-avatar.png" alt="User" />
                          <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/ai-avatar.png" alt="AI" />
                          <AvatarFallback className="bg-indigo-500 text-white">AI</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    
                    <div 
                      className={`p-4 rounded-2xl max-w-full break-words ${
                        msg.role === "user" 
                          ? "bg-blue-500 text-white rounded-tr-none" 
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {/* Show streaming response for the last AI message if it's streaming */}
                      {isStreaming && index === messages.length - 1 && msg.role === "model" ? (
                        <div className="whitespace-pre-wrap">
                          {streamingResponse}
                          {streamingResponse.length < msg.parts[0].text.length && (
                            <span className="ml-1 inline-block w-2 h-4 bg-gray-400 align-middle animate-blink" />
                          )}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.parts[0].text}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </CardContent>
      
      <Separator className="mt-auto" />
      
      <CardFooter className="p-4 bg-muted/50">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask me anything about the problem..."
              className="flex-1 py-5 px-4 rounded-xl"
              disabled={isSubmitting || isStreaming}
              {...register("message", { 
                required: "Message cannot be empty", 
                minLength: {
                  value: 2,
                  message: "Message must be at least 2 characters"
                }
              })}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit" 
                    size="icon"
                    className="h-11 w-11 rounded-xl flex-shrink-0"
                    disabled={isSubmitting || isStreaming || !!errors.message}
                  >
                    {isSubmitting || isStreaming ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {errors.message && (
            <p className="text-red-500 text-sm mt-2 ml-1">{errors.message.message}</p>
          )}
        </form>
      </CardFooter>
      
      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </Card>
  );
}

export default ChatAi;
