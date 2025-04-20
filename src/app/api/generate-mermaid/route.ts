import { generateMermaidCode } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { code, chartType } = await request.json();

        console.log("code =============", code);
        console.log("chartType =============", chartType);

        if (!code || !chartType) {
            return NextResponse.json(
                { error: 'Code and chart type are required' },
                { status: 400 }
            );
        }

        let mermaidCode = await generateMermaidCode(code, chartType);

        // Clean up the mermaid code to ensure it doesn't have markdown backticks
        mermaidCode = mermaidCode.replace(/^```mermaid\s*\n?/, '').replace(/\n?```$/, '');

        // Make sure chart type is included in the first line if not already
        const firstLine = mermaidCode.trim().split('\n')[0].toLowerCase();
        const chartTypeFirstWord = chartType.split(' ')[0].toLowerCase();

        // If the mermaid code doesn't start with the right chart type, prepend it
        if (!firstLine.startsWith(chartTypeFirstWord)) {
            mermaidCode = `${chartType}\n${mermaidCode}`;
        }

        console.log("Generated Mermaid code:", mermaidCode);

        return NextResponse.json({ mermaidCode });
    } catch (error) {
        console.error('Error in generate-mermaid API:', error);
        return NextResponse.json(
            { error: 'Failed to generate Mermaid code' },
            { status: 500 }
        );
    }
} 