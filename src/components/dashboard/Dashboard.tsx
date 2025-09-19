"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MessageCircle,
  Plus,
  Search,
  Moon,
  Sun,
  Trash2,
  LogOut,
  Sparkles,
  MoreVertical,
  Menu,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { useThemeStore } from "@/stores/theme";
import { chatroomSchema, ChatroomFormData } from "@/lib/validations";
import { formatDateTime, debounce } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ChatInterface from "@/components/chat/ChatInterface";

export default function Dashboard() {
  const router = useRouter();
  const [showNewChatroomForm, setShowNewChatroomForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isCreatingChatroom, setIsCreatingChatroom] = useState(false);

  const { user, logout } = useAuthStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const {
    chatrooms,
    currentChatroomId,
    searchQuery,
    addChatroom,
    deleteChatroom,
    setCurrentChatroom,
    setSearchQuery,
  } = useChatStore();

  // New chatroom form
  const form = useForm<ChatroomFormData>({
    resolver: zodResolver(chatroomSchema),
    defaultValues: {
      title: "",
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push("/auth");
    }
  }, [user, router]);

  // Debounced search
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  // Filter chatrooms based on search
  const filteredChatrooms = chatrooms.filter((chatroom) =>
    chatroom.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChatroom = async (data: ChatroomFormData) => {
    setIsCreatingChatroom(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      addChatroom(data.title.trim());
      form.reset();
      setShowNewChatroomForm(false);
      toast.success("Chatroom created successfully!", {
        description: `"${data.title}" is ready for conversations`,
      });
    } catch (error) {
      toast.error("Failed to create chatroom");
    } finally {
      setIsCreatingChatroom(false);
    }
  };

  const handleDeleteChatroom = async (chatroomId: string, title: string) => {
    if (chatrooms.length <= 1) {
      toast.error("Cannot delete the last chatroom");
      return;
    }

    // Confirmation toast with action
    toast.info(`Delete "${title}"?`, {
      description: "This action cannot be undone",
      action: {
        label: "Delete",
        onClick: () => {
          deleteChatroom(chatroomId);
          toast.success("Chatroom deleted successfully!");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleLogout = () => {
    toast.info("Are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: () => {
          logout();
          toast.success("Logged out successfully!");
          router.push("/");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  if (!user?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative w-80 h-full transition-transform duration-300 z-30 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } border-r flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gemini
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2"
                  title="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="p-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-gray-100 border-gray-200 placeholder-gray-500 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={() => setShowNewChatroomForm(!showNewChatroomForm)}
              className="w-full"
              disabled={isCreatingChatroom}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* New Chatroom Form */}
          {showNewChatroomForm && (
            <div className="px-4 pb-4">
              <form
                onSubmit={form.handleSubmit(handleCreateChatroom)}
                className="space-y-3"
              >
                <Input
                  placeholder="Enter chatroom title..."
                  {...form.register("title")}
                  error={form.formState.errors.title?.message}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isCreatingChatroom}
                    disabled={!form.watch("title")?.trim()}
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowNewChatroomForm(false);
                      form.reset();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery && filteredChatrooms.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No chats found for "{searchQuery}"
                </p>
              </div>
            ) : (
              filteredChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  className={`group relative cursor-pointer border-b transition-colors ${
                    currentChatroomId === chatroom.id
                      ? isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-blue-50 border-gray-200"
                      : isDark
                      ? "hover:bg-gray-700 border-gray-700"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    onClick={() => {
                      setCurrentChatroom(chatroom.id);
                      setShowMobileMenu(false);
                    }}
                    className="p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDark ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate pr-2">
                            {chatroom.title}
                          </h3>
                          <span
                            className={`text-xs flex-shrink-0 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {chatroom.createdAt
                              ? formatDateTime(new Date(chatroom.createdAt))
                              : "—"}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {chatroom.lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChatroom(chatroom.id, chatroom.title);
                    }}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-gray-900/20"
                    title="Delete chatroom"
                  >
                    <Trash2 className="w-10 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {currentChatroomId && (
                <>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      {chatrooms.find((c) => c.id === currentChatroomId)
                        ?.title || "Chat"}
                    </h2>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      AI assistant • Online
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Chat Interface */}
          {currentChatroomId ? (
            <ChatInterface chatroomId={currentChatroomId} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Welcome to Gemini Clone
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Select a chatroom or create a new one to start your AI
                  conversation
                </p>
                <Button onClick={() => setShowNewChatroomForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
