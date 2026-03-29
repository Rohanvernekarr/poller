"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { formatDistanceToNow } from "date-fns";

export function CommentsSection({ pollId }: { pollId: string }) {
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, mutate } = useSWR(
    `/api/comments?pollId=${pollId}`,
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, text, authorName }),
      });
      setText("");
      mutate();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const comments = data?.comments || [];

  return (
    <div className="mt-8 border-t border-border pt-8">
      <h3 className="text-xl font-bold mb-6 text-foreground">Discussion</h3>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" isLoading={isSubmitting}>
            Post
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="p-4 rounded-xl bg-foreground/5 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-foreground">{comment.authorName || "Anonymous"}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-foreground text-sm">{comment.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">No comments yet.</div>
        )}
      </div>
    </div>
  );
}
