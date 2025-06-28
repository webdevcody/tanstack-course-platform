import { useState, useEffect, useRef } from "react";

// TypeWriter component for animated code display
function TypeWriter({ code, speed = 20 }: { code: string; speed?: number }) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        } else {
          setIsVisible(false);
          setDisplayedCode("");
          setCurrentIndex(0);
        }
      },
      { threshold: 0.1 }
    );

    if (codeRef.current) {
      observer.observe(codeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || currentIndex >= code.length) return;

    const timer = setTimeout(() => {
      setDisplayedCode((prev) => prev + code[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, code, speed, isVisible]);

  return (
    <pre
      ref={codeRef}
      className="p-4 text-sm overflow-x-auto h-[300px] overflow-y-auto"
    >
      <code className="language-typescript font-mono text-theme-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] whitespace-pre">
        {displayedCode}
        {currentIndex < code.length && isVisible && (
          <span className="animate-pulse">|</span>
        )}
      </code>
    </pre>
  );
}

export function CodePreviewSection() {
  return (
    <section className="py-16 px-6 bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* First Snippet - Left Text, Right Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 sticky top-4">
            <h2 className="text-3xl font-bold text-theme-400">
              Learn Through Practice
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Each challenge is designed to help you master React concepts
                through hands-on practice. You'll learn how to break down
                complex problems and implement solutions step by step.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">🎯</span>
                  <span className="text-gray-300">
                    Solve real-world coding problems that you'll encounter in
                    your React journey
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">✨</span>
                  <span className="text-gray-300">
                    Learn how to think like a developer by breaking down complex
                    problems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">🔄</span>
                  <span className="text-gray-300">
                    Build a portfolio of 20 unique React projects to showcase
                    your skills
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border-b border-theme-400/20">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-theme-400/80">
                useInterval.ts
              </span>
            </div>
            <TypeWriter
              code={`const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}`}
            />
          </div>
        </div>

        {/* Second Snippet - Right Text, Left Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="md:order-2 space-y-6 sticky top-4">
            <h2 className="text-3xl font-bold text-theme-400">
              Understand React Fundamentals
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Master the core building blocks of React. Learn how components
                work, how to handle user interactions, and how to manage state
                in your applications.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">🚀</span>
                  <span className="text-gray-300">
                    Learn how to create components and handle user events
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">💡</span>
                  <span className="text-gray-300">
                    Understand how state works and when to use it
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">📝</span>
                  <span className="text-gray-300">
                    Practice using props to make reusable components
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:order-1 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border-b border-theme-400/20">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-theme-400/80">
                Counter.tsx
              </span>
            </div>
            <TypeWriter
              code={`// A simple counter component showing state and events
function Counter() {
  // Step 1: Create state for our counter
  const [count, setCount] = useState(0);

  // Step 2: Create event handlers
  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  // Step 3: Return our JSX with event listeners
  return (
    <div className="counter">
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}`}
            />
          </div>
        </div>

        {/* Third Snippet - Left Text, Right Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 sticky top-4">
            <h2 className="text-3xl font-bold text-theme-400">
              Learn to Problem Solve
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Master the art of breaking down complex React challenges. We'll
                start each challenge with whiteboarding, identify the right
                state management approach, and implement step-by-step solutions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">🤔</span>
                  <span className="text-gray-300">
                    Learn how to break down complex problems into manageable
                    pieces using whiteboarding
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">💭</span>
                  <span className="text-gray-300">
                    Identify what state you need and where it should live in
                    your application
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-400 mt-1">⚡</span>
                  <span className="text-gray-300">
                    Turn your whiteboard solutions into working React code with
                    confidence
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border-b border-theme-400/20">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-theme-400/80">
                TodoList.tsx
              </span>
            </div>
            <TypeWriter
              code={`// Step 1: Define our state and actions
const [todos, setTodos] = useState([]);
const [newTodo, setNewTodo] = useState("");

// Step 2: Create handlers for state updates
const addTodo = () => {
  if (!newTodo.trim()) return;
  setTodos([
    ...todos,
    { id: Date.now(), text: newTodo, completed: false }
  ]);
  setNewTodo("");
};

const toggleTodo = (id) => {
  setTodos(todos.map(todo =>
    todo.id === id
      ? { ...todo, completed: !todo.completed }
      : todo
  ));
};

// Step 3: Implement the UI with our state
return (
  <div className="todo-app">
    <input
      value={newTodo}
      onChange={(e) => setNewTodo(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && addTodo()}
    />
    {todos.map(todo => (
      <div key={todo.id} onClick={() => toggleTodo(todo.id)}>
        {todo.text}
      </div>
    ))}
  </div>
);`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
