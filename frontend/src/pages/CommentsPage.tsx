import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  listComments,
  addComment,
  editComment,
  deleteComment,
} from "../api/comments";
import type { Comment } from "../types/comment";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";
import { useMemo } from "react";

export default function CommentsPage() {
  const qc = useQueryClient(); // cache
  
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: ({ pageParam }: { pageParam?: string }) => listComments(pageParam),
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const results = useMemo(() => (data?.pages ?? []).flatMap((p) => p.results), [data]); // flatten

  const sorted = useMemo(
    () => [...results].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [results]
  ); // newest first

  const addMut = useMutation({
    mutationFn: (p: { text: string; images: string[] }) => addComment(p.text, p.images),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments"] }),
  });

  const editMut = useMutation({
    mutationFn: (p: { id: string; text: string }) => editComment(p.id, p.text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments"] }),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments"] }),
  });

  return (
    <>
      {/* top bar */}
      <div className="h-1.5 w-full bg-primary/80 my-6" data-test-id="top-bar" />

      <div className="w-full px-4 md:px-6 lg:px-8 space-y-6">
        {/* header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-fg font-serif tracking-tight">
            Comments left on our page
          </h1>
          <p className="text-muted mt-1">See what our users have been up to,
           and add, edit, or delete any comment as Admin.</p>
        </header>

        {/* states */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-card rounded-2xl shadow-card ring-1 ring-border overflow-hidden"
              >
                <div className="aspect-video bg-border/40" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-border/60 rounded w-2/3" />
                  <div className="h-3 bg-border/60 rounded w-1/2" />
                  <div className="h-20 bg-border/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-danger">Failed to load comments. Please refresh.</div>
        )}

        {!isLoading && !isError && sorted.length === 0 && (
          <div className="text-muted">No comments yet. Be the first!</div>
        )}

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {sorted.map((c: Comment) => (
            <CommentCard
              key={c.id}
              c={c}
              onEdit={(text) => editMut.mutate({ id: c.id, text })}
              onDelete={() => delMut.mutate(c.id)}
              className="w-full max-w-md"
            />
          ))}
        </div>

        {/* pagination */}
        {hasNextPage && (
          <div className="flex justify-center">
            <button
              className="mt-2 px-4 py-2 rounded-2xl bg-primary text-primaryFg hover:opacity-95 disabled:opacity-50"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? "Loading…" : "Load more"}
            </button>
          </div>
        )}

        <h3 className="text-4xl font-bold text-fg font-serif tracking-tight text-center">
          Leave additional comments as admin
        </h3>
        {/* composer */}
        <div className="mt-8">
          <CommentForm
            onSubmit={(text, images) => addMut.mutate({ text, images })}
          />
          {addMut.isError && (
            <div className="text-danger text-sm mt-2">
              Failed to add comment. Please try again.
            </div>
          )}
        </div>
      </div>

      {/* bottom bar */}
      <div className="h-1.5 w-full bg-primary/80 my-6" data-test-id="bottom-bar" />
    </>
  );
}