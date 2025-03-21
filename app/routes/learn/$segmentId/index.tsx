import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { SidebarProvider, useSidebar } from "~/components/ui/sidebar";
import { Button, buttonVariants } from "~/components/ui/button";
import { Edit, Menu, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { getSegmentUseCase, deleteSegmentUseCase } from "~/use-cases/segments";
import { getSegmentAttachments, getSegments } from "~/data-access/segments";
import { type Segment, type Attachment } from "~/db/schema";
import { validateRequest } from "~/utils/auth";
import { MarkdownContent } from "~/routes/learn/-components/markdown-content";
import { Navigation } from "~/routes/learn/-components/navigation";
import { MobileNavigation } from "~/routes/learn/-components/mobile-navigation";
import { DesktopNavigation } from "~/routes/learn/-components/desktop-navigation";
import { VideoPlayer } from "~/routes/learn/-components/video-player";
import { getStorageUrl, uploadFile } from "~/utils/storage";
import { useDropzone } from "react-dropzone";
import { cn } from "~/utils/cn";
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
import { adminMiddleware, authenticatedMiddleware } from "~/lib/auth";

const getSegmentInfoFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(z.object({ segmentId: z.coerce.number() }))
  .handler(async ({ data }) => {
    const { user } = await validateRequest();
    if (!user) {
      throw redirect({ to: "/unauthenticated" });
    }

    const [segment, segments, attachments] = await Promise.all([
      getSegmentUseCase(data.segmentId),
      getSegments(),
      getSegmentAttachments(data.segmentId),
    ]);

    return { segment, segments, attachments, userId: user.id };
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

export const Route = createFileRoute("/learn/$segmentId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { segment, segments, attachments, userId } = await getSegmentInfoFn({
      data: { segmentId: Number(params.segmentId) },
    });

    if (!segment) {
      throw redirect({ to: "/" });
    }

    return { segment, segments, attachments, userId };
  },
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
  attachments,
  userId,
}: {
  segments: Segment[];
  currentSegment: Segment;
  currentSegmentId: number;
  attachments: Attachment[];
  userId: number;
}) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      const fileKey = generateRandomUUID();
      await uploadFile(fileKey, file);

      await createAttachmentFn({
        data: { segmentId: currentSegmentId, fileName: file.name, fileKey },
      });

      toast({
        title: "File uploaded successfully!",
        description: "The file has been attached to this content.",
      });
      router.invalidate();
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast({
        title: "Failed to upload file",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;

    try {
      await deleteAttachmentFn({ data: { attachmentId } });
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
      await deleteSegmentFn({ data: { segmentId: currentSegmentId } });
      toast({
        title: "Content deleted successfully!",
        description: "You will be redirected to the content list.",
      });
      router.navigate({ to: "/learn" });
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
    <div className="flex w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <DesktopNavigation
          segments={segments}
          currentSegmentId={currentSegmentId}
          isAdmin={true}
        />
      </div>

      <div className="flex-1 w-full">
        {/* Mobile Navigation */}
        <MobileNavigation
          segments={segments}
          currentSegmentId={currentSegmentId}
          isOpen={openMobile}
          onClose={() => setOpenMobile(false)}
          isAdmin={true}
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
              <span className="sr-only">Toggle navigation</span>
            </Button>

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{currentSegment.title}</h1>
              <div className="flex gap-2">
                <Link
                  to="/learn/$segmentId/edit"
                  params={{ segmentId: currentSegment.id.toString() }}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Content
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Content
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this content and all its associated files and
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
            </div>

            {currentSegment.videoKey && (
              <div className="w-full">
                <VideoPlayer url={getStorageUrl(currentSegment.videoKey)} />
              </div>
            )}

            <h2 className="text-xl font-bold">Content</h2>
            <MarkdownContent content={currentSegment.content} />

            <div className="space-y-4">
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No documents have been uploaded yet.
                </p>
              )}
            </div>

            <Navigation prevSegment={null} nextSegment={null} />
          </div>
        </main>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { segment, segments, attachments, userId } = Route.useLoaderData();

  return (
    <SidebarProvider>
      <ViewSegment
        segments={segments}
        currentSegment={segment}
        currentSegmentId={segment.id}
        attachments={attachments}
        userId={userId}
      />
      <Toaster />
    </SidebarProvider>
  );
}
