"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Sparkles,
  Smartphone,
  Shield,
  Moon,
  Sun,
} from "lucide-react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-blue-500" />
              {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" /> */}
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gemini
            </h1>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-100"
            } shadow-md`}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Google Gemini
            </h2>
            <p
              className={`text-md md:text-2xl mb-8 max-w-3xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              An AI built to understand you, learn with you, and grow alongside
              you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Get Started
              </span>
            </Link>
            <Link
              href="/dashboard"
              className={`px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                isDark
                  ? "border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                  : "border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-lg"
              }`}
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Intelligent Conversations
            </h3>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Chat naturally with AI that understands context and gives accurate
              answers
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Smarter Media Handling
            </h3>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Search, summarize, and create across images, audio, and video
              effortlessly.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Security You Can Trust
            </h3>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Your data stays private and protected with Google’s advanced
              safeguards.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer
          className={`mt-16 pt-8 border-t text-center ${
            isDark
              ? "border-gray-800 text-gray-400"
              : "border-gray-200 text-gray-600"
          }`}
        >
          <p>© 2025 Google Gemini. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
