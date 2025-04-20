"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/60 relative border-b-1 border-cyan-500/20 ">
            <div className="absolute bottom-0 left-[1%] w-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/100 to-transparent"></div>
            <div className="absolute bottom-0 left-[3%] w-1/6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/100 to-transparent "></div>
            <div className="container mx-auto flex h-16 items-center justify-between px-4 ">
                <div className="flex items-center gap-10 relative ">
                    <div className="absolute bottom-[-1px] left-[28px] w-8 h-8 bg-cyan-500/20 blur-[8px] rounded-full"></div>
                    <Link href="/" className="flex items-center gap-2 relative z-10 ">
                        <svg
                            viewBox="0 0 24 24"
                            width="28"
                            height="28"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-cyan-400"
                        >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                            <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                            <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        <span className="text-xl font-bold text-white">ChartAI</span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {/* <div className="relative">
                            <button
                                className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1"
                                onClick={() => setProductsOpen(!productsOpen)}
                            >
                                Features
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${productsOpen ? "rotate-180" : ""}`}>
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {productsOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden backdrop-blur-xl bg-black/60 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                                    <div className="p-2">
                                        <Link href="/one-click" className="block px-4 py-2 text-gray-300 hover:bg-cyan-950/30 hover:text-cyan-300 rounded-lg">
                                            One-Click Generation
                                        </Link>
                                        <Link href="/diagram-types" className="block px-4 py-2 text-gray-300 hover:bg-cyan-950/30 hover:text-cyan-300 rounded-lg">
                                            Diagram Types
                                        </Link>
                                        <Link href="/ai-analysis" className="block px-4 py-2 text-gray-300 hover:bg-cyan-950/30 hover:text-cyan-300 rounded-lg">
                                            AI-Powered Analysis
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">
                            How It Works
                        </Link>

                        <div className="relative">
                            <button
                                className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1"
                                onClick={() => setDocsOpen(!docsOpen)}
                            >
                                Resources
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${docsOpen ? "rotate-180" : ""}`}>
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {docsOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden backdrop-blur-xl bg-black/60 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                                    <div className="p-2">
                                        <Link href="/guides" className="block px-4 py-2 text-gray-300 hover:bg-cyan-950/30 hover:text-cyan-300 rounded-lg">
                                            Quick Start Guide
                                        </Link>
                                        <Link href="/api" className="block px-4 py-2 text-gray-300 hover:bg-cyan-950/30 hover:text-cyan-300 rounded-lg">
                                            API Reference
                                        </Link>
                                        <Link href="/examples" className="block px-4 py-2 text-gray-300 hover:bg-cyan-950/30 hover:text-cyan-300 rounded-lg">
                                            Examples
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div> */}

                        {/* <Link href="/pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">
                            Pricing
                        </Link> */}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* <Link href="/login" className="text-cyan-400 hover:text-cyan-300 hidden md:block">
                        Log in
                    </Link> */}
                    <Link href="/playground">
                        <Button
                            className="bg-gradient-to-r from-cyan-600 to-green-500 hover:from-cyan-500 hover:to-green-400 text-white rounded-xl shadow-lg shadow-cyan-500/20 border border-cyan-400/20 motion-safe:hover:animate-pulse"
                        >
                            Try It Now
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
} 