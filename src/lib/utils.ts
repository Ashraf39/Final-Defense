import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder.svg";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return imageUrl;
  if (imageUrl.startsWith("data:")) return imageUrl;
  return `/images/${imageUrl}`; // Handle relative paths in the images directory
};