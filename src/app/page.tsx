"use client";

import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { Navbar } from "@/components/ui/navbar";
import { useEffect, useState } from 'react';

// Animated code block component
const AnimatedCodeBlock = () => {
  const [codeLines] = useState([
    { text: "function visualizeCode(code) {", color: "text-cyan-400", delay: "0s" },
    { text: "  const analysis = AI.analyze(code);", color: "text-green-400", delay: "0.4s" },
    { text: "  return createDiagram(analysis);", color: "text-cyan-400", delay: "0.8s" },
    { text: "}", color: "text-cyan-400", delay: "1.2s" },
    { text: "", color: "", delay: "1.6s" },
    { text: "// Transform complex code into diagrams", color: "text-gray-500", delay: "2.0s" },
    { text: "const diagram = visualizeCode(userCode);", color: "text-green-400", delay: "2.4s" },
    { text: "render(diagram);", color: "text-cyan-300", delay: "2.8s" }
  ]);

  return (
    <div className="backdrop-blur-md bg-black/40 rounded-2xl p-6 font-mono text-sm shadow-xl border border-cyan-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 z-0"></div>
      <div className="relative z-10">
        <div className="flex mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        {codeLines.map((line, index) => (
          <div
            key={index}
            className={`${line.color} code-line`}
            style={{
              animationDelay: line.delay,
              opacity: 0,
              transform: "translateY(10px)",
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
};

// Floating elements background
const FloatingElements = () => {
  // Using useState to store shapes that will only be generated client-side
  const [shapes, setShapes] = useState<Array<{
    id: number;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
    shape: string;
    color: string;
  }>>([]);

  // Only generate the shapes on the client side
  useEffect(() => {
    const generatedShapes = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 30 + 15,
      delay: Math.random() * 5,
      shape: ["circle", "square", "diamond"][Math.floor(Math.random() * 3)],
      color: [
        "bg-cyan-500/10", "bg-cyan-600/5", "bg-green-500/10",
        "bg-green-600/5", "bg-cyan-500/5", "bg-green-500/5"
      ][Math.floor(Math.random() * 6)]
    }));

    setShapes(generatedShapes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map(shape => (
        <div
          key={shape.id}
          className={`absolute ${shape.color} backdrop-blur-3xl ${shape.shape === "circle" ? "rounded-full" :
            shape.shape === "square" ? "rounded-lg" : "rotate-45"
            }`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            animation: `float ${shape.duration}s infinite ease-in-out`,
            animationDelay: `${shape.delay}s`,
            border: '1px solid rgba(6, 182, 212, 0.1)'
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; filter: blur(3px); }
        25% { transform: translate(-15px, 15px) rotate(5deg); opacity: 0.8; filter: blur(2px); }
        50% { transform: translate(-25px, 25px) rotate(10deg); opacity: 0.6; filter: blur(3px); }
        75% { transform: translate(-15px, 10px) rotate(5deg); opacity: 0.8; filter: blur(2px); }
        100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; filter: blur(3px); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .code-line {
        text-shadow: 0 0 10px rgba(8, 145, 178, 0.6);
      }
      
      button, h1, h2, h3 {
        text-shadow: 0 0 8px rgba(8, 145, 178, 0.4);
      }
      
      @keyframes pulse {
        0%, 100% { 
          box-shadow: 0 0 15px 0 rgba(8, 145, 178, 0.6);
        }
        50% { 
          box-shadow: 0 0 25px 5px rgba(8, 145, 178, 0.8);
        }
      }
      
      .animate-pulse {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <Navbar />

      <div className="relative w-full overflow-hidden" style={{ height: "90vh" }}>
        <FloatingElements />

        <div className={`relative z-10 w-full h-full flex items-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="backdrop-blur-sm bg-black/40 p-8 rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-500/5">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-green-300 bg-clip-text text-transparent drop-shadow-md">
                  Visualize Your Code
                </span>
                <br />
                <Cover className="text-white">Like Never Before</Cover>
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Transform complex code into intuitive visual representations with just one click
              </p>
              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-cyan-600 to-green-500 hover:from-cyan-500 hover:to-green-400 text-white px-6 py-3 rounded-xl text-lg shadow-lg shadow-cyan-500/30 border border-cyan-400/20 motion-safe:hover:animate-pulse" onClick={() => window.location.href = "/playground"}>
                  Try It Now
                </Button>
                <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30 hover:text-cyan-300 px-6 py-3 rounded-xl text-lg backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                  How It Works
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <AnimatedCodeBlock />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-center text-3xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent drop-shadow-md">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="backdrop-blur-md bg-black/40 p-6 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:shadow-cyan-400/30 hover:translate-y-[-5px]">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-cyan-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-cyan-300">One-Click Generation</h3>
            <p className="text-gray-400">Generate diagrams instantly from your code with a single click.</p>
          </div>

          <div className="backdrop-blur-md bg-black/40 p-6 rounded-xl border border-green-500/20 shadow-lg shadow-green-500/5 transition-all duration-300 hover:shadow-green-400/30 hover:translate-y-[-5px]">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-green-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-green-300">Multiple Diagram Types</h3>
            <p className="text-gray-400">Flow charts, UML, dependency graphs, and more to visualize any code.</p>
          </div>

          <div className="backdrop-blur-md bg-black/40 p-6 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:shadow-cyan-400/30 hover:translate-y-[-5px]">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-cyan-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-cyan-300">AI-Powered Analysis</h3>
            <p className="text-gray-400">Our AI understands your code&apos;s structure and highlights key concepts.</p>
          </div>
        </div>

        <div className="mt-16 text-center backdrop-blur-md bg-black/40 p-8 rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-500/5">
          <h2 className="font-bold text-3xl mb-4 bg-gradient-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent drop-shadow-md">Start Visualizing Your Code Today</h2>
          <p className="text-lg mb-6 text-gray-300 max-w-2xl mx-auto">Join thousands of developers who are learning and teaching code more effectively through visual representation.</p>
          <Button className="bg-gradient-to-r from-cyan-600 to-green-500 hover:from-cyan-500 hover:to-green-400 text-white px-8 py-3 text-lg rounded-xl shadow-lg shadow-cyan-500/30 border border-cyan-400/20 motion-safe:hover:animate-pulse" onClick={() => window.location.href = "/playground"}>Get Started For Free</Button>
        </div>

        <footer className="text-center border-t border-cyan-500/10 mt-16 py-6 text-sm text-gray-400">
          <p>© 2023 ChartAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
