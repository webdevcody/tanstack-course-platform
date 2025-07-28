import { createFileRoute } from "@tanstack/react-router";
import { assertAuthenticatedFn } from "~/fn/auth";
import {
  getUniqueModuleNamesFn,
  getSegmentFn,
  EditSegmentHeader,
  SegmentForm,
} from "../-components/edit-segment";
import { Container } from "../-components/container";

export const Route = createFileRoute("/learn/$slug/edit")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async ({ params }) => {
    const { segment } = await getSegmentFn({ data: { slug: params.slug } });
    const moduleNames = await getUniqueModuleNamesFn();
    return { segment, moduleNames };
  },
});

function RouteComponent() {
  return (
    <div className="container mx-auto">
      <EditSegmentHeader />
      <Container>
        <SegmentForm />
      </Container>
    </div>
  );
}
