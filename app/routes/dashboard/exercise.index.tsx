import { createServerFn } from "@tanstack/react-start";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import {
  deleteExerciseUseCase,
  getExercisesUseCase,
} from "~/use-cases/exercises";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Exercise } from "~/db/schema";
import { TrashIcon } from "lucide-react";
import { z } from "zod";
import { validateRequest } from "~/utils/auth";
import { createMiddleware } from "@tanstack/react-start";
import { authenticatedMiddleware } from "~/lib/auth";

const getExercisesFn = createServerFn().handler(async () => {
  const exercises = await getExercisesUseCase();
  return exercises;
});

const deleteExerciseFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      exerciseId: z.number(),
    })
  )
  .handler(async ({ data, context }) => {
    await deleteExerciseUseCase(context.userId, data.exerciseId);
  });

export const Route = createFileRoute("/dashboard/exercise/")({
  component: RouteComponent,
  loader: async () => {
    const exercises = await getExercisesFn();
    return { exercises };
  },
});

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          {exercise.exercise}{" "}
          <Button
            size="icon"
            variant="destructive"
            onClick={async () => {
              await deleteExerciseFn({ data: { exerciseId: exercise.id } });
              router.invalidate();
            }}
          >
            <TrashIcon />
          </Button>
        </CardTitle>
        <CardDescription>{exercise.weight} lbs</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{exercise.reps} reps</p>
        <p>{exercise.sets} sets</p>
      </CardContent>
      <CardFooter>
        {/* <p>{exercise.createdAt.toLocaleDateString()}</p> */}
      </CardFooter>
    </Card>
  );
}

function RouteComponent() {
  const { exercises } = Route.useLoaderData();

  return (
    <div className="flex-grow flex flex-col gap-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Your Exercise History</h1>
        <Link to="/dashboard/exercise/add">
          <Button>Log Exercise</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
