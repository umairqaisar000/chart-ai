import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Examples for different chart types to help guide the AI
const chartExamples: Record<string, string> = {
    flowchart: `flowchart LR
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]`,

    sequenceDiagram: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts.
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,

    classDiagram: `classDiagram
    Class01 <|-- AveryLongClass : Cool
    Class03 *-- Class04
    Class05 o-- Class06
    Class07 .. Class08
    Class09 --> C2 : Where am I?
    Class09 --* C3
    Class09 --|> Class07
    Class07 : equals()
    Class07 : Object[] elementData
    Class01 : size()
    Class01 : int chimp
    Class01 : int gorilla`,

    erDiagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,

    gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2014-01-12, 12d
    another task     :24d`,

    pie: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,

    mindmap: `mindmap
    root((mindmap))
      Origins
        Long history
        ::icon(fa fa-book)
        Popularisation
          British popular psychology author Tony Buzan
      Research
        On effectiveness<br/>and features
        On Automatic creation
            Uses
                Creative techniques
                Strategic planning
                Argument mapping`,

    stateDiagram: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,

    journey: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me`
};

export async function generateMermaidCode(
    userCode: string,
    chartType: string
): Promise<string> {
    try {
        // Log input parameters
        console.log('generateMermaidCode - Input chart type:', chartType);

        // Normalize chart type to match examples
        const normalizedChartType = chartType.toLowerCase().replace(/[-\s]/g, '');
        console.log('generateMermaidCode - Normalized chart type:', normalizedChartType);

        // Find the closest matching example
        const exampleType = Object.keys(chartExamples).find(key =>
            normalizedChartType.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedChartType)
        ) || 'flowchart';

        console.log('generateMermaidCode - Matched example type:', exampleType);
        console.log('generateMermaidCode - Available example types:', Object.keys(chartExamples));

        const example = chartExamples[exampleType];

        console.log('Using chart type:', chartType);
        console.log('Using example type:', exampleType);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: [
                {
                    role: 'system',
                    content: `You are a specialized diagram generator that creates valid Mermaid syntax diagrams.
Follow these rules strictly:
1. Return ONLY valid Mermaid code with NO explanation, markdown formatting, or backticks.
2. Always start the diagram with the correct syntax declaration: "${chartType}".
3. Ensure the code is properly structured according to Mermaid's syntax rules.
4. Pay special attention to the correct use of arrows, nodes, and other elements specific to each diagram type.
5. Do not add any custom styles that might be unsupported.
6. The returned code must be directly usable in a Mermaid renderer.

Here's an example of valid ${chartType} syntax:

${example}`,
                },
                {
                    role: 'user',
                    content: `Generate a Mermaid ${chartType} diagram based on the following code or description: \n\n${userCode}`,
                },
            ],
            temperature: 0.5,
        });

        const generatedCode = response.choices[0].message.content?.trim() || '';

        // Validate that the code is starting with the correct diagram type identifier
        const firstLine = generatedCode.split('\n')[0].trim().toLowerCase();
        const chartTypeFirstWord = chartType.split(' ')[0].toLowerCase();

        // Check if the first line contains the required chart type
        if (!firstLine.startsWith(chartTypeFirstWord)) {
            // If the generated code doesn't start with the right diagram type, prepend it
            return `${chartType}\n${generatedCode}`;
        }

        return generatedCode;
    } catch (error) {
        console.error('Error generating Mermaid code:', error);
        throw error;
    }
} 