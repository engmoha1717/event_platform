// import { authMiddleware } from "@clerk/nextjs/server";
// // import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: [
//     '/',
//     '/events/:id',
//     '/api/webhooks/clerk',
//     '/api/webhooks/stripe',
//     '/api/uploadthing'
//   ],
//   ignoredRoutes: [
//     '/api/webhooks/clerk',
//     '/api/webhooks/stripe',
//     '/api/uploadthing'
//   ]
// });

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };

import { NextResponse } from 'next/server';
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware((req) => {
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/events/:id',
    '/api/webhooks/clerk',
    '/api/webhooks/stripe',
    '/api/uploadthing',
     
  ];

  // Check if the current request URL matches any public route
  if (publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Define ignored routes (routes that should bypass Clerk's authentication logic)
  const ignoredRoutes = [
    '/api/webhooks/clerk',
    '/api/webhooks/stripe',
    '/api/uploadthing'
  ];

  // Check if the current request URL matches any ignored route
  if (ignoredRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // All other routes will require authentication
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

 

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware({});

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };