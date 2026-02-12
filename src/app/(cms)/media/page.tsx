"use client";

import { MediaPageContent } from "./_components/media-page-content";

export default function MediaPage() {
  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Media</h1>
      <MediaPageContent />
    </div>
  );
}
