import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl || imageUrl === "") return "/placeholder.svg";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return imageUrl;
  return `/placeholder.svg`;
};