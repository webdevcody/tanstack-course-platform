import { createContext, useContext, useState } from "react";
import { Segment } from "~/db/schema";

interface SegmentContextType {
  currentSegmentId: number | null;
  setCurrentSegmentId: (id: number) => void;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export function SegmentProvider({ children }: { children: React.ReactNode }) {
  const [currentSegmentId, setCurrentSegmentId] = useState<number | null>(null);

  return (
    <SegmentContext.Provider value={{ currentSegmentId, setCurrentSegmentId }}>
      {children}
    </SegmentContext.Provider>
  );
}

export function useSegment() {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error("useSegment must be used within a SegmentProvider");
  }
  return context;
}
