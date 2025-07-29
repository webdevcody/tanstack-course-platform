import {
  createFileRoute,
  redirect,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Edit,
  Trash2,
  Lock,
  MessageSquare,
} from "lucide-react";
import React, { useMemo, useState, useEffect, Suspense } from "react";
import {
  deleteSegmentUseCase,
  getSegmentBySlugUseCase,
} from "~/use-cases/segments";
import { getSegmentAttachments, getSegments } from "~/data-access/segments";
import { type Segment, type Attachment } from "~/db/schema";
import { MarkdownContent } from "~/routes/learn/-components/markdown-content";
import { Navigation } from "~/routes/learn/-components/navigation";
import { VideoPlayer } from "~/routes/learn/-components/video-player";
import { useDropzone } from "react-dropzone";
import { Toaster } from "~/components/ui/toaster";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "@tanstack/react-router";
import { generateRandomUUID } from "~/utils/uuid";
import {
  createAttachmentUseCase,
  deleteAttachmentUseCase,
} from "~/use-cases/attachments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  adminMiddleware,
  authenticatedMiddleware,
  unauthenticatedMiddleware,
} from "~/lib/auth";
import { isAdminFn, isUserPremiumFn } from "~/fn/auth";
import {
  markAsWatchedUseCase,
  getAllProgressForUserUseCase,
} from "~/use-cases/progress";
import { useSegment } from "../-components/segment-context";
import { setLastWatchedSegment } from "~/utils/local-storage";
import { cn, getTimeAgo } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { useAuth } from "~/hooks/use-auth";
import { CommentForm } from "./-components/comment-form";
import { CommentList } from "./-components/comment-list";
import { getCommentsQuery } from "~/lib/queries/comments";

export const Route = createFileRoute("/learn/$slug/_layout/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const { segment, segments, progress } = await getSegmentInfoFn({
      data: { slug: params.slug },
    });
    queryClient.ensureQueryData(getCommentsQuery(segment.id));
    const isPremium = await isUserPremiumFn();
    const isAdmin = await isAdminFn();

    if (segments.length === 0) {
      throw redirect({ to: "/learn/no-segments" });
    }

    if (!segment) {
      throw redirect({ to: "/learn/not-found" });
    }

    return { segment, segments, progress, isPremium, isAdmin };
  },
});

export const getSegmentInfoFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data, context }) => {
    const segment = await getSegmentBySlugUseCase(data.slug);
    const [segments, progress] = await Promise.all([
      getSegments(),
      // getSegmentAttachments(segment.id),
      context.userId ? getAllProgressForUserUseCase(context.userId) : [],
    ]);

    return { segment, segments, progress };
  });

export const createAttachmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(
    z.object({
      fileName: z.string(),
      segmentId: z.coerce.number(),
      fileKey: z.string(),
    })
  )
  .handler(async ({ data }) => {
    await createAttachmentUseCase(data);
  });

export const markedAsWatchedFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(z.object({ segmentId: z.coerce.number() }))
  .handler(async ({ data, context }) => {
    await markAsWatchedUseCase(context.userId, data.segmentId);
  });

export const deleteAttachmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(z.object({ attachmentId: z.coerce.number() }))
  .handler(async ({ data }) => {
    await deleteAttachmentUseCase(data.attachmentId);
  });

export const deleteSegmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(z.object({ segmentId: z.coerce.number() }))
  .handler(async ({ data }) => {
    await deleteSegmentUseCase(data.segmentId);
  });

function FileDropzone({ onDrop }: { onDrop: (file: File) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      onDrop(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25"
      )}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-muted-foreground">
        {isDragActive
          ? "Drop the file here"
          : "Drag and drop a file here, or click to select"}
      </p>
    </div>
  );
}

function ViewSegment({
  segments,
  currentSegment,
  currentSegmentId,
  // attachments,
  isPremium,
  isAdmin,
}: {
  segments: Segment[];
  currentSegment: Segment;
  currentSegmentId: number;
  // attachments: Attachment[];
  isPremium: boolean;
  isAdmin: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { setCurrentSegmentId } = useSegment();

  useEffect(() => {
    setLastWatchedSegment(currentSegment.slug);
  }, [currentSegment.slug]);

  const user = useAuth();
  const isLoggedIn = !!user?.id;

  const nextSegment = useMemo(() => {
    // Find the current module and segment index
    const currentModule = segments.find(
      (segment) => segment.id === currentSegmentId
    )?.moduleId;
    if (!currentModule) return null;

    // Get all segments in the current module and sort by order
    const currentModuleSegments = segments
      .filter((s) => s.moduleId === currentModule)
      .sort((a, b) => a.order - b.order);
    const currentIndex = currentModuleSegments.findIndex(
      (s) => s.id === currentSegmentId
    );

    // If there's a next segment in the current module
    if (currentIndex < currentModuleSegments.length - 1) {
      return currentModuleSegments[currentIndex + 1];
    }

    // If we're at the end of the current module, find the next module
    const modules = segments.reduce(
      (acc, segment) => {
        if (!acc[segment.moduleId]) {
          acc[segment.moduleId] = [];
        }
        acc[segment.moduleId].push(segment);
        return acc;
      },
      {} as Record<number, typeof segments>
    );

    // Sort segments within each module by order
    Object.keys(modules).forEach((moduleId) => {
      modules[Number(moduleId)].sort((a, b) => a.order - b.order);
    });

    const moduleIds = Object.keys(modules)
      .map(Number)
      .sort((a, b) => a - b);
    const currentModuleIndex = moduleIds.indexOf(currentModule);

    // If there's a next module
    if (currentModuleIndex < moduleIds.length - 1) {
      const nextModuleId = moduleIds[currentModuleIndex + 1];
      return modules[nextModuleId][0]; // Return first segment of next module
    }

    return null;
  }, [currentSegmentId, segments]);

  const previousSegment = useMemo(() => {
    // Find the current module and segment index
    const currentModule = segments.find(
      (segment) => segment.id === currentSegmentId
    )?.moduleId;
    if (!currentModule) return null;

    // Get all segments in the current module and sort by order
    const currentModuleSegments = segments
      .filter((s) => s.moduleId === currentModule)
      .sort((a, b) => a.order - b.order);
    const currentIndex = currentModuleSegments.findIndex(
      (s) => s.id === currentSegmentId
    );

    // If there's a previous segment in the current module
    if (currentIndex > 0) {
      return currentModuleSegments[currentIndex - 1];
    }

    // If we're at the start of the current module, find the previous module
    const modules = segments.reduce(
      (acc, segment) => {
        if (!acc[segment.moduleId]) {
          acc[segment.moduleId] = [];
        }
        acc[segment.moduleId].push(segment);
        return acc;
      },
      {} as Record<number, typeof segments>
    );

    // Sort segments within each module by order
    Object.keys(modules).forEach((moduleId) => {
      modules[Number(moduleId)].sort((a, b) => a.order - b.order);
    });

    const moduleIds = Object.keys(modules)
      .map(Number)
      .sort((a, b) => a - b);
    const currentModuleIndex = moduleIds.indexOf(currentModule);

    // If there's a previous module
    if (currentModuleIndex > 0) {
      const prevModuleId = moduleIds[currentModuleIndex - 1];
      const prevModuleSegments = modules[prevModuleId];
      return prevModuleSegments[prevModuleSegments.length - 1]; // Return last segment of previous module
    }

    return null;
  }, [currentSegmentId, segments]);

  const isLastSegment = !nextSegment;
  const isFirstSegment = !previousSegment;

  // Show upgrade placeholder for premium segments if user is not premium and not admin
  if (currentSegment.isPremium && !isPremium && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
        <h1 className="text-2xl font-bold">{currentSegment.title}</h1>
        <div className="max-w-md space-y-4">
          <p className="text-muted-foreground">
            This content is available exclusively for premium members. Upgrade
            your account to unlock all premium content and enhance your learning
            experience.
          </p>
          <Link to="/purchase" className={buttonVariants({ size: "lg" })}>
            Buy Now
          </Link>
        </div>
      </div>
    );
  }

  // const handleFileSelect = async (file: File) => {
  //   try {
  //     setIsUploading(true);
  //     const fileKey = generateRandomUUID();
  //     await uploadFile(fileKey, file);

  //     await createAttachmentFn({
  //       data: { segmentId: currentSegmentId, fileName: file.name, fileKey },
  //     });

  //     toast({
  //       title: "File uploaded successfully!",
  //       description: "The file has been attached to this content.",
  //     });
  //     router.invalidate();
  //   } catch (error) {
  //     console.error("Failed to upload file:", error);
  //     toast({
  //       title: "Failed to upload file",
  //       description: "Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // const handleDeleteAttachment = async (attachmentId: number) => {
  //   if (!confirm("Are you sure you want to delete this attachment?")) return;

  //   try {
  //     await deleteAttachmentFn({ data: { attachmentId } });
  //     toast({
  //       title: "File deleted successfully!",
  //       description: "The file has been deleted.",
  //     });
  //     router.invalidate();
  //   } catch (error) {
  //     console.error("Failed to delete attachment:", error);
  //     toast({
  //       title: "Failed to delete attachment",
  //       description: "Please try again.",
  //     });
  //   }
  // };

  const handleDeleteSegment = async () => {
    try {
      await deleteSegmentFn({ data: { segmentId: currentSegmentId } });
      toast({
        title: "Content deleted successfully!",
        description: "You will be redirected to the content list.",
      });
      router.navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast({
        title: "Failed to delete content",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{currentSegment.title}</h1>
          {isAdmin && currentSegment.isPremium && (
            <Badge
              variant="outline"
              className="bg-amber-950 text-amber-300 border-amber-800 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              PREMIUM
            </Badge>
          )}
        </div>
        {isAdmin && (
          <div className="gap-2 hidden md:flex">
            <Link
              to="/learn/$slug/edit"
              params={{ slug: currentSegment.slug }}
              className={buttonVariants({ variant: "outline" })}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Segment
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive-outline">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Segment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this content and all its associated files and attachments.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className={buttonVariants({ variant: "gray-outline" })}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSegment}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {currentSegment.videoKey && (
        <div className="w-full">
          <VideoPlayer segmentId={currentSegment.id} />
        </div>
      )}

      {currentSegment.content && (
        <MarkdownContent content={currentSegment.content} />
      )}

      {isLoggedIn && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button
              disabled={isFirstSegment}
              onClick={() => {
                if (previousSegment) {
                  setCurrentSegmentId(previousSegment.id);
                }
              }}
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Previous Lesson
            </Button>
            <Button
              onClick={async () => {
                await markedAsWatchedFn({
                  data: { segmentId: currentSegmentId },
                });

                if (isLastSegment) {
                  navigate({ to: "/learn/course-completed" });
                } else if (nextSegment) {
                  setCurrentSegmentId(nextSegment.id);
                }
              }}
            >
              {isLastSegment ? "Complete Course" : "Next Video"}{" "}
              {isLastSegment ? (
                <CheckCircle className="ml-2 h-4 w-4" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Comments</h2>
            <CommentForm />
            <Suspense fallback={<div>Loading...</div>}>
              <CommentList />
            </Suspense>
          </div>
        </div>
      )}

      {/* focusing on videos for now */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-bold">Documents</h2>

        <div className="space-y-4">
          <FileDropzone onDrop={handleFileSelect} />
          {isUploading && (
            <p className="text-center text-muted-foreground">
              Uploading file...
            </p>
          )}
        </div>

        {attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <a
                  href={getStorageUrl(attachment.fileKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {attachment.fileName}
                </a>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"} size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this attachment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No documents have been uploaded yet.
          </p>
        )}
      </div> */}

      <Navigation prevSegment={null} nextSegment={null} />
    </div>
  );
}

function FloatingFeedbackButton() {
  return (
    <Link to="/create-testimonial" className="fixed bottom-6 right-6 z-50">
      <Button size="lg" className="rounded-full shadow-lg">
        <MessageSquare className="w-5 h-5 mr-2" />
        Leave a Testimonial
      </Button>
    </Link>
  );
}

function RouteComponent() {
  const { segment, segments, isPremium, isAdmin } = Route.useLoaderData();

  return (
    <>
      <ViewSegment
        segments={segments}
        currentSegment={segment}
        currentSegmentId={segment.id}
        isPremium={isPremium}
        isAdmin={isAdmin}
      />
      <FloatingFeedbackButton />
      <Toaster />
    </>
  );
}
