"use client";

import { Button } from "@/components/ui/button";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

export default function Playground() {
    const [code, setCode] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [chartGenerated, setChartGenerated] = useState(false);
    const [showChartOptions, setShowChartOptions] = useState(false);
    const [selectedChartType, setSelectedChartType] = useState("Flow");
    const [isLoading, setIsLoading] = useState(false);
    const [mermaidCode, setMermaidCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [svgContent, setSvgContent] = useState<string>("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdownButtonRef = useRef<HTMLButtonElement>(null);

    // Map chart types to Mermaid diagram types (use exact syntax prefixes)
    const chartTypeMapping: { [key: string]: string } = {
        "Flow": "flowchart LR",
        "Sequence": "sequenceDiagram",
        "Class": "classDiagram",
        "State": "stateDiagram-v2",
        "ER": "erDiagram",
        "Gantt": "gantt",
        "User Journey": "journey",
        "Pie": "pie title",
        "Mindmap": "mindmap",
        "Block": "graph TD", // Equivalent to flowchart TD
    };

    const chartTypes = Object.keys(chartTypeMapping);

    // Add a sample diagram for demonstration purposes
    const sampleDiagrams: Record<string, string> = {
        Flow: `flowchart LR
        A[Start] --> B{Decision}
        B -->|Yes| C[Process]
        B -->|No| D[End]
        C --> D`,
        Sequence: `sequenceDiagram
        User->>System: Request data
        System->>Database: Query
        Database-->>System: Return results
        System-->>User: Display data`,
        Class: `classDiagram
        class User {
            +String name
            +String email
            +login()
            +logout()
        }
        class Account {
            +Number id
            +Number balance
            +deposit()
            +withdraw()
        }
        User "1" -- "1..*" Account : has`,
        Pie: `pie title Distribution
        "Category A" : 42.5
        "Category B" : 27.8
        "Category C" : 29.7`,
        Mindmap: `mindmap
        root((Main Concept))
            Branch 1
                Sub-topic 1
                Sub-topic 2
            Branch 2
                Sub-topic 3
                Sub-topic 4`
    };

    // Initialize mermaid once on component mount
    useEffect(() => {
        // Initialize visibility
        setIsVisible(true);

        // Initialize mermaid only once
        try {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                securityLevel: 'loose',
                logLevel: 'error',
                flowchart: { useMaxWidth: false, htmlLabels: true },
                er: { useMaxWidth: false },
                sequence: { useMaxWidth: false },
                gantt: { useMaxWidth: false },
                journey: { useMaxWidth: false }
            });
            console.log("Mermaid initialized successfully");
        } catch (error) {
            console.error('Mermaid initialization error:', error);
        }

        // Handle clicks outside dropdown
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                dropdownButtonRef.current &&
                !dropdownButtonRef.current.contains(event.target as Node)
            ) {
                setShowChartOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Separate effect for managing the custom CSS animation
    useEffect(() => {
        // Add custom animation styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
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
        document.head.appendChild(styleElement);

        // Clean up
        return () => {
            if (styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        };
    }, []);

    // Render mermaid diagram when code changes using a safer approach
    useEffect(() => {
        if (!mermaidCode) {
            setSvgContent("");
            return;
        }

        const renderMermaid = async () => {
            try {
                console.log("Rendering mermaid diagram with code:", mermaidCode);

                // Generate SVG string directly without DOM manipulation
                const { svg } = await mermaid.render(`mermaid-${Date.now()}`, mermaidCode);

                // Store the SVG string in state
                setSvgContent(svg);
                setErrorMessage("");
            } catch (error) {
                console.error("Mermaid rendering error:", error);
                setErrorMessage(`Failed to render diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setSvgContent("");
            } finally {
                setIsLoading(false);
            }
        };

        renderMermaid();
    }, [mermaidCode]);

    const selectChartType = (type: string) => {
        setSelectedChartType(type);
        setShowChartOptions(false);

        // Reset chart-related state to ensure fresh generation
        setChartGenerated(false);
        setMermaidCode('');
        setSvgContent('');
        setErrorMessage('');
    };

    // Add function to try a sample directly without using OpenAI
    const trySample = () => {
        try {
            const currentChartType = selectedChartType;
            console.log('==== Trying Sample ====');
            console.log('Current chart type:', currentChartType);

            // Check if we have a sample for this chart type
            const sample = sampleDiagrams[currentChartType];

            if (!sample) {
                setErrorMessage(`No sample available for ${currentChartType} chart type.`);
                return;
            }

            setIsLoading(true);
            setErrorMessage('');
            setMermaidCode(''); // Clear previous mermaid code

            // Add the chart type declaration if it's not already part of the sample
            const formattedSample = sample;
            console.log('Sample code:', formattedSample);

            // Use timeout to simulate API call and avoid UI freezing
            setTimeout(() => {
                setMermaidCode(formattedSample);
                setChartGenerated(true);
                setIsLoading(false);
            }, 100);
        } catch (error) {
            console.error('Error in trySample:', error);
            setErrorMessage('Failed to load sample diagram');
            setIsLoading(false);
        }
    };

    const downloadSVG = () => {
        if (!svgContent) return;

        try {
            // Create a blob from the SVG content
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);

            // Create a download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedChartType.toLowerCase().replace(' ', '-')}-chart.svg`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading SVG:', error);
            setErrorMessage('Failed to download chart');
        }
    };

    const toggleChartOptions = () => {
        setShowChartOptions(!showChartOptions);
    };

    const handleGenerateChart = async () => {
        if (!code.trim()) {
            setErrorMessage('Please enter some code or description first.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setMermaidCode(''); // Clear previous mermaid code
        setSvgContent(''); // Clear previous SVG

        try {
            const currentChartType = selectedChartType;
            const mappedChartType = chartTypeMapping[currentChartType] || 'flowchart LR';

            // Log detailed information about the chart type being used
            console.log('==== Generating Chart ====');
            console.log('Selected chart type:', currentChartType);
            console.log('Mapped chart type:', mappedChartType);

            // Call the API to generate Mermaid code
            const response = await fetch('/api/generate-mermaid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    chartType: mappedChartType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate chart');
            }

            console.log("Received mermaid code:", data.mermaidCode);

            // Set the mermaid code - the useEffect will handle rendering
            setMermaidCode(data.mermaidCode);
            setChartGenerated(true);
        } catch (error) {
            console.error('Error generating chart:', error);
            setErrorMessage((error as Error).message || 'Failed to generate chart. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto py-12 px-4 max-w-7xl">
                <h1 className="text-3xl font-bold mb-6 tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-green-300 bg-clip-text text-transparent drop-shadow-md">
                        ChartAI
                    </span> Playground
                </h1>

                <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/20 overflow-hidden shadow-xl shadow-cyan-500/5 p-0.5 mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 h-full">
                        {/* Code Editor Section */}
                        <div className="bg-black/60 p-6 relative flex flex-col h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 z-0"></div>
                            <div className="mb-5 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="mr-4 w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <h2 className="text-sm font-medium text-cyan-300 uppercase tracking-wide">Code</h2>
                                    </div>

                                    <div className="relative z-10">
                                        <button
                                            ref={dropdownButtonRef}
                                            className="bg-black/70 hover:bg-black/90 p-2 rounded-lg border border-cyan-500/40 transition-all duration-200 flex items-center gap-1"
                                            onClick={toggleChartOptions}
                                        >
                                            <span className="text-cyan-400 text-sm">{selectedChartType}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 text-cyan-400 transition-transform duration-200 ${showChartOptions ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown menu positioned relative */}
                                        {showChartOptions && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute right-0 mt-1 w-48 bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/20 py-1 z-100 max-h-[300px] overflow-y-auto"
                                                style={{
                                                    boxShadow: '0 0 15px rgba(8, 145, 178, 0.4)'
                                                }}
                                            >
                                                <div className="py-1 text-xs text-center text-cyan-400 border-b border-cyan-500/20">
                                                    Select Chart Type
                                                </div>
                                                {chartTypes.map((type) => (
                                                    <button
                                                        key={type}
                                                        className={`block w-full text-left px-4 py-2 text-sm ${selectedChartType === type
                                                            ? 'text-cyan-400 bg-cyan-900/30 font-medium'
                                                            : 'text-gray-300 hover:bg-cyan-900/20 hover:text-cyan-300'
                                                            }`}
                                                        onClick={() => selectChartType(type)}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            <textarea
                                className="w-full h-[calc(100vh-280px)] bg-black/80 rounded-lg p-5 text-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/30 border border-cyan-500/20 relative"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={`Enter your code or describe what you want to visualize...\n\nExample for ${selectedChartType} chart:\n${sampleDiagrams[selectedChartType] ||
                                    'Describe your data or process flow...'
                                    }`}
                                style={{ lineHeight: "1.6" }}
                            />

                            <div className="mt-5 flex justify-end items-center gap-3 relative z-10">
                                <button
                                    className="bg-black/70 hover:bg-black/90 text-cyan-400 p-2 rounded-lg border border-cyan-500/40 transition-all duration-200 text-sm"
                                    onClick={trySample}
                                >
                                    Try Sample
                                </button>

                                <Button
                                    className={`bg-gradient-to-r from-cyan-600 to-green-500 hover:from-cyan-500 hover:to-green-400 text-white font-medium rounded-xl py-2 px-6 text-sm transition-all duration-200 shadow-lg shadow-cyan-500/30 border border-cyan-400/20 motion-safe:hover:animate-pulse ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    onClick={handleGenerateChart}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Generating...' : 'Generate Chart'}
                                </Button>
                            </div>
                        </div>

                        {/* Chart Display Section */}
                        <div className="bg-black/60 p-6 relative flex flex-col h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 z-0"></div>
                            <div className="mb-5 flex items-center relative z-10">
                                <div className="flex items-center">
                                    <div className="mr-4 w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-sm font-medium text-cyan-300 uppercase tracking-wide">Visualization</h2>
                                </div>

                                {chartGenerated && svgContent && (
                                    <button
                                        className="bg-black/70 hover:bg-black/90 p-2 rounded-lg border border-cyan-500/40 transition-all duration-200 shadow-lg shadow-cyan-500/20 ml-auto"
                                        title="Download Chart"
                                        onClick={downloadSVG}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="bg-black/80 rounded-lg h-[calc(100vh-280px)] flex flex-col items-center justify-center border border-cyan-500/20 p-4 relative overflow-hidden">
                                {errorMessage && (
                                    <div className="bg-red-900/30 text-red-300 p-3 rounded-md mb-4 text-sm w-full">
                                        <div className="flex items-start">
                                            <div className="mr-3 flex-shrink-0 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-red-300 mb-1">Error rendering chart</p>
                                                <p className="text-red-300/90 whitespace-pre-wrap">{errorMessage}</p>
                                                <p className="text-red-300/70 mt-2 text-xs">
                                                    Try adjusting your input or selecting a different chart type.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!chartGenerated || !svgContent ? (
                                    <div className="text-center px-10 relative z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-cyan-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                        <p className="text-gray-400 text-sm">Your visualization will appear here</p>
                                        <p className="text-gray-600 text-xs mt-2">Generate a chart from your code to see results</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-full overflow-auto p-3 flex items-center justify-center">
                                        {isLoading ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="relative w-12 h-12 mb-4">
                                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-cyan-500/20 rounded-full"></div>
                                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
                                                </div>
                                                <p className="text-cyan-400 text-sm">Generating {selectedChartType} chart...</p>
                                            </div>
                                        ) : (
                                            <div
                                                className="mermaid-svg-container w-full h-full flex items-center justify-center"
                                                dangerouslySetInnerHTML={{ __html: svgContent }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}