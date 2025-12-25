import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return d.toLocaleDateString();
  }
}

export function generateInitials(name: string): string {
  if (!name) return '';
  
  const nameParts = name.split(' ');
  
  const firstPart = nameParts[0];
  const lastPart = nameParts[nameParts.length - 1];

  if (!firstPart) return '';

  if (nameParts.length === 1) {
    return firstPart.substring(0, 2).toUpperCase();
  }

  if (!lastPart) return firstPart.charAt(0).toUpperCase();

  return (
    firstPart.charAt(0).toUpperCase() +
    lastPart.charAt(0).toUpperCase()
  );
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}
