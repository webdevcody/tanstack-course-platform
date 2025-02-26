import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createServerFn } from "@tanstack/react-start";
import { createExerciseUseCase } from "~/use-cases/exercises";
import { validateRequest } from "~/utils/auth";
import { authenticatedMiddleware } from "~/lib/auth";

export const Route = createFileRoute("/dashboard/exercise/add")({
  component: RouteComponent,
});

const formSchema = z.object({
  exercise: z.string().min(2).max(50),
  weight: z.coerce.number().min(1).max(500),
  reps: z.coerce.number().min(1).max(50),
  sets: z.coerce.number().min(1).max(10),
});

const createExerciseFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(formSchema)
  .handler(async ({ data, context }) => {
    await createExerciseUseCase(context.userId, data);
  });

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exercise: "",
      weight: 0,
      reps: 0,
      sets: 0,
    },
  });

  const router = useNavigate();

  function onSubmit(values: z.infer<typeof formSchema>) {
    createExerciseFn({ data: values }).then(() => {
      router({ to: "/dashboard/exercise" });
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Log an Exercise</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="exercise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reps</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sets</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
