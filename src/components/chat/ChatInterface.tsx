"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Image as ImageIcon, Copy, X, Check } from "lucide-react";
import { toast } from "sonner";

import { useChatStore } from "@/stores/chat";
import { useThemeStore } from "@/stores/theme";
import { messageSchema, MessageFormData } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Message } from "@/types";

interface ChatInterfaceProps {
  chatroomId: string;
}

export default function ChatInterface({ chatroomId }: ChatInterfaceProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useThemeStore();

  const { chatrooms, isTyping, addMessage, loadMoreMessages } = useChatStore();

  const currentChatroom = chatrooms.find((room) => room.id === chatroomId);
  const messages = currentChatroom?.messages || [];

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping, isScrolledToBottom]);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleSendMessage = async (data: MessageFormData) => {
    const messageContent = data.content.trim();
    if (!messageContent && !selectedImage) return;

    // Add user message
    addMessage(chatroomId, {
      content: messageContent,
      isUser: true,
      image: selectedImage || undefined,
    });

    // Reset form and image
    form.reset();
    setSelectedImage(null);

    // Show success toast
    toast.success("Message sent!");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      toast.success("Image selected!");
    };
    reader.readAsDataURL(file);
  };

  const handleCopyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      toast.success("Message copied to clipboard!");

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSendMessage)();
    }
  };

  if (!currentChatroom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Select a chatroom to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            } group`}
          >
            <div
              className={`max-w-xs lg:max-w-md relative ${
                message.isUser ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl relative ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900 shadow-sm border border-gray-200"
                }`}
              >
                {/* Message Image */}
                {message.image && (
                  <div className="mb-2">
                    <img
                      src={message.image}
                      alt="Uploaded image"
                      className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(message.image, "_blank")}
                    />
                  </div>
                )}

                {/* Message Content */}
                {message.content && (
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}

                {/* Timestamp */}
                <div
                  className={`text-xs mt-1 ${
                    message.isUser
                      ? "text-blue-100"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp
                    ? formatDate(new Date(message.timestamp))
                    : "—"}
                </div>

                {/* Copy button */}
                <button
                  onClick={() => handleCopyMessage(message)}
                  className={`absolute -top-2 ${
                    message.isUser ? "-left-2" : "-right-2"
                  } 
                    opacity-0 group-hover:opacity-100 transition-opacity p-1 
                    bg-gray-600 hover:bg-gray-500 text-white rounded-full z-10`}
                  title="Copy message"
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className={`px-4 py-3 rounded-2xl ${
                isDark
                  ? "bg-gray-700"
                  : "bg-white shadow-sm border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  Gemini is typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div
          className={`p-4 border-t ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected image"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Image selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Click send to share this image
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div
        className={`p-4 border-t ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <form
          onSubmit={form.handleSubmit(handleSendMessage)}
          className="flex items-end gap-3"
        >
          {/* File upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Message input */}
          <div className="flex-1">
            <textarea
              {...form.register("content")}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className={`w-full px-4 py-3 rounded-xl border resize-none transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 placeholder-gray-500 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
            {form.formState.errors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          {/* Send button */}
          <Button
            type="submit"
            disabled={!form.watch("content")?.trim() && !selectedImage}
            className="p-3 rounded-xl"
            title="Send message (Enter)"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>

        {/* Keyboard shortcut hint */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
