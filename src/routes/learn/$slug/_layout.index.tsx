import {
  createFileRoute,
  redirect,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  ArrowRight,
  CheckCircle,
  Edit,
  Trash2,
  Lock,
  MessageSquare,
  BookOpen,
  Clock,
  FileText,
} from 'lucide-react';
import React, { useMemo, useState, useEffect, Suspense } from 'react';
import {
  deleteSegmentUseCase,
  getSegmentBySlugUseCase,
} from '~/use-cases/segments';
import { getSegmentAttachments, getSegments } from '~/data-access/segments';
import { type Segment, type Attachment } from '~/db/schema';
import { MarkdownContent } from '~/routes/learn/-components/markdown-content';
import { Navigation } from '~/routes/learn/-components/navigation';
import { VideoPlayer } from '~/routes/learn/-components/video-player';
import { useDropzone } from 'react-dropzone';
import { Toaster } from '~/components/ui/toaster';
import { useToast } from '~/hooks/use-toast';
import { useRouter } from '@tanstack/react-router';
import { generateRandomUUID } from '~/utils/uuid';
import {
  createAttachmentUseCase,
  deleteAttachmentUseCase,
} from '~/use-cases/attachments';
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
} from '~/components/ui/alert-dialog';
import {
  adminMiddleware,
  authenticatedMiddleware,
  unauthenticatedMiddleware,
} from '~/lib/auth';
import { isAdminFn, isUserPremiumFn } from '~/fn/auth';
import {
  markAsWatchedUseCase,
  getAllProgressForUserUseCase,
} from '~/use-cases/progress';
import { useSegment } from '../-components/segment-context';
import { setLastWatchedSegment } from '~/utils/local-storage';
import { cn, getTimeAgo } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';
import { useAuth } from '~/hooks/use-auth';
import { CommentForm } from './-components/comment-form';
import { CommentList } from './-components/comment-list';
import { getCommentsQuery } from '~/lib/queries/comments';
import { useQuery } from '@tanstack/react-query';
import { HeaderSection } from './-components/header-section';

export const Route = createFileRoute('/learn/$slug/_layout/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const { segment, segments, progress } = await getSegmentInfoFn({
      data: { slug: params.slug },
    });
    queryClient.ensureQueryData(getCommentsQuery(segment.id));
    const isPremium = await isUserPremiumFn();
    const isAdmin = await isAdminFn();

    if (segments.length === 0) {
      throw redirect({ to: '/learn/no-segments' });
    }

    if (!segment) {
      throw redirect({ to: '/learn/not-found' });
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
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
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
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25'
      )}
    >
      <input {...getInputProps()} />
      <p className='text-sm text-muted-foreground'>
        {isDragActive
          ? 'Drop the file here'
          : 'Drag and drop a file here, or click to select'}
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
  const [activeTab, setActiveTab] = useState<'content' | 'comments'>('content');
  const { setCurrentSegmentId } = useSegment();

  // Check if there are existing comments to determine initial form visibility
  const { data: existingComments } = useQuery(
    getCommentsQuery(currentSegmentId)
  );
  const [showCommentForm, setShowCommentForm] = useState(
    () => existingComments && existingComments.length > 0
  );

  // Update form visibility when comments data changes
  useEffect(() => {
    if (existingComments && existingComments.length > 0) {
      setShowCommentForm(true);
    }
  }, [existingComments]);

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
      <div className='max-w-5xl mx-auto space-y-6'>
        {/* Premium Content Header */}
        <div className='module-card p-8 text-center'>
          <div className='relative'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl'></div>

            {/* Content */}
            <div className='py-8 relative space-y-6'>
              {/* Premium badge and lock icon */}
              <div className='flex items-center justify-center space-x-4'>
                <div className='p-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 shadow-elevation-2'>
                  <Lock className='h-8 w-8 text-amber-600 dark:text-amber-400' />
                </div>
                <Badge
                  variant='outline'
                  className='bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 px-4 py-2 text-sm font-semibold'
                >
                  PREMIUM CONTENT
                </Badge>
              </div>

              {/* Title */}
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold text-foreground leading-tight'>
                  {currentSegment.title}
                </h1>
                <p className='text-lg text-muted-foreground'>
                  This lesson is part of our premium curriculum
                </p>
              </div>

              {/* Description */}
              <div className='max-w-lg mx-auto space-y-4'>
                <p className='text-muted-foreground leading-relaxed'>
                  Unlock access to this exclusive content and enhance your
                  learning journey. Premium members get access to advanced
                  topics, downloadable resources, and priority support.
                </p>

                {/* Benefits list */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <CheckCircle className='h-4 w-4 text-theme-500' />
                    <span>Advanced content</span>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <CheckCircle className='h-4 w-4 text-theme-500' />
                    <span>Downloadable resources</span>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <CheckCircle className='h-4 w-4 text-theme-500' />
                    <span>Priority support</span>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <CheckCircle className='h-4 w-4 text-theme-500' />
                    <span>All future updates</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className='space-y-3'>
                <Link
                  to='/purchase'
                  className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-theme-500 to-theme-600 hover:from-theme-600 hover:to-theme-700 text-white font-semibold rounded-lg shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 text-lg'
                >
                  Upgrade to Premium
                  <ArrowRight className='h-5 w-5' />
                </Link>
                <p className='text-xs text-muted-foreground'>
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info card */}
        <div className='module-card p-6'>
          <div className='flex items-start gap-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-900 dark:to-theme-800'>
              <BookOpen className='h-5 w-5 text-theme-600 dark:text-theme-400' />
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-foreground mb-2'>
                What you'll learn
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                This premium lesson covers advanced concepts that will take your
                skills to the next level. Join thousands of developers who have
                upgraded their knowledge with our comprehensive curriculum.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto space-y-4'>
      {/* Header Section */}
      <HeaderSection />
      {/* Video Section */}
      {currentSegment.videoKey && (
        <div className='relative'>
          <div className='aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-elevation-3 border border-gray-200 dark:border-gray-700'>
            <VideoPlayer segmentId={currentSegment.id} />
          </div>
        </div>
      )}

      {/* Navigation Section - Moved here after video */}
      <div className='flex justify-between items-center gap-4 mb-8'>
        <Button
          disabled={isFirstSegment}
          onClick={() => {
            if (previousSegment) {
              setCurrentSegmentId(previousSegment.id);
            }
          }}
          className='mt-4 module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3'
        >
          <ArrowRight className='h-4 w-4 rotate-180' />
          Previous Lesson
        </Button>

        <Button
          className='mt-4 module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3'
          onClick={async () => {
            await markedAsWatchedFn({
              data: { segmentId: currentSegmentId },
            });

            if (isLastSegment) {
              navigate({ to: '/learn/course-completed' });
            } else if (nextSegment) {
              setCurrentSegmentId(nextSegment.id);
            }
          }}
        >
          {isLastSegment ? (
            <>
              Complete Course
              <CheckCircle className='ml-2 h-4 w-4' />
            </>
          ) : (
            <>
              Next Video
              <ArrowRight className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>
      </div>

      {/* Tabs Section */}
      <div className='module-card overflow-hidden'>
        {/* Tab Headers */}
        <div className='flex border-b border-gray-200 dark:border-gray-700'>
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer',
              activeTab === 'content'
                ? 'border-theme-500 text-theme-600 dark:text-theme-400 bg-theme-50 dark:bg-theme-950/30'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <FileText className='h-4 w-4' />
            Lesson Content
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={cn(
              'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer',
              activeTab === 'comments'
                ? 'border-theme-500 text-theme-600 dark:text-theme-400 bg-theme-50 dark:bg-theme-950/30'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <MessageSquare className='h-4 w-4' />
            Discussion
          </button>
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {activeTab === 'content' && currentSegment.content && (
            <div className='animate-fade-in'>
              <MarkdownContent content={currentSegment.content} />
            </div>
          )}

          {activeTab === 'content' && !currentSegment.content && (
            <div className='text-center py-8 text-muted-foreground'>
              <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No lesson content available for this segment.</p>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className='animate-fade-in space-y-8'>
              {/* Comment Form Section */}
              {showCommentForm && (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-foreground flex items-center gap-2'>
                      <MessageSquare className='h-5 w-5 text-theme-600 dark:text-theme-400' />
                      Join the Discussion
                    </h3>
                    {isLoggedIn && (
                      <div className='text-sm text-muted-foreground'>
                        Share your thoughts
                      </div>
                    )}
                  </div>
                  <CommentForm
                    autoFocus={showCommentForm && activeTab === 'comments'}
                  />
                </div>
              )}

              {/* Comments List Section */}
              <div
                className={
                  showCommentForm ? 'border-t border-border/60 pt-6' : ''
                }
              >
                <Suspense
                  fallback={
                    <div className='space-y-4'>
                      {/* Loading header */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div className='h-5 w-5 rounded bg-muted animate-pulse'></div>
                          <div className='h-5 w-24 rounded bg-muted animate-pulse'></div>
                        </div>
                        <div className='h-4 w-20 rounded bg-muted animate-pulse'></div>
                      </div>

                      {/* Loading comments */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className='module-card animate-pulse'>
                          <div className='p-4'>
                            <div className='flex gap-3'>
                              <div className='h-10 w-10 rounded-full bg-muted'></div>
                              <div className='flex-1 space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <div className='h-4 w-24 rounded bg-muted'></div>
                                  <div className='h-3 w-16 rounded bg-muted'></div>
                                </div>
                                <div className='space-y-1'>
                                  <div className='h-4 w-full rounded bg-muted'></div>
                                  <div className='h-4 w-3/4 rounded bg-muted'></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                >
                  <CommentList
                    showCommentForm={showCommentForm}
                    onStartDiscussion={() => setShowCommentForm(true)}
                  />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>

      <Navigation prevSegment={null} nextSegment={null} />
    </div>
  );
}

function FloatingFeedbackButton() {
  return (
    <Link to='/create-testimonial' className='fixed bottom-6 right-6 z-50'>
      <Button
        size='lg'
        className='mt-4 module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3'
      >
        <MessageSquare className='w-5 h-5 mr-2' />
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
