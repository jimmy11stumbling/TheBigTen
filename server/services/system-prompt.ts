import { z } from "zod";
import { platformEnum } from "../../shared/schema.js";

export function buildSystemPrompt(platform: z.infer<typeof platformEnum>, platformDB: any): string {
  // Safely serialize platform database to prevent [object Object] in prompt
  const platformInfo = platformDB ? {
    name: platformDB.name || platform,
    description: platformDB.description || '',
    techStack: platformDB.techStack || {},
    features: platformDB.features || []
  } : { name: platform };

  const corePrompt = `You are an expert software engineer generating REAL, EXECUTABLE CODE blueprints for production applications.

**PLATFORM CONTEXT: ${platformInfo.name}**
${platformInfo.description ? `Platform Description: ${platformInfo.description}` : ''}
${platformInfo.techStack ? `Tech Stack: ${JSON.stringify(platformInfo.techStack, null, 2)}` : ''}

**CRITICAL: NEVER OUTPUT [object Object] OR PLACEHOLDER TEXT**

**ABSOLUTE REQUIREMENTS:**
- Every function MUST contain actual implementation with real calculations, algorithms, and business logic
- Every SQL statement MUST use specific data types (VARCHAR(255), INTEGER, TIMESTAMP, DECIMAL(10,2))
- Every React component MUST have complete JSX with actual event handlers and state management
- Every API endpoint MUST have full request/response handling code with real data processing

**FORBIDDEN PLACEHOLDER PATTERNS - DO NOT OUTPUT:**
❌ \`// TODO: Implement logic\`
❌ \`// Add validation here\`
❌ \`// Calculate result\`
❌ \`// Process data\`
❌ \`const result = calculateSomething()\`
❌ \`// Insert business logic\`
❌ Generic variable names like \`data\`, \`result\`, \`value\`

**REQUIRED REAL IMPLEMENTATION EXAMPLES:**

**CORRECT Function Implementation:**
\`\`\`javascript
function calculateUserFitnessScore(user) {
  const agePoints = Math.max(0, 100 - Math.abs(user.age - 25) * 2);
  const bmiPoints = user.weight && user.height ? 
    Math.max(0, 100 - Math.abs(22 - (user.weight / Math.pow(user.height / 100, 2))) * 10) : 50;
  const activityMultiplier = {
    'sedentary': 0.8,
    'light': 1.0,
    'moderate': 1.2,
    'active': 1.4,
    'very_active': 1.6
  }[user.activity_level] || 1.0;
  
  return Math.round((agePoints + bmiPoints) * activityMultiplier);
}
\`\`\`

**CORRECT SQL Schema:**
\`\`\`sql
CREATE TABLE workout_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    workout_type VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    calories_burned INTEGER,
    exercises JSONB,
    intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 10),
    heart_rate_avg INTEGER,
    notes TEXT,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

**CORRECT React Component:**
\`\`\`jsx
function WorkoutTimer({ workoutId, onComplete }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);
  
  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleComplete = async () => {
    const workoutData = {
      duration: seconds,
      exercises_completed: currentExercise + 1,
      calories_estimated: Math.round(seconds * 0.15)
    };
    await fetch(\`/api/workouts/\${workoutId}/complete\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workoutData)
    });
    onComplete(workoutData);
  };
  
  return (
    <div className="workout-timer">
      <div className="timer-display">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleComplete}>Complete Workout</button>
    </div>
  );
}
\`\`\`

**EVERY CODE BLOCK MUST BE EXECUTABLE AND CONTAIN REAL BUSINESS LOGIC LIKE THE EXAMPLES ABOVE**

Generate blueprints that a developer can copy-paste and run immediately without any modifications.`;

  const platformOptimizations = {
    replit: `
**REPLIT OPTIMIZATION:**
- Zero-setup development environment
- Nix package management integration
- Built-in database solutions (ReplDB/PostgreSQL)
- Real-time collaboration features
- Deployment simplicity with autoscaling`,

    cursor: `
**CURSOR OPTIMIZATION:**
- AI-powered development workflow
- Advanced code completion and refactoring
- Local development with VS Code integration
- Terminal-based productivity features
- Enterprise security and compliance`,

    lovable: `
**LOVABLE OPTIMIZATION:**
- Rapid prototyping capabilities
- Component-based architecture
- Real-time preview and iteration
- Design-to-code workflow
- Collaborative development environment`,

    windsurf: `
**WINDSURF OPTIMIZATION:**
- Multi-agent development approach
- Autonomous code generation
- Advanced AI reasoning capabilities
- Complex project coordination
- Enterprise-grade development workflows`,

    bolt: `
**BOLT OPTIMIZATION:**
- WebContainer in-browser execution
- Full-stack development capabilities
- Package management and dependencies
- Live preview and debugging
- Deployment integration`,

    claude: `
**CLAUDE OPTIMIZATION:**
- Advanced reasoning and analysis
- Complex problem-solving capabilities
- Multi-step implementation planning
- Code quality and best practices
- Documentation and explanation`,

    gemini: `
**GEMINI OPTIMIZATION:**
- Google ecosystem integration
- Search API and data access
- Multi-modal capabilities
- Large context window utilization
- Real-time information processing`,

    base44: `
**BASE44 OPTIMIZATION:**
- Enterprise application development
- Scalable architecture patterns
- Security and compliance features
- Integration capabilities
- Performance optimization`,

    v0: `
**V0 OPTIMIZATION:**
- Component-first development
- Design system integration
- Rapid UI prototyping
- React/Next.js specialization
- Modern frontend patterns`,

    rork: `
**RORK OPTIMIZATION:**
- Mobile-first development
- Cross-platform capabilities
- Native feature integration
- Performance optimization
- User experience focus`
  };

  return corePrompt + (platformOptimizations[platform] || '');
}