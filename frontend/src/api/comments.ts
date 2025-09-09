import { api } from "./client";
import type { Comment, Paginated } from "../types/comment";

const base = "/comments/"; // endpoint

export async function listComments(cursor?: string) {
  const url = cursor ? `${base}?cursor=${encodeURIComponent(cursor)}` : base;
  const res = await api.get<Comment[] | Paginated<Comment>>(url);
  // normalize shape
  const data = res.data as any;
  if (Array.isArray(data)) {
    return { results: data, next: null as string | null };
  }
  return { results: data.results, next: data.next ?? null };
}

export async function addComment(text: string, images: string[] = []) {
  const res = await api.post<Comment>(base, { text, images }); // create
  return res.data;
}

export async function editComment(id: string, text: string) {
  const res = await api.patch<Comment>(`${base}${id}/`, { text }); // update
  return res.data;
}

export async function deleteComment(id: string) {
  await api.delete(`${base}${id}/`); // remove
}