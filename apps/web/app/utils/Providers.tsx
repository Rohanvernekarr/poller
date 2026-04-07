"use client";

import { SessionProvider, useSession } from "next-auth/react";
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    person_profiles: 'always', // Switching to always for better debugging
    capture_pageview: false, // Disabling auto-pageview because we handle it manually for SPA routing
  })
}

function PostHogRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user?.id) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name
      });
    } else if (session === null) {
      posthog.reset();
    }
  }, [session]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostHogProvider client={posthog}>
        <PostHogAuthWrapper>
          <Suspense>
            <PostHogRouteTracker />
          </Suspense>
          {children}
        </PostHogAuthWrapper>
      </PostHogProvider>
    </SessionProvider>
  );
}
