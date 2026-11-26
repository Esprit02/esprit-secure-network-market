
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "EspritAccess — Your Gateway to Digital Access",
      },
      {
        name: "description",
        content:
          "EspritAccess provides easy access to VPN services, virtual numbers, digital subscriptions, privacy tools and digital resources.",
      },
      {
        name: "theme-color",
        content: "#040711",
      },
      {
        property: "og:title",
        content: "EspritAccess — Your Gateway to Digital Access",
      },
      {
        property: "og:description",
        content:
          "Your trusted gateway to digital access, connectivity and online resources.",
      },
      {
        property: "og:image",
        content: "https://espritaccess.com.ng/favicon.png",
      },
      {
        property: "og:url",
        content: "https://espritaccess.com.ng",
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:image",
        content: "https://espritaccess.com.ng/favicon.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
      {
        rel: "apple-touch-icon",
        href: "/favicon.png",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en" className="dark bg-[#040711]">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-[#040711] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
