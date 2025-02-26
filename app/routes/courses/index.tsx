import { createFileRoute, Link } from "@tanstack/react-router";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { getCoursesUseCase } from "~/use-cases/courses";
import { CourseCard } from "./-components/course-card";
import { createServerFn } from "@tanstack/react-start";
import { Container } from "./-components/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import React from "react";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useDebounce } from "~/hooks/use-debounce";
import { isAuthenticatedFn } from "~/fn/auth";

const searchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

const searchCoursesFn = createServerFn()
  .validator(searchSchema)
  .handler(async ({ data }) => {
    return getCoursesUseCase({
      search: data.search,
      category: data.category,
    });
  });

export const Route = createFileRoute("/courses/")({
  component: RouteComponent,
  loader: async () => {
    const courses = await searchCoursesFn({ data: {} });
    const isAuthenticated = await isAuthenticatedFn();
    return { courses, isAuthenticated };
  },
});

function RouteComponent() {
  const { courses: initialCourses, isAuthenticated } = Route.useLoaderData();
  const [courses, setCourses] = React.useState(initialCourses);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get unique categories
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(
      initialCourses.map((course) => course.category)
    );
    return Array.from(uniqueCategories);
  }, [initialCourses]);

  // Search courses when filters change
  React.useEffect(() => {
    const search = async () => {
      const results = await searchCoursesFn({
        data: {
          search: debouncedSearch || undefined,
          category: selectedCategory || undefined,
        },
      });
      setCourses(results);
    };
    search();
  }, [debouncedSearch, selectedCategory]);

  return (
    <Container>
      <Title
        title="Browse Courses"
        actions={
          isAuthenticated ? (
            <Link to="/courses/add">
              <Button>Add Course</Button>
            </Link>
          ) : null
        }
      />

      <div className="flex items-center gap-6 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {selectedCategory || "All Categories"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory
              ? "Try adjusting your search filters"
              : "There are no courses available yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </Container>
  );
}
