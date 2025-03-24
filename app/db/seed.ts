import "dotenv/config";
import { database } from "./index";
import { segments } from "./schema";

async function main() {
  const modules = [
    {
      id: "React Fundamentals",
      title: "React Fundamentals",
      segments: [
        { title: "Introduction to React and Component Basics", length: "8:30" },
        { title: "Understanding JSX and Props", length: "12:45" },
        { title: "State Management with useState", length: "15:20" },
      ],
    },
    {
      id: "React Hooks",
      title: "React Hooks Deep Dive",
      segments: [
        { title: "useEffect for Side Effects", length: "14:30" },
        { title: "Custom Hooks Development", length: "18:15" },
        { title: "useContext for State Management", length: "16:40" },
      ],
    },
    {
      id: "Advanced React Patterns",
      title: "Advanced React Patterns",
      segments: [
        { title: "Component Composition Patterns", length: "13:20" },
        { title: "Performance Optimization with useMemo", length: "15:45" },
        { title: "Building a Custom Hook Library", length: "20:10" },
      ],
    },
  ];

  for (const [moduleIndex, module] of modules.entries()) {
    for (const [segmentIndex, segment] of module.segments.entries()) {
      const order = moduleIndex * 3 + segmentIndex + 1;
      await database.insert(segments).values({
        slug: segment.title.toLowerCase().replace(/\s+/g, "-"),
        title: `${segment.title}`,
        content: `Learn about ${segment.title.toLowerCase()} in this comprehensive lesson.`,
        order,
        length: segment.length,
        isPremium: order > 3, // First 3 segments are free
        moduleId: module.id,
        videoKey: `video-${order}`,
      });
    }
  }
}

async function seed() {
  console.log("Database seeded!");
}

main();
seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
