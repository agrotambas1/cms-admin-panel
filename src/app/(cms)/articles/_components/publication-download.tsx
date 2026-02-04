import { Button } from "@/components/ui/button";
import { useDownloadMedia } from "@/hooks/media/use-media";
import { Download, FileText } from "lucide-react";
import { MediaFile } from "@/types/media/media";

interface PublicationDownloadProps {
  media: {
    id: string;
    fileName: string;
    url: string;
    mimeType?: string;
  };
}

export function PublicationDownload({ media }: PublicationDownloadProps) {
  const adaptedMedia: MediaFile = {
    id: media.id,
    fileName: media.fileName,
    title: media.fileName,
    description: "",
    url: media.url,
    altText: "",
    caption: "",
    mimeType: media.mimeType,
  };

  const { downloading, downloadMedia } = useDownloadMedia({
    media: adaptedMedia,
  });

  return (
    <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium truncate">
          {adaptedMedia.fileName}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={downloading}
        onClick={downloadMedia}
      >
        <Download className="h-4 w-4 mr-2" />
        {downloading ? "Downloading..." : "Download"}
      </Button>
    </div>
  );
}
