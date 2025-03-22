# TODO NOW

- if a user has purcahsed a course, show a message in the /purchase page so they don't get confused if they happen to navigate to that page on accident and do not show the buy now button or pricing there. instead show a button which will redirect them to the learn/$first-slug (use the slug hook)
- ability to download the entire video as a zip
- if on last segment, show a "complete course" button and navigate to a certificate page
- after clicking the Next Video button, I need to invalidate the queryClient cache for the "progress" entries
- refactor the approach to instead just fetch the array of progress entries instead of doing the left join stuff
- rename progress to completed_segments
