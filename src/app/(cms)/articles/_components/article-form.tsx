"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CreateArticleForm } from "@/validations/article/article-validation";
import { UseFormReturn } from "react-hook-form";
import { Category } from "@/types/article/category";
import { Tag } from "@/types/article/tag";
import { Badge } from "@/components/ui/badge";
import { X, Plus, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaPageContent } from "../../media/_components/media-page-content";
import { getMediaUrl } from "@/lib/media-utils";
import { MediaFile } from "@/types/media/media";
import { Editor } from "@tinymce/tinymce-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ArticleFormProps {
  form: UseFormReturn<CreateArticleForm>;
  onSubmit: (data: CreateArticleForm) => void;
  loading: boolean;
  isSlugTouched: boolean;
  setIsSlugTouched: (value: boolean) => void;
  handleTitleChange: (value: string) => void;
  resetSlug: () => void;
  categories: Category[];
  tags: Tag[];
  submitLabel?: string;
  initialThumbnail?: MediaFile | null;
}

export function ArticleForm({
  form,
  onSubmit,
  loading,
  isSlugTouched,
  setIsSlugTouched,
  handleTitleChange,
  resetSlug,
  categories,
  tags,
  submitLabel = "Create Article",
  initialThumbnail,
}: ArticleFormProps) {
  const [newKeyword, setNewKeyword] = useState("");

  const thumbnailId = form.watch("thumbnailId");
  const publicationId = form.watch("publicationId");

  const [selectedThumbnail, setSelectedThumbnail] = useState<MediaFile | null>(
    initialThumbnail ?? null,
  );

  const [selectedPublication, setSelectedPublication] =
    useState<MediaFile | null>(null);

  const [open, setOpen] = useState(false);
  const [openPublication, setOpenPublication] = useState(false);

  const addSeoKeyword = () => {
    if (!newKeyword.trim()) return;

    const currentKeywords = form.getValues("seoKeywords") || [];
    const newOrder = currentKeywords.length;

    form.setValue("seoKeywords", [
      ...currentKeywords,
      { keyword: newKeyword.trim(), order: newOrder },
    ]);
    setNewKeyword("");
  };

  const removeSeoKeyword = (index: number) => {
    const currentKeywords = form.getValues("seoKeywords") || [];
    form.setValue(
      "seoKeywords",
      currentKeywords.filter((_, i) => i !== index),
    );
  };

  const moveKeywordUp = (index: number) => {
    if (index === 0) return;
    const currentKeywords = [...(form.getValues("seoKeywords") || [])];
    [currentKeywords[index], currentKeywords[index - 1]] = [
      currentKeywords[index - 1],
      currentKeywords[index],
    ];
    currentKeywords.forEach((kw, i) => {
      kw.order = i;
    });
    form.setValue("seoKeywords", currentKeywords);
  };

  const moveKeywordDown = (index: number) => {
    const currentKeywords = [...(form.getValues("seoKeywords") || [])];
    if (index === currentKeywords.length - 1) return;
    [currentKeywords[index], currentKeywords[index + 1]] = [
      currentKeywords[index + 1],
      currentKeywords[index],
    ];
    currentKeywords.forEach((kw, i) => {
      kw.order = i;
    });
    form.setValue("seoKeywords", currentKeywords);
  };

  const seoKeywords = form.watch("seoKeywords") || [];

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleTitleChange(e.target.value);
                                }}
                                placeholder="Enter article title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setIsSlugTouched(true);
                                  }}
                                  placeholder="article-slug"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={!isSlugTouched}
                                onClick={resetSlug}
                              >
                                Reset
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="thumbnailId"
                        render={() => (
                          <FormItem>
                            <FormLabel>Thumbnail</FormLabel>

                            <div className="items-center gap-4 space-y-4">
                              {thumbnailId ? (
                                <div className="relative w-full h-32 border rounded overflow-hidden">
                                  {selectedThumbnail ? (
                                    <img
                                      src={getMediaUrl(selectedThumbnail.url)}
                                      alt={
                                        selectedThumbnail.altText ?? "Thumbnail"
                                      }
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-32 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                                      No thumbnail
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="w-full h-32 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                                  No thumbnail
                                </div>
                              )}

                              <div className="space-y-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setOpen(true)}
                                  className="w-full"
                                >
                                  {thumbnailId
                                    ? "Change Thumbnail"
                                    : "Add Thumbnail"}
                                </Button>

                                {thumbnailId && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                      form.setValue("thumbnailId", null);
                                      setSelectedThumbnail(null);
                                    }}
                                    className="w-full"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Brief summary of the article"
                                // rows={15}
                                className="h-40 resize-none overflow-y-auto"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const current = field.value || [];
                                if (!current.includes(value)) {
                                  field.onChange([...current, value]);
                                }
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Add tags" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tags.map((tag) => (
                                  <SelectItem key={tag.id} value={tag.id}>
                                    {tag.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {field.value && field.value.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value.map((tagId: string) => {
                                  const tag = tags.find((t) => t.id === tagId);
                                  return (
                                    <Badge key={tagId} variant="secondary">
                                      {tag?.name}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          field.onChange(
                                            field.value?.filter(
                                              (id: string) => id !== tagId,
                                            ) || [],
                                          );
                                        }}
                                        className="ml-2 hover:text-destructive"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}
                            <FormDescription>
                              Select one or more tags
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">
                      Publishing Settings
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="publicationId"
                        render={() => (
                          <FormItem>
                            <FormLabel>Publication</FormLabel>

                            <div className="items-center gap-4 space-y-4">
                              {publicationId ? (
                                <div className="relative w-full h-32 border rounded overflow-hidden flex items-center justify-center bg-muted">
                                  {selectedPublication ? (
                                    <div className="text-center px-2">
                                      <p className="text-sm font-medium truncate">
                                        {selectedPublication.title ??
                                          selectedPublication.fileName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {selectedPublication.mimeType}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground">
                                      Publication selected
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="w-full h-32 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                                  No publication
                                </div>
                              )}

                              <div className="space-y-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setOpenPublication(true)}
                                  className="w-full"
                                >
                                  {publicationId
                                    ? "Change Publication"
                                    : "Add Publication"}
                                </Button>

                                {publicationId && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                      form.setValue("publicationId", null);
                                      setSelectedPublication(null);
                                    }}
                                    className="w-full"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </div>

                            <FormDescription>
                              Attach a publication file (PDF, document, etc.)
                            </FormDescription>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">
                                  Published
                                </SelectItem>
                                <SelectItem value="scheduled">
                                  Scheduled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("status") === "published" && (
                        <FormField
                          control={form.control}
                          name="publishedAt"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Published At</FormLabel>

                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value
                                        ? format(
                                            new Date(field.value),
                                            "PPP HH:mm",
                                          )
                                        : "Pick publish date"}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>

                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      if (!date) return;
                                      field.onChange(date.toISOString());
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {form.watch("status") === "scheduled" && (
                        <FormField
                          control={form.control}
                          name="scheduledAt"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Scheduled At</FormLabel>

                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value
                                        ? format(
                                            new Date(field.value),
                                            "PPP HH:mm",
                                          )
                                        : "Pick schedule date"}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>

                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      if (!date) return;
                                      field.onChange(date.toISOString());
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Featured Article
                              </FormLabel>
                              <FormDescription>
                                Mark this article as featured
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">SEO Settings</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="SEO meta title"
                              />
                            </FormControl>
                            <FormDescription>
                              Max 60 characters for optimal SEO
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                value={field.value || ""}
                                placeholder="SEO meta description"
                                rows={2}
                              />
                            </FormControl>
                            <FormDescription>
                              Max 160 characters for optimal SEO
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="seoKeywords"
                        render={() => (
                          <FormItem>
                            <FormLabel>SEO Keywords</FormLabel>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={newKeyword}
                                  onChange={(e) =>
                                    setNewKeyword(e.target.value)
                                  }
                                  placeholder="Enter SEO keyword"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addSeoKeyword();
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={addSeoKeyword}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {seoKeywords.length > 0 && (
                                <div className="space-y-2 border rounded-md p-3">
                                  {seoKeywords.map((keyword, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between gap-2 p-2 bg-muted rounded"
                                    >
                                      <span className="text-sm">
                                        {index + 1}. {keyword.keyword}
                                      </span>
                                      <div className="flex gap-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => moveKeywordUp(index)}
                                          disabled={index === 0}
                                        >
                                          ↑
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => moveKeywordDown(index)}
                                          disabled={
                                            index === seoKeywords.length - 1
                                          }
                                        >
                                          ↓
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeSeoKeyword(index)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <FormDescription>
                              Add SEO keywords and arrange them by priority
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Content</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Editor
                                  apiKey={
                                    process.env.NEXT_PUBLIC_TINYMCE_API_KEY
                                  }
                                  value={field.value || ""}
                                  onEditorChange={(value) =>
                                    field.onChange(value)
                                  }
                                  init={{
                                    height: 1500,
                                    resize: false,
                                    menubar: false,

                                    relative_urls: false,
                                    remove_script_host: false,
                                    convert_urls: true,

                                    image_dimensions: true,
                                    automatic_uploads: true,
                                    images_upload_handler: async (blobInfo) => {
                                      const formData = new FormData();
                                      formData.append(
                                        "file",
                                        blobInfo.blob(),
                                        blobInfo.filename(),
                                      );
                                      const res = await fetch(
                                        "http://localhost:4000/api/cms/media",
                                        {
                                          method: "POST",
                                          credentials: "include",
                                          body: formData,
                                        },
                                      );
                                      if (!res.ok)
                                        throw new Error("Image upload failed");
                                      const json: { url: string } =
                                        await res.json();
                                      return `http://localhost:4000${json.url}`;
                                    },

                                    plugins: [
                                      "anchor",
                                      "autolink",
                                      "autosave",
                                      "charmap",
                                      "code",
                                      "codesample",
                                      "directionality",
                                      "emoticons",
                                      "fullscreen",
                                      "help",
                                      "image",
                                      "importcss",
                                      "insertdatetime",
                                      "link",
                                      "lists",
                                      "media",
                                      "nonbreaking",
                                      "pagebreak",
                                      "preview",
                                      "quickbars",
                                      "save",
                                      "searchreplace",
                                      "table",
                                      "visualblocks",
                                      "visualchars",
                                      "wordcount",
                                    ],

                                    toolbar:
                                      "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",

                                    content_style: `
                                      body {
                                        font-family: Inter, Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        line-height: 1.6;
                                      }
                                    `,
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center border-t pt-4 mt-2 justify-end gap-4">
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : submitLabel}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-none max-w-[95vw] w-[95vw] h-[90vh] p-6 flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Thumbnail</DialogTitle>
            <DialogDescription>
              Choose an image from media library to use as article thumbnail.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto">
            <MediaPageContent
              onSelectImageExternal={(media) => {
                form.setValue("thumbnailId", media.id);
                setSelectedThumbnail(media);
                setOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openPublication} onOpenChange={setOpenPublication}>
        <DialogContent className="sm:max-w-none max-w-[95vw] w-[95vw] h-[90vh] p-6 flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Publication</DialogTitle>
            <DialogDescription>
              Choose a file from media library to attach as publication.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto">
            <MediaPageContent
              onSelectImageExternal={(media) => {
                form.setValue("publicationId", media.id);
                setSelectedPublication(media);
                setOpenPublication(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
