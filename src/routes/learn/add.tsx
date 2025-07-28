import { createFileRoute } from "@tanstack/react-router";
import { assertAuthenticatedFn } from "~/fn/auth";
import {
  getUniqueModuleNamesFn,
  AddSegmentHeader,
  SegmentForm,
} from "./-components/add-segment";
import { Container } from "./-components/container";

export const Route = createFileRoute("/learn/add")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async () => {
    const moduleNames = await getUniqueModuleNamesFn();
    return { moduleNames };
  },
});

function RouteComponent() {
  return (
    <div className="container mx-auto">
      <AddSegmentHeader />
      <Container>
        <SegmentForm />
      </Container>
    </div>
  );
}
