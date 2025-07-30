import {
  BookOpen,
  Clock,
  Edit,
  Lock,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Link } from '@tanstack/react-router';
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
import { useLoaderData } from '@tanstack/react-router';
import { toast } from '~/hooks/use-toast';
import { deleteSegmentFn } from '../_layout.index';
import { useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCompletedUserProgressForSegmentFn } from '~/fn/progress';

export function HeaderSection() {
  const navigate = useNavigate();
  const { segment, isAdmin } = useLoaderData({
    from: '/learn/$slug/_layout/',
  });

  const { data: progress } = useSuspenseQuery({
    queryKey: ['progress', segment.id] as const,
    queryFn: ({ queryKey }) =>
      getCompletedUserProgressForSegmentFn({
        data: { segmentId: queryKey[1] },
      }),
  });

  const handleDeleteSegment = async () => {
    try {
      await deleteSegmentFn({ data: { segmentId: segment.id } });
      toast({
        title: 'Content deleted successfully!',
        description: 'You will be redirected to the content list.',
      });
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast({
        title: 'Failed to delete content',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-start gap-3'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-900 dark:to-theme-800'>
            <BookOpen className='h-6 w-6 text-theme-600 dark:text-theme-400' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-foreground leading-tight'>
              {segment.title}
            </h1>
            {/* {segment.length && (
              <p className='text-muted-foreground mt-1 flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                {segment.length}
              </p>
            )} */}
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
          {isAdmin && (
            <div className='flex items-center gap-3'>
              {segment.isPremium && (
                <Badge
                  variant='outline'
                  className='bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 flex items-center gap-1'
                >
                  <Lock className='w-3 h-3' />
                  PREMIUM
                </Badge>
              )}

              <div className='flex items-center gap-2'>
                <Link to='/learn/$slug/edit' params={{ slug: segment.slug }}>
                  <Button className='module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3'>
                    <Edit className='h-4 w-4' />
                    Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='outline'
                      className='btn-red-border-gradient px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-md !bg-transparent !border-red-500'
                    >
                      <Trash2 className='h-4 w-4' />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='bg-background border border-border shadow-elevation-3 rounded-xl max-w-md mx-auto'>
                    <AlertDialogHeader className='space-y-4 p-6'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800'>
                          <Trash2 className='h-5 w-5 text-red-600 dark:text-red-400' />
                        </div>
                        <AlertDialogTitle className='text-xl font-semibold text-foreground leading-tight'>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                      </div>
                      <AlertDialogDescription className='text-muted-foreground text-sm leading-relaxed'>
                        This action cannot be undone. This will permanently
                        delete this content and all its associated files and
                        attachments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex gap-3 p-6 pt-0'>
                      <AlertDialogCancel className='px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 border border-border rounded-md hover:bg-muted'>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSegment}
                        className='btn-gradient-red px-4 py-2 text-sm font-medium rounded-md'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* Progress Section */}
          <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border/50'>
            <div className='flex items-center gap-2'>
              <GraduationCap className='h-4 w-4 text-theme-600 dark:text-theme-400' />
              <span className='text-sm font-medium text-foreground'>
                {progress}%
              </span>
            </div>
            <span className='text-xs text-muted-foreground'>
              of students completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
