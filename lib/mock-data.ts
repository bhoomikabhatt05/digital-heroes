// Fallback data when Supabase not configured
import type { Charity } from "./types";

export const mockCharities: Charity[] = [
  {
    id: "1",
    name: "Ocean Guardians",
    slug: "ocean-guardians",
    description: "Protecting marine ecosystems and coastal communities through direct action and education.",
    image_url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Future Greens",
    slug: "future-greens",
    description: "Rewilding fairways and funding sustainable golf initiatives worldwide.",
    image_url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Youth Swing",
    slug: "youth-swing",
    description: "Bringing golf to underprivileged youth - equipment, coaching, opportunity.",
    image_url: "https://images.unsplash.com/photo-1591491719565-25c6c0f66a56?w=600",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Mind & Motion",
    slug: "mind-motion",
    description: "Mental health support for athletes through sport psychology and community.",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Play Forward",
    slug: "play-forward",
    description: "Building accessible sports facilities in underserved communities.",
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Clean Fairways",
    slug: "clean-fairways",
    description: "Carbon-neutral golf events and course sustainability certification.",
    image_url: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const mockStats = {
  totalUsers: 12483,
  activeSubscribers: 8921,
  prizePool: 89340,
  charityTotal: 142800,
  nextDraw: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(),
};
