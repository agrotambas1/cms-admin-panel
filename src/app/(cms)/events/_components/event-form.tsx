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
import { UseFormReturn } from "react-hook-form";
import { CreateEventForm } from "@/validations/event/event-validation";
import { X, Plus, CalendarIcon, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
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
import { cmsApi } from "@/lib/api";
import Link from "next/link";
import { Service } from "@/types/service/service";
import { Industry } from "@/types/industry/industry";

interface EventFormProps {
  form: UseFormReturn<CreateEventForm>;
  onSubmit: (data: CreateEventForm) => void;
  loading: boolean;
  isSlugTouched: boolean;
  setIsSlugTouched: (value: boolean) => void;
  handleEventNameChange: (value: string) => void;
  resetSlug: () => void;
  submitLabel?: string;
  initialThumbnail?: MediaFile | null;
  services: Service[];
  industries: Industry[];
}

export function EventForm({
  form,
  onSubmit,
  loading,
  isSlugTouched,
  setIsSlugTouched,
  handleEventNameChange,
  resetSlug,
  submitLabel,
  initialThumbnail,
  services,
  industries,
}: EventFormProps) {
  const thumbnailId = form.watch("thumbnailId");

  const [selectedThumbnail, setSelectedThumbnail] = useState<MediaFile | null>(
    initialThumbnail ?? null,
  );

  const [open, setOpen] = useState(false);

  const [showWarning, setShowWarning] = useState(false);

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
                    <p className="text-sm text-muted-foreground">
                      Add basic information about the case study
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="eventName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Event Name{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleEventNameChange(e.target.value);
                                }}
                                placeholder="Enter event name"
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
                                  placeholder="event-slug"
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
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value ?? undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="webinar">Webinar</SelectItem>
                                <SelectItem value="conference">
                                  Conference
                                </SelectItem>
                                <SelectItem value="roundtable">
                                  Roundtable
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select one solution
                            </FormDescription>
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
                            <FormLabel>
                              Excerpt{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                value={field.value ?? ""}
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
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service</FormLabel>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(val === "__NONE__" ? null : val)
                              }
                              value={field.value ?? "__NONE__"}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="__NONE__">
                                  Deselect
                                </SelectItem>
                                {services.map((service) => (
                                  <SelectItem
                                    key={service.id}
                                    value={service.id}
                                  >
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select one service
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(val === "__NONE__" ? null : val)
                              }
                              value={field.value ?? "__NONE__"}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="__NONE__">
                                  Deselect
                                </SelectItem>
                                {industries.map((industry) => (
                                  <SelectItem
                                    key={industry.id}
                                    value={industry.id}
                                  >
                                    {industry.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select one industry
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
                      Status & Date Time
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Status <span className="text-destructive">*</span>
                            </FormLabel>
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
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>
                              Event Date & Time{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>

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
                                      : "Pick event date & time"}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>

                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <div className="p-3 space-y-3">
                                  <Calendar
                                    mode="single"
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      if (!date) return;

                                      const currentDate = field.value
                                        ? new Date(field.value)
                                        : new Date();
                                      date.setHours(currentDate.getHours());
                                      date.setMinutes(currentDate.getMinutes());

                                      field.onChange(date.toISOString());
                                    }}
                                    // disabled={(date) => date < new Date()}
                                    initialFocus
                                  />

                                  <div className="border-t pt-3 space-y-2">
                                    <p className="text-sm font-medium">Time</p>
                                    <div className="flex gap-2">
                                      <Select
                                        value={
                                          field.value
                                            ? new Date(field.value)
                                                .getHours()
                                                .toString()
                                            : "0"
                                        }
                                        onValueChange={(hour) => {
                                          const date = field.value
                                            ? new Date(field.value)
                                            : new Date();
                                          date.setHours(parseInt(hour));
                                          field.onChange(date.toISOString());
                                        }}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="HH" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 24 },
                                            (_, i) => (
                                              <SelectItem
                                                key={i}
                                                value={i.toString()}
                                              >
                                                {i.toString().padStart(2, "0")}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>

                                      <span className="flex items-center">
                                        :
                                      </span>

                                      <Select
                                        value={
                                          field.value
                                            ? new Date(field.value)
                                                .getMinutes()
                                                .toString()
                                            : "0"
                                        }
                                        onValueChange={(minute) => {
                                          const date = field.value
                                            ? new Date(field.value)
                                            : new Date();
                                          date.setMinutes(parseInt(minute));
                                          field.onChange(date.toISOString());
                                        }}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 60 },
                                            (_, i) => (
                                              <SelectItem
                                                key={i}
                                                value={i.toString()}
                                              >
                                                {i.toString().padStart(2, "0")}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>

                            <FormDescription>
                              Select the date and time of the event
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
                    <h2 className="text-lg font-semibold">Location</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="locationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Location Type{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select location type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="offline">Offline</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(form.watch("locationType") === "offline" ||
                        form.watch("locationType") === "hybrid") && (
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Physical Location{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  placeholder="Enter venue address"
                                />
                              </FormControl>
                              <FormDescription>
                                Required for offline and hybrid events
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {(form.watch("locationType") === "online" ||
                        form.watch("locationType") === "hybrid") && (
                        <FormField
                          control={form.control}
                          name="meetingUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Meeting URL{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  placeholder="https://zoom.us/j/..."
                                  type="url"
                                />
                              </FormControl>
                              <FormDescription>
                                Required for online and hybrid events
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Registration</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="registrationUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration URL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="https://eventbrite.com/..."
                                type="url"
                              />
                            </FormControl>
                            <FormDescription>
                              External registration link (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quota"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Participant Quota</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                max="10000"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null,
                                  )
                                }
                                placeholder="Maximum participants"
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of participants (optional)
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
                    <h2 className="text-lg font-semibold">Description</h2>
                    <p className="text-sm text-muted-foreground">
                      Detailed information about the event
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Description{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Editor
                              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                              value={field.value || ""}
                              onEditorChange={(value) => field.onChange(value)}
                              init={{
                                height: 1000,
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

                                  try {
                                    const response = await cmsApi.post(
                                      "/media",
                                      formData,
                                      {
                                        headers: {
                                          "Content-Type": "multipart/form-data",
                                        },
                                      },
                                    );

                                    const json: { url: string } = response.data;

                                    return `${process.env.NEXT_PUBLIC_CMS_API_URL?.replace("/api/cms", "")}${json.url}`;
                                  } catch (error) {
                                    console.error(error);
                                    throw new Error("Image upload failed");
                                  }
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
                                  "undo redo | accordion accordionremove | blocks | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",

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
                          <FormDescription>
                            Detailed information about the event
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-4">
                  <Button variant="ghost" disabled={loading}>
                    <Link href="/events">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : submitLabel}
                  </Button>
                </div>
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
              defaultType="image"
              hideTypeFilter={true}
              onSelectImageExternal={(media) => {
                form.setValue("thumbnailId", media.id);
                setSelectedThumbnail(media);
                setOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
