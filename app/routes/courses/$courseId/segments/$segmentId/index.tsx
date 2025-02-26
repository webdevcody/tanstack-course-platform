import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SidebarProvider, useSidebar } from "~/components/ui/sidebar";
import { getCourseUseCase, isCourseAdminUseCase } from "~/use-cases/courses";
import { Button, buttonVariants } from "~/components/ui/button";
import { Edit, Menu, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { getSegmentUseCase, deleteSegmentUseCase } from "~/use-cases/segments";
import {
  getSegmentAttachments,
  getSegmentsByCourseId,
} from "~/data-access/segments";
import { Course, Segment } from "~/db/schema";
import { validateRequest } from "~/utils/auth";
import { MarkdownContent } from "../../-components/markdown-content";
import { Navigation } from "../../-components/navigation";
import { MobileNavigation } from "../../-components/mobile-navigation";
import { DesktopNavigation } from "../../-components/desktop-navigation";
import { VideoPlayer } from "../../-components/video-player";
import { getStorageUrl, uploadFile } from "~/utils/storage";
import { useDropzone } from "react-dropzone";
import { cn } from "~/utils/cn";
import { Toaster } from "~/components/ui/toaster";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "@tanstack/react-router";
import { authenticatedMiddleware } from "~/lib/auth";
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

const getSegmentInfoFn = createServerFn()
  .validator(
    z.object({
      courseId: z.coerce.number(),
      segmentId: z.coerce.number(),
    })
  )
  .handler(async ({ data }) => {
    const { user } = await validateRequest();
    if (!user) {
      throw redirect({
        to: "/unauthenticated",
      });
    }

    const [course, segment, segments, isAdmin, attachments] = await Promise.all(
      [
        getCourseUseCase(data.courseId),
        getSegmentUseCase(data.segmentId),
        getSegmentsByCourseId(data.courseId),
        isCourseAdminUseCase(user.id, data.courseId),
        getSegmentAttachments(data.segmentId),
      ]
    );
    return { course, segment, segments, isAdmin, attachments };
  });

export const Route = createFileRoute("/courses/$courseId/segments/$segmentId/")(
  {
    component: RouteComponent,
    loader: async ({ params }) => {
      const { course, segment, segments, isAdmin, attachments } =
        await getSegmentInfoFn({
          data: {
            courseId: Number(params.courseId),
            segmentId: Number(params.segmentId),
          },
        });

      if (!segment) {
        throw redirect({
          to: "/", // TODO: redirect to a 404 page
        });
      }

      return { course, segment, segments, isAdmin, attachments };
    },
  }
);

function FileDropzone({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles?.[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors",
        isDragActive && "border-primary bg-primary/5"
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the PDF here...</p>
      ) : (
        <p>Drag and drop a PDF here, or click to select one</p>
      )}
    </div>
  );
}

const uploadAttachmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      segmentId: z.number(),
      fileName: z.string(),
      fileKey: z.string(),
    })
  )
  .handler(async ({ data, context }) => {
    return await createAttachmentUseCase(context.userId, {
      segmentId: data.segmentId,
      fileName: data.fileName,
      fileKey: data.fileKey,
    });
  });

const deleteAttachmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      attachmentId: z.number(),
    })
  )
  .handler(async ({ data, context }) => {
    await deleteAttachmentUseCase(context.userId, data.attachmentId);
  });

const deleteSegmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      segmentId: z.number(),
    })
  )
  .handler(async ({ data, context }) => {
    await deleteSegmentUseCase(context.userId, data.segmentId);
  });

function ViewSegment({
  course,
  segments,
  currentSegment,
  currentSegmentId,
  isAdmin,
}: {
  course: Course;
  segments: Segment[];
  currentSegment: Segment;
  currentSegmentId: number;
  isAdmin: boolean;
}) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const { attachments } = Route.useLoaderData();
  const [isUploading, setIsUploading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, openMobile, setOpenMobile]);

  const previousSegmentId =
    segments.findIndex((segment) => segment.id === currentSegmentId) - 1;
  const nextSegmentId =
    segments.findIndex((segment) => segment.id === currentSegmentId) + 1;

  const prevSegment =
    previousSegmentId >= 0 ? segments[previousSegmentId] : null;
  const nextSegment =
    nextSegmentId < segments.length ? segments[nextSegmentId] : null;

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      const fileKey = generateRandomUUID();
      await uploadFile(fileKey, file);
      await uploadAttachmentFn({
        data: {
          segmentId: currentSegmentId,
          fileName: file.name,
          fileKey,
        },
      });
      toast({
        title: "File uploaded successfully!",
        description:
          "The file has been uploaded and will be available shortly.",
      });
      router.invalidate();
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast({
        title: "Failed to upload file",
        description: "Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;

    try {
      await deleteAttachmentFn({
        data: {
          attachmentId,
        },
      });
      toast({
        title: "File deleted successfully!",
        description: "The file has been deleted.",
      });
      router.invalidate();
    } catch (error) {
      console.error("Failed to delete attachment:", error);
      toast({
        title: "Failed to delete attachment",
        description: "Please try again.",
      });
    }
  };

  const handleDeleteSegment = async () => {
    try {
      await deleteSegmentFn({
        data: {
          segmentId: currentSegmentId,
        },
      });
      toast({
        title: "Segment deleted successfully!",
        description: "You will be redirected to the course page.",
      });
      router.navigate({
        to: "/courses/$courseId",
        params: { courseId: course.id.toString() },
      });
    } catch (error) {
      console.error("Failed to delete segment:", error);
      toast({
        title: "Failed to delete segment",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <DesktopNavigation
          segments={segments}
          courseId={course.id}
          isAdmin={isAdmin}
          currentSegmentId={currentSegmentId}
        />
      </div>

      <div className="flex-1 w-full">
        {/* Mobile Navigation */}
        <MobileNavigation
          segments={segments}
          courseId={course.id}
          isAdmin={isAdmin}
          currentSegmentId={currentSegmentId}
          isOpen={openMobile}
          onClose={() => setOpenMobile(false)}
        />

        <main className="w-full p-6 pt-4">
          {/* Mobile Sidebar Toggle */}
          <div className="space-y-6">
            <Button
              size="icon"
              className="z-50 md:hidden hover:bg-accent"
              onClick={() => setOpenMobile(true)}
            >
              <Menu />
              <span className="sr-only">Toggle course navigation</span>
            </Button>

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{currentSegment.title}</h1>
              {isAdmin && (
                <div className="flex gap-2">
                  <Link
                    to="/courses/$courseId/segments/$segmentId/edit"
                    params={{
                      courseId: course.id.toString(),
                      segmentId: currentSegment.id.toString(),
                    }}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Segment
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Segment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this segment and all its associated files and
                          attachments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteSegment}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                <VideoPlayer url={getStorageUrl(currentSegment.videoKey)} />
              </div>
            )}

            <h2 className="text-xl font-bold">Segment Content</h2>
            <MarkdownContent content={currentSegment.content} />

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Course Documents</h2>

              {isAdmin && (
                <div className="space-y-4">
                  <FileDropzone onFileSelect={handleFileSelect} />
                  {isUploading && (
                    <p className="text-center text-muted-foreground">
                      Uploading file...
                    </p>
                  )}
                </div>
              )}

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
                      {isAdmin && (
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
                                This action cannot be undone. This will
                                permanently delete this attachment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteAttachment(attachment.id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No documents have been uploaded yet.
                </p>
              )}
            </div>

            <Navigation prevSegment={prevSegment} nextSegment={nextSegment} />
          </div>
        </main>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { course, segment, segments, isAdmin, attachments } =
    Route.useLoaderData();

  return (
    <SidebarProvider>
      <ViewSegment
        course={course}
        segments={segments}
        currentSegment={segment}
        currentSegmentId={segment.id}
        isAdmin={isAdmin}
      />
      <Toaster />
    </SidebarProvider>
  );
}
