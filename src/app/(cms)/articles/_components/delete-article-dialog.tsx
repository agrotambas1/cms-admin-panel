import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteArticle } from "@/hooks/articles/use-article";

interface Article {
  id: string;
  title: string;
}

interface DeleteArticleDialogProps {
  article: Article;
  open: boolean;
  canDelete: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteArticleDialog({
  article,
  open,
  canDelete,
  onOpenChange,
  onDeleted,
}: DeleteArticleDialogProps) {
  const { loading, deleteArticle } = useDeleteArticle({
    articleId: article.id,
    articleTitle: article.title,
    canDelete,
    onSuccess: () => {
      onOpenChange(false);
      onDeleted();
    },
  });

  const handleDelete = async () => {
    const result = await deleteArticle();
    if (result.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Article</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{article.title}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
