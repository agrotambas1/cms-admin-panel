"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaFile } from "@/types/media/media";
import { MediaUploadTab } from "./media-upload-tab";
import { MediaLibraryTab } from "./media-library-tab";
import { useMedia } from "@/hooks/media/use-media";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { canCreate, canDelete } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { MediaTypeFilter } from "@/components/common/filters/media-type-filter";

interface MediaPageContentProps {
  onSelectImageExternal?: (media: MediaFile) => void;
  defaultType?: string;
  hideTypeFilter?: boolean;
}

export function MediaPageContent({
  onSelectImageExternal,
  defaultType = "all",
  hideTypeFilter = false,
}: MediaPageContentProps) {
  const { role, loading: authLoading } = useCurrentUser();

  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(defaultType);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(40);

  const { mediaList, loading, pagination, refetch } = useMedia({
    search,
    page,
    limit,
    type,
  });

  const handleUpdateDetail = (field: keyof MediaFile, value: string) => {
    if (!selectedImage) return;
    setSelectedImage({ ...selectedImage, [field]: value });
  };

  const handleUploadSuccess = () => refetch();

  const handleDeleteSuccess = () => {
    refetch();
    setSelectedImage(null);
  };

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="library" className="flex flex-col space-y-2">
        <TabsList>
          {canCreate(role) && (
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          )}
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <MediaUploadTab onUploadSuccess={handleUploadSuccess} />
        </TabsContent>

        <TabsContent value="library" className="space-y-2">
          <div className="flex gap-2">
            <SearchFilter
              searchValue={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
                setBulkMode(false);
                setSelectedImage(null);
              }}
            />
            {!hideTypeFilter && (
              <MediaTypeFilter
                value={type}
                onChange={(value) => {
                  setType(value);
                  setPage(1);
                  setBulkMode(false);
                  setSelectedImage(null);
                }}
              />
            )}
            {canDelete(role) && (
              <Button
                variant={bulkMode ? "secondary" : "outline"}
                onClick={() => {
                  setBulkMode((prev) => !prev);
                  setSelectedImage(null);
                }}
              >
                {bulkMode ? "Exit Bulk Mode" : "Bulk Select"}
              </Button>
            )}
          </div>

          <div className="mb-16">
            <MediaLibraryTab
              mediaList={mediaList}
              selectedImage={selectedImage}
              onSelectImage={(media) => {
                setSelectedImage(media);
              }}
              onUpdateDetail={handleUpdateDetail}
              onDeleteSuccess={handleDeleteSuccess}
              loading={loading}
              pagination={{
                page,
                limit,
                total: pagination.total,
              }}
              onPageChange={setPage}
              onLimitChange={setLimit}
              bulkMode={bulkMode}
              onExitBulkMode={() => setBulkMode(false)}
            />
          </div>

          {onSelectImageExternal && (
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end gap-2 shadow-lg z-50">
              <Button variant="outline" onClick={() => setSelectedImage(null)}>
                Cancel
              </Button>

              <Button
                disabled={!selectedImage}
                onClick={() => {
                  if (!selectedImage) return;
                  onSelectImageExternal(selectedImage);
                }}
              >
                Choose
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
