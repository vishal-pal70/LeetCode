import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../chatSlice';
import { Send } from 'lucide-react';
import {
  Card, CardContent, CardFooter, CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ChatAi({ problem }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const messagesContainerRef = useRef(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.ai.messages);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [currentMessageId, setCurrentMessageId] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 30);
    return () => clearTimeout(timeout);
  }, [messages, streamingResponse]);

  useEffect(() => {
    if (!isStreaming || !currentMessageId) return;

    const lastMessage = messages.find(msg => msg.id === currentMessageId);
    if (!lastMessage) return;

    const fullText = lastMessage.parts[0].text;

    if (currentStreamIndex < fullText.length) {
      const timer = setTimeout(() => {
        setStreamingResponse(fullText.substring(0, currentStreamIndex + 1));
        setCurrentStreamIndex(currentStreamIndex + 1);
        scrollToBottom();
      }, 10);

      return () => clearTimeout(timer);
    } else {
      setIsStreaming(false);
      setStreamingResponse("");
      setCurrentStreamIndex(0);
    }
  }, [isStreaming, currentStreamIndex, messages, currentMessageId]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        container.scrollTop = container.scrollHeight;
      });
    }
  };

  const onSubmit = async (data) => {
    const userMessage = {
      role: 'user',
      parts: [{ text: data.message }],
      id: Date.now()
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
        id: Date.now()
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
    <Card className="flex flex-col h-full max-h-[80vh] min-h-[500px] w-full border-0 bg-gray-900 text-gray-100 shadow-lg overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-gray-800">
              <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-indigo-500 text-white font-bold">AI</AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">Code Assistant</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-indigo-900/50 text-indigo-300 border-indigo-700 truncate max-w-[160px]">
                Problem: {problem.title}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-emerald-900/50 text-emerald-300 border-emerald-700">
                {isStreaming ? "Typing..." : "Online"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-hidden bg-gray-900" style={{ height: "100%", maxHeight: "calc(100vh - 200px)" }}>
        <div
          ref={messagesContainerRef}
          className="h-[calc(100vh-300px)] w-full overflow-y-auto scroll-smooth px-4"
        >
          <div className="flex flex-col space-y-4 py-4 mb-40">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Send className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-100">How can I help you today?</h3>
                <p className="text-gray-400 max-w-md mt-2">
                  Ask me anything about the problem, code structure, or request help with debugging.
                </p>
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
                          <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/ai-avatar.png" alt="AI" />
                          <AvatarFallback className="bg-indigo-600 text-white">AI</AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div
                      className={`p-4 rounded-2xl max-w-full break-words ${msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-800 text-gray-100 rounded-tl-none"
                        }`}
                    >
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
          </div>
        </div>
      </CardContent>

      <Separator className="mt-auto bg-gray-800" />

      <CardFooter className="p-4 bg-gray-800/50">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask me anything about the problem..."
              className="flex-1 py-5 px-4 rounded-xl bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
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
                    className="h-11 w-11 rounded-xl flex-shrink-0 bg-blue-600 hover:bg-blue-700"
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
                <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {errors.message && (
            <p className="text-red-400 text-sm mt-2 ml-1">{errors.message.message}</p>
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

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </Card>
  );
}

export default ChatAi;

