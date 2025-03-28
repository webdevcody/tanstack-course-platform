import "dotenv/config";
import { database } from "./index";
import { modules, segments } from "./schema";
import type { ModuleCreate } from "./schema";

async function main() {
  const moduleData = [
    {
      title: "Getting Started",
      order: 1,
      segments: [
        { title: "Welcome to the Course", length: "5:30", isPremium: false },
        {
          title: "Setting Up Your Environment",
          length: "10:45",
          isPremium: false,
        },
        { title: "Course Overview", length: "7:20", isPremium: false },
      ],
    },
    {
      title: "React Fundamentals",
      order: 2,
      segments: [
        {
          title: "Introduction to React and Component Basics",
          length: "8:30",
          isPremium: true,
        },
        {
          title: "Understanding JSX and Props",
          length: "12:45",
          isPremium: true,
        },
        {
          title: "State Management with useState",
          length: "15:20",
          isPremium: true,
        },
      ],
    },
    {
      title: "React Hooks Deep Dive",
      order: 3,
      segments: [
        {
          title: "useEffect for Side Effects",
          length: "14:30",
          isPremium: true,
        },
        { title: "Custom Hooks Development", length: "18:15", isPremium: true },
        {
          title: "useContext for State Management",
          length: "16:40",
          isPremium: true,
        },
      ],
    },
    {
      title: "Advanced React Patterns",
      order: 4,
      segments: [
        {
          title: "Component Composition Patterns",
          length: "13:20",
          isPremium: true,
        },
        {
          title: "Performance Optimization with useMemo",
          length: "15:45",
          isPremium: true,
        },
        {
          title: "Building a Custom Hook Library",
          length: "20:10",
          isPremium: true,
        },
      ],
    },
  ];

  // First, create the modules and store their IDs
  const createdModules = [];
  for (const module of moduleData) {
    const [createdModule] = await database
      .insert(modules)
      .values(module)
      .returning();
    createdModules.push(createdModule);
  }

  // Then create all segments with proper references to their modules
  for (let i = 0; i < createdModules.length; i++) {
    const module = createdModules[i];
    const segments_data = moduleData[i].segments;

    for (const [segmentIndex, segment] of segments_data.entries()) {
      await database
        .insert(segments)
        .values({
          slug: segment.title.toLowerCase().replace(/\s+/g, "-"),
          title: segment.title,
          content: `Learn about ${segment.title.toLowerCase()} in this comprehensive lesson.`,
          order: segmentIndex + 1,
          length: segment.length,
          isPremium: segment.isPremium,
          moduleId: module.id,
          videoKey: `${module.title.toLowerCase().replace(/\s+/g, "-")}-video-${segmentIndex + 1}`,
        });
    }
  }
}

async function seed() {
  console.log("Database seeded!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
