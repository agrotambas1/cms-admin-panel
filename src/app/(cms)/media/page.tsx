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

// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { MediaFile } from "../../../types/media/media";
// import { MediaUploadTab } from "./_components/media-upload-tab";
// import { MediaLibraryTab } from "./_components/media-library-tab";
// import { useMedia } from "../../../hooks/media/use-media";
// import { Button } from "@/components/ui/button";
// import { SearchFilter } from "@/components/common/filters/search-filter";

// export default function MediaPage() {
//   const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
//   const [bulkMode, setBulkMode] = useState(false);
//   const [search, setSearch] = useState("");

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(40);

//   const { mediaList, loading, pagination, refetch } = useMedia({
//     search,
//     page,
//     limit,
//   });

//   const handleUpdateDetail = (field: keyof MediaFile, value: string) => {
//     if (!selectedImage) return;

//     const updated = { ...selectedImage, [field]: value };
//     setSelectedImage(updated);
//   };

//   const handleUploadSuccess = () => {
//     refetch();
//   };

//   const handleDeleteSuccess = () => {
//     refetch();
//     setSelectedImage(null);
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     setSelectedImage(null); // UX penting
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setPage(1);
//     setSelectedImage(null);
//   };

//   return (
//     <div className="w-full space-y-4">
//       <h1 className="text-xl font-bold">Media</h1>

//       <Tabs
//         defaultValue="library"
//         className="flex-1 flex flex-col overflow-hidden space-y-2"
//       >
//         <TabsList>
//           <TabsTrigger value="upload">Upload File</TabsTrigger>
//           <TabsTrigger value="library">Library</TabsTrigger>
//         </TabsList>

//         <TabsContent value="upload" className="flex-1 m-0">
//           <MediaUploadTab onUploadSuccess={handleUploadSuccess} />
//         </TabsContent>

//         <TabsContent value="library" className="flex-1 m-0 space-y-2">
//           <div className="flex flex-row gap-2">
//             <SearchFilter
//               searchValue={search}
//               onSearchChange={(value) => {
//                 setSearch(value);
//                 setPage(1);
//                 setBulkMode(false);
//                 setSelectedImage(null);
//               }}
//               searchPlaceholder="Search media..."
//             />
//             <Button
//               variant={bulkMode ? "secondary" : "outline"}
//               onClick={() => {
//                 setBulkMode((prev) => !prev);
//                 setSelectedImage(null);
//               }}
//             >
//               {bulkMode ? "Exit Bulk Mode" : "Bulk Select"}
//             </Button>
//           </div>

//           <MediaLibraryTab
//             mediaList={mediaList}
//             selectedImage={selectedImage}
//             onSelectImage={setSelectedImage}
//             onUpdateDetail={handleUpdateDetail}
//             onDeleteSuccess={handleDeleteSuccess}
//             loading={loading}
//             pagination={{
//               page,
//               limit,
//               total: pagination.total,
//             }}
//             onPageChange={handlePageChange}
//             onLimitChange={handleLimitChange}
//             bulkMode={bulkMode}
//             onExitBulkMode={() => setBulkMode(false)}
//           />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
