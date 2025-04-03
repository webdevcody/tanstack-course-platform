/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UnauthorizedImport } from './routes/unauthorized'
import { Route as UnauthenticatedImport } from './routes/unauthenticated'
import { Route as TermsOfServiceImport } from './routes/terms-of-service'
import { Route as SuccessImport } from './routes/success'
import { Route as PurchaseImport } from './routes/purchase'
import { Route as PrivacyPolicyImport } from './routes/privacy-policy'
import { Route as LoginImport } from './routes/login'
import { Route as CreateTestimonialImport } from './routes/create-testimonial'
import { Route as CancelImport } from './routes/cancel'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as LearnIndexImport } from './routes/learn/index'
import { Route as LearnNotFoundImport } from './routes/learn/not-found'
import { Route as LearnNoSegmentsImport } from './routes/learn/no-segments'
import { Route as LearnCourseCompletedImport } from './routes/learn/course-completed'
import { Route as LearnAddImport } from './routes/learn/add'
import { Route as LearnSlugEditImport } from './routes/learn/$slug/edit'
import { Route as LearnSlugLayoutImport } from './routes/learn/$slug/_layout'
import { Route as LearnSlugLayoutIndexImport } from './routes/learn/$slug/_layout.index'

// Create Virtual Routes

const LearnSlugImport = createFileRoute('/learn/$slug')()

// Create/Update Routes

const UnauthorizedRoute = UnauthorizedImport.update({
  id: '/unauthorized',
  path: '/unauthorized',
  getParentRoute: () => rootRoute,
} as any)

const UnauthenticatedRoute = UnauthenticatedImport.update({
  id: '/unauthenticated',
  path: '/unauthenticated',
  getParentRoute: () => rootRoute,
} as any)

const TermsOfServiceRoute = TermsOfServiceImport.update({
  id: '/terms-of-service',
  path: '/terms-of-service',
  getParentRoute: () => rootRoute,
} as any)

const SuccessRoute = SuccessImport.update({
  id: '/success',
  path: '/success',
  getParentRoute: () => rootRoute,
} as any)

const PurchaseRoute = PurchaseImport.update({
  id: '/purchase',
  path: '/purchase',
  getParentRoute: () => rootRoute,
} as any)

const PrivacyPolicyRoute = PrivacyPolicyImport.update({
  id: '/privacy-policy',
  path: '/privacy-policy',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const CreateTestimonialRoute = CreateTestimonialImport.update({
  id: '/create-testimonial',
  path: '/create-testimonial',
  getParentRoute: () => rootRoute,
} as any)

const CancelRoute = CancelImport.update({
  id: '/cancel',
  path: '/cancel',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LearnSlugRoute = LearnSlugImport.update({
  id: '/learn/$slug',
  path: '/learn/$slug',
  getParentRoute: () => rootRoute,
} as any)

const LearnIndexRoute = LearnIndexImport.update({
  id: '/learn/',
  path: '/learn/',
  getParentRoute: () => rootRoute,
} as any)

const LearnNotFoundRoute = LearnNotFoundImport.update({
  id: '/learn/not-found',
  path: '/learn/not-found',
  getParentRoute: () => rootRoute,
} as any)

const LearnNoSegmentsRoute = LearnNoSegmentsImport.update({
  id: '/learn/no-segments',
  path: '/learn/no-segments',
  getParentRoute: () => rootRoute,
} as any)

const LearnCourseCompletedRoute = LearnCourseCompletedImport.update({
  id: '/learn/course-completed',
  path: '/learn/course-completed',
  getParentRoute: () => rootRoute,
} as any)

const LearnAddRoute = LearnAddImport.update({
  id: '/learn/add',
  path: '/learn/add',
  getParentRoute: () => rootRoute,
} as any)

const LearnSlugEditRoute = LearnSlugEditImport.update({
  id: '/edit',
  path: '/edit',
  getParentRoute: () => LearnSlugRoute,
} as any)

const LearnSlugLayoutRoute = LearnSlugLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => LearnSlugRoute,
} as any)

const LearnSlugLayoutIndexRoute = LearnSlugLayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LearnSlugLayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/cancel': {
      id: '/cancel'
      path: '/cancel'
      fullPath: '/cancel'
      preLoaderRoute: typeof CancelImport
      parentRoute: typeof rootRoute
    }
    '/create-testimonial': {
      id: '/create-testimonial'
      path: '/create-testimonial'
      fullPath: '/create-testimonial'
      preLoaderRoute: typeof CreateTestimonialImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/privacy-policy': {
      id: '/privacy-policy'
      path: '/privacy-policy'
      fullPath: '/privacy-policy'
      preLoaderRoute: typeof PrivacyPolicyImport
      parentRoute: typeof rootRoute
    }
    '/purchase': {
      id: '/purchase'
      path: '/purchase'
      fullPath: '/purchase'
      preLoaderRoute: typeof PurchaseImport
      parentRoute: typeof rootRoute
    }
    '/success': {
      id: '/success'
      path: '/success'
      fullPath: '/success'
      preLoaderRoute: typeof SuccessImport
      parentRoute: typeof rootRoute
    }
    '/terms-of-service': {
      id: '/terms-of-service'
      path: '/terms-of-service'
      fullPath: '/terms-of-service'
      preLoaderRoute: typeof TermsOfServiceImport
      parentRoute: typeof rootRoute
    }
    '/unauthenticated': {
      id: '/unauthenticated'
      path: '/unauthenticated'
      fullPath: '/unauthenticated'
      preLoaderRoute: typeof UnauthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/unauthorized': {
      id: '/unauthorized'
      path: '/unauthorized'
      fullPath: '/unauthorized'
      preLoaderRoute: typeof UnauthorizedImport
      parentRoute: typeof rootRoute
    }
    '/learn/add': {
      id: '/learn/add'
      path: '/learn/add'
      fullPath: '/learn/add'
      preLoaderRoute: typeof LearnAddImport
      parentRoute: typeof rootRoute
    }
    '/learn/course-completed': {
      id: '/learn/course-completed'
      path: '/learn/course-completed'
      fullPath: '/learn/course-completed'
      preLoaderRoute: typeof LearnCourseCompletedImport
      parentRoute: typeof rootRoute
    }
    '/learn/no-segments': {
      id: '/learn/no-segments'
      path: '/learn/no-segments'
      fullPath: '/learn/no-segments'
      preLoaderRoute: typeof LearnNoSegmentsImport
      parentRoute: typeof rootRoute
    }
    '/learn/not-found': {
      id: '/learn/not-found'
      path: '/learn/not-found'
      fullPath: '/learn/not-found'
      preLoaderRoute: typeof LearnNotFoundImport
      parentRoute: typeof rootRoute
    }
    '/learn/': {
      id: '/learn/'
      path: '/learn'
      fullPath: '/learn'
      preLoaderRoute: typeof LearnIndexImport
      parentRoute: typeof rootRoute
    }
    '/learn/$slug': {
      id: '/learn/$slug'
      path: '/learn/$slug'
      fullPath: '/learn/$slug'
      preLoaderRoute: typeof LearnSlugImport
      parentRoute: typeof rootRoute
    }
    '/learn/$slug/_layout': {
      id: '/learn/$slug/_layout'
      path: '/learn/$slug'
      fullPath: '/learn/$slug'
      preLoaderRoute: typeof LearnSlugLayoutImport
      parentRoute: typeof LearnSlugRoute
    }
    '/learn/$slug/edit': {
      id: '/learn/$slug/edit'
      path: '/edit'
      fullPath: '/learn/$slug/edit'
      preLoaderRoute: typeof LearnSlugEditImport
      parentRoute: typeof LearnSlugImport
    }
    '/learn/$slug/_layout/': {
      id: '/learn/$slug/_layout/'
      path: '/'
      fullPath: '/learn/$slug/'
      preLoaderRoute: typeof LearnSlugLayoutIndexImport
      parentRoute: typeof LearnSlugLayoutImport
    }
  }
}

// Create and export the route tree

interface LearnSlugLayoutRouteChildren {
  LearnSlugLayoutIndexRoute: typeof LearnSlugLayoutIndexRoute
}

const LearnSlugLayoutRouteChildren: LearnSlugLayoutRouteChildren = {
  LearnSlugLayoutIndexRoute: LearnSlugLayoutIndexRoute,
}

const LearnSlugLayoutRouteWithChildren = LearnSlugLayoutRoute._addFileChildren(
  LearnSlugLayoutRouteChildren,
)

interface LearnSlugRouteChildren {
  LearnSlugLayoutRoute: typeof LearnSlugLayoutRouteWithChildren
  LearnSlugEditRoute: typeof LearnSlugEditRoute
}

const LearnSlugRouteChildren: LearnSlugRouteChildren = {
  LearnSlugLayoutRoute: LearnSlugLayoutRouteWithChildren,
  LearnSlugEditRoute: LearnSlugEditRoute,
}

const LearnSlugRouteWithChildren = LearnSlugRoute._addFileChildren(
  LearnSlugRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cancel': typeof CancelRoute
  '/create-testimonial': typeof CreateTestimonialRoute
  '/login': typeof LoginRoute
  '/privacy-policy': typeof PrivacyPolicyRoute
  '/purchase': typeof PurchaseRoute
  '/success': typeof SuccessRoute
  '/terms-of-service': typeof TermsOfServiceRoute
  '/unauthenticated': typeof UnauthenticatedRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/learn/add': typeof LearnAddRoute
  '/learn/course-completed': typeof LearnCourseCompletedRoute
  '/learn/no-segments': typeof LearnNoSegmentsRoute
  '/learn/not-found': typeof LearnNotFoundRoute
  '/learn': typeof LearnIndexRoute
  '/learn/$slug': typeof LearnSlugLayoutRouteWithChildren
  '/learn/$slug/edit': typeof LearnSlugEditRoute
  '/learn/$slug/': typeof LearnSlugLayoutIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cancel': typeof CancelRoute
  '/create-testimonial': typeof CreateTestimonialRoute
  '/login': typeof LoginRoute
  '/privacy-policy': typeof PrivacyPolicyRoute
  '/purchase': typeof PurchaseRoute
  '/success': typeof SuccessRoute
  '/terms-of-service': typeof TermsOfServiceRoute
  '/unauthenticated': typeof UnauthenticatedRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/learn/add': typeof LearnAddRoute
  '/learn/course-completed': typeof LearnCourseCompletedRoute
  '/learn/no-segments': typeof LearnNoSegmentsRoute
  '/learn/not-found': typeof LearnNotFoundRoute
  '/learn': typeof LearnIndexRoute
  '/learn/$slug': typeof LearnSlugLayoutIndexRoute
  '/learn/$slug/edit': typeof LearnSlugEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cancel': typeof CancelRoute
  '/create-testimonial': typeof CreateTestimonialRoute
  '/login': typeof LoginRoute
  '/privacy-policy': typeof PrivacyPolicyRoute
  '/purchase': typeof PurchaseRoute
  '/success': typeof SuccessRoute
  '/terms-of-service': typeof TermsOfServiceRoute
  '/unauthenticated': typeof UnauthenticatedRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/learn/add': typeof LearnAddRoute
  '/learn/course-completed': typeof LearnCourseCompletedRoute
  '/learn/no-segments': typeof LearnNoSegmentsRoute
  '/learn/not-found': typeof LearnNotFoundRoute
  '/learn/': typeof LearnIndexRoute
  '/learn/$slug': typeof LearnSlugRouteWithChildren
  '/learn/$slug/_layout': typeof LearnSlugLayoutRouteWithChildren
  '/learn/$slug/edit': typeof LearnSlugEditRoute
  '/learn/$slug/_layout/': typeof LearnSlugLayoutIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/cancel'
    | '/create-testimonial'
    | '/login'
    | '/privacy-policy'
    | '/purchase'
    | '/success'
    | '/terms-of-service'
    | '/unauthenticated'
    | '/unauthorized'
    | '/learn/add'
    | '/learn/course-completed'
    | '/learn/no-segments'
    | '/learn/not-found'
    | '/learn'
    | '/learn/$slug'
    | '/learn/$slug/edit'
    | '/learn/$slug/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/cancel'
    | '/create-testimonial'
    | '/login'
    | '/privacy-policy'
    | '/purchase'
    | '/success'
    | '/terms-of-service'
    | '/unauthenticated'
    | '/unauthorized'
    | '/learn/add'
    | '/learn/course-completed'
    | '/learn/no-segments'
    | '/learn/not-found'
    | '/learn'
    | '/learn/$slug'
    | '/learn/$slug/edit'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/cancel'
    | '/create-testimonial'
    | '/login'
    | '/privacy-policy'
    | '/purchase'
    | '/success'
    | '/terms-of-service'
    | '/unauthenticated'
    | '/unauthorized'
    | '/learn/add'
    | '/learn/course-completed'
    | '/learn/no-segments'
    | '/learn/not-found'
    | '/learn/'
    | '/learn/$slug'
    | '/learn/$slug/_layout'
    | '/learn/$slug/edit'
    | '/learn/$slug/_layout/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  CancelRoute: typeof CancelRoute
  CreateTestimonialRoute: typeof CreateTestimonialRoute
  LoginRoute: typeof LoginRoute
  PrivacyPolicyRoute: typeof PrivacyPolicyRoute
  PurchaseRoute: typeof PurchaseRoute
  SuccessRoute: typeof SuccessRoute
  TermsOfServiceRoute: typeof TermsOfServiceRoute
  UnauthenticatedRoute: typeof UnauthenticatedRoute
  UnauthorizedRoute: typeof UnauthorizedRoute
  LearnAddRoute: typeof LearnAddRoute
  LearnCourseCompletedRoute: typeof LearnCourseCompletedRoute
  LearnNoSegmentsRoute: typeof LearnNoSegmentsRoute
  LearnNotFoundRoute: typeof LearnNotFoundRoute
  LearnIndexRoute: typeof LearnIndexRoute
  LearnSlugRoute: typeof LearnSlugRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  CancelRoute: CancelRoute,
  CreateTestimonialRoute: CreateTestimonialRoute,
  LoginRoute: LoginRoute,
  PrivacyPolicyRoute: PrivacyPolicyRoute,
  PurchaseRoute: PurchaseRoute,
  SuccessRoute: SuccessRoute,
  TermsOfServiceRoute: TermsOfServiceRoute,
  UnauthenticatedRoute: UnauthenticatedRoute,
  UnauthorizedRoute: UnauthorizedRoute,
  LearnAddRoute: LearnAddRoute,
  LearnCourseCompletedRoute: LearnCourseCompletedRoute,
  LearnNoSegmentsRoute: LearnNoSegmentsRoute,
  LearnNotFoundRoute: LearnNotFoundRoute,
  LearnIndexRoute: LearnIndexRoute,
  LearnSlugRoute: LearnSlugRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/cancel",
        "/create-testimonial",
        "/login",
        "/privacy-policy",
        "/purchase",
        "/success",
        "/terms-of-service",
        "/unauthenticated",
        "/unauthorized",
        "/learn/add",
        "/learn/course-completed",
        "/learn/no-segments",
        "/learn/not-found",
        "/learn/",
        "/learn/$slug"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/cancel": {
      "filePath": "cancel.tsx"
    },
    "/create-testimonial": {
      "filePath": "create-testimonial.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/privacy-policy": {
      "filePath": "privacy-policy.tsx"
    },
    "/purchase": {
      "filePath": "purchase.tsx"
    },
    "/success": {
      "filePath": "success.tsx"
    },
    "/terms-of-service": {
      "filePath": "terms-of-service.tsx"
    },
    "/unauthenticated": {
      "filePath": "unauthenticated.tsx"
    },
    "/unauthorized": {
      "filePath": "unauthorized.tsx"
    },
    "/learn/add": {
      "filePath": "learn/add.tsx"
    },
    "/learn/course-completed": {
      "filePath": "learn/course-completed.tsx"
    },
    "/learn/no-segments": {
      "filePath": "learn/no-segments.tsx"
    },
    "/learn/not-found": {
      "filePath": "learn/not-found.tsx"
    },
    "/learn/": {
      "filePath": "learn/index.tsx"
    },
    "/learn/$slug": {
      "filePath": "learn/$slug",
      "children": [
        "/learn/$slug/_layout",
        "/learn/$slug/edit"
      ]
    },
    "/learn/$slug/_layout": {
      "filePath": "learn/$slug/_layout.tsx",
      "parent": "/learn/$slug",
      "children": [
        "/learn/$slug/_layout/"
      ]
    },
    "/learn/$slug/edit": {
      "filePath": "learn/$slug/edit.tsx",
      "parent": "/learn/$slug"
    },
    "/learn/$slug/_layout/": {
      "filePath": "learn/$slug/_layout.index.tsx",
      "parent": "/learn/$slug/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
