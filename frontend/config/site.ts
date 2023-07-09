export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Tim Morehouse Fencing Club",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Chat",
      href: "/chat",
    },
    {
      title: "Import",
      href: "/admin",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};
