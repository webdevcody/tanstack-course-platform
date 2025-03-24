import { useState, useEffect } from "react";

// TypeWriter component for animated code display
function TypeWriter({ code, speed = 20 }: { code: string; speed?: number }) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timer = setTimeout(() => {
        setDisplayedCode((prev) => prev + code[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, code, speed]);

  return (
    <pre className="p-4 text-sm overflow-x-auto h-[300px] overflow-y-auto">
      <code className="language-typescript font-mono text-[#39FF14] drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] whitespace-pre">
        {displayedCode}
        {currentIndex < code.length && <span className="animate-pulse">|</span>}
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
            <h2 className="text-3xl font-bold text-green-400">
              Master React Hooks
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Start your React journey by learning the fundamentals of Hooks.
                You'll discover how to manage data in your components and handle
                real-world scenarios like loading states and error handling.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🎯</span>
                  <span className="text-gray-300">
                    Learn how to fetch and manage data in your components - a
                    crucial skill for any React developer
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✨</span>
                  <span className="text-gray-300">
                    Understand loading and error states to create smooth user
                    experiences
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🔄</span>
                  <span className="text-gray-300">
                    Build reusable hooks that you can use in all your future
                    projects
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-[#39FF14]/20 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border-b border-[#39FF14]/20">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-[#39FF14]/80">
                useDataFetching.ts
              </span>
            </div>
            <TypeWriter
              code={`const useDataFetching = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
}`}
            />
          </div>
        </div>

        {/* Second Snippet - Right Text, Left Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="md:order-2 space-y-6 sticky top-4">
            <h2 className="text-3xl font-bold text-green-400">
              Write Better Components
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Learn the secrets to building fast and efficient React
                components. We'll show you step-by-step how to avoid common
                performance pitfalls that every beginner faces.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🚀</span>
                  <span className="text-gray-300">
                    Discover why your components might be running slowly and how
                    to fix them
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">💡</span>
                  <span className="text-gray-300">
                    Learn when and how to use React.memo to speed up your apps
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">📝</span>
                  <span className="text-gray-300">
                    Master list rendering - a key skill for handling data in
                    React
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:order-1 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-[#39FF14]/20 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border-b border-[#39FF14]/20">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-[#39FF14]/80">
                OptimizedList.tsx
              </span>
            </div>
            <TypeWriter
              code={`const MemoizedListItem = memo(({ item, onSelect }) => (
  <div className="list-item" onClick={() => onSelect(item.id)}>
    {item.title}
  </div>
));

const OptimizedList = ({ items, onItemSelect }) => {
  const handleSelect = useCallback((id) => {
    onItemSelect(id);
  }, [onItemSelect]);

  return (
    <div className="virtual-list">
      {items.map((item) => (
        <MemoizedListItem
          key={item.id}
          item={item}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}`}
            />
          </div>
        </div>

        {/* Third Snippet - Left Text, Right Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 sticky top-4">
            <h2 className="text-3xl font-bold text-green-400">
              Manage Application State
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Confused about state management in React? We'll break it down
                into simple, digestible pieces. Learn how to share data between
                components without getting lost in complexity.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🎓</span>
                  <span className="text-gray-300">
                    Understand React Context with real-world examples you can
                    relate to
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🔍</span>
                  <span className="text-gray-300">
                    Learn when to use local state vs. global state - and why it
                    matters
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🛠️</span>
                  <span className="text-gray-300">
                    Build a complete app with proper state management from start
                    to finish
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-[#39FF14]/20 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border-b border-[#39FF14]/20">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-[#39FF14]/80">
                AppContext.tsx
              </span>
            </div>
            <TypeWriter
              code={`const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    actions: {
      updateUser: (user) => 
        dispatch({ type: 'UPDATE_USER', payload: user }),
      toggleTheme: () => 
        dispatch({ type: 'TOGGLE_THEME' }),
      resetState: () => 
        dispatch({ type: 'RESET_STATE' })
    }
  }), [state]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
