import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

export function userId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("f1_voter_id");
  if (!id) {
    id = nanoid();
    localStorage.setItem("f1_voter_id", id);
  }
  return id;
}
