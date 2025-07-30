# Bugs

- when deleting a segment the app crashes (I think it's related to logic for redirecting the user to a previous segment)
- when reordering modules, the navigation buttons do not seem to navigate the correct order of modules... are we sorting the modules by order? are we correctly updating the order on modules when we re-arrange them?

# Features

- add metric that users can see how many other users completed this segment (help drive more motivation maybe?)
- add the ability for an admin to email all the premium users in the system to let them know new segments or modules are created. Add some type of MJLM editor / preview feature. This should use AWS SES. Provide a generic update template one can start editing. Hopefully support markdown to generate the MJML and send out the styled emails.
- analytics for admins to see which students are finishing which segments
- analytics for admins to get notifications when students comments on segments with a built in way to respond directly on the same notification page
- analytics for when users view the site, sign up, and purchase by day
  - analytics on how the ratio between views, sign ups, premiums
- gamification maybe? badges?
- certificates on completion?
- the ability to pick custom lucide-icons for the modules
- editing the segment should change the nested layout, not go to a new page
- experiment with having "new segment" show a modal with the form
