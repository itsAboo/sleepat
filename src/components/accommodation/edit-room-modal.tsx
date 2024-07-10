"use client";

import { SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { updateRoom } from "@/actions/room";
import Loader from "../ui/loader";
import { IRoom } from "@/models/accommodation.model";

const bedTypes = ["Single", "Twin", "Double", "Full", "Queen", "King"] as const;

const features = [
  "Balcony/terrace",
  "Outdoor view",
  "City view",
  "Ocean view",
  "Sea view",
  "Garden view",
] as const;

const roomFormSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  size: z.coerce
    .number({ message: "This field is required" })
    .gte(1, { message: "At least 1 and above" }),
  maxGuest: z.coerce
    .number({ message: "This field is required" })
    .gte(1, { message: "At least 1 and above" }),
  feature: z.optional(z.enum(features)),
  pricePerNight: z.coerce
    .number({ message: "This field is required" })
    .gte(1, { message: "At least 1 and above" }),
  bedType: z.enum(bedTypes, { message: "This field is required" }),
  bedCount: z.coerce
    .number({ message: "This field is required" })
    .gte(1, { message: "At least 1 and above" }),
  bathRoomCount: z.coerce
    .number({ message: "This field is required" })
    .gte(0, { message: "At least 0 and above" }),
  file: z.instanceof(File).optional(),
});

export default function EditRoomModal({
  open,
  setOpen,
  accId,
  room,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  accId: string;
  room: IRoom;
}) {
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>("");

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: room.name,
      size: room.size,
      maxGuest: room.maxGuest,
      bedType: room.bedType,
      bedCount: room.bedCount,
      feature: room.feature,
      bathRoomCount: room.bathRoomCount,
      pricePerNight: room.pricePerNight,
      file: new File([""], "filename"),
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();
    try {
      reader.onload = () => setPreviewImg(reader.result);
      reader.readAsDataURL(acceptedFiles[0]);
      form.setValue("file", acceptedFiles[0]);
      form.clearErrors("file");
    } catch (error) {
      setPreviewImg(null);
      form.resetField("file");
    }
  };

  const cancelPickImage = () => {
    setPreviewImg(null);
    form.resetField("file");
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 5000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const handleSubmit = async (data: z.infer<typeof roomFormSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("size", JSON.stringify(data.size));
    formData.append("maxGuest", JSON.stringify(data.maxGuest));
    formData.append("feature", JSON.stringify(data.feature));
    formData.append("pricePerNight", JSON.stringify(data.pricePerNight));
    formData.append("bedType", data.bedType);
    formData.append("bedCount", JSON.stringify(data.bedCount));
    formData.append("bathRoomCount", JSON.stringify(data.bathRoomCount));
    formData.append("file", data.file as File);
    try {
      await updateRoom(formData, accId, room._id!, room.image!);
      setIsLoading(false);
      form.reset();
      toast({
        description: "Successfully save changes.",
        className: "bg-green-600 text-white",
        duration: 3000,
      });
      setPreviewImg("");
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="max-w-screen-lg md:max-h-[80%] h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit room</DialogTitle>
          <DialogDescription>edit your room</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Room name *</FormLabel>
                  <FormDescription>ex. Superior Single Room</FormDescription>
                  <FormControl>
                    <Input placeholder="Room name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex md:flex-row flex-col md:gap-3">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Room size *</FormLabel>
                    <FormDescription>
                      Provide the size of room in square meters (m²)
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Room size" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxGuest"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Maximum guest *</FormLabel>
                    <FormDescription>
                      How many guests are allowed?
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="Maximum guest"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bedType"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Bed type *</FormLabel>
                  <FormDescription>
                    what the type of bed in this room?
                  </FormDescription>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the bed type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bedTypes.map((bedType, index) => {
                        return (
                          <SelectItem key={index} value={bedType}>
                            {bedType}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex md:flex-row flex-col md:gap-3">
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Bed count *</FormLabel>
                    <FormDescription>
                      How many beds are available in this room?
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Bed count" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathRoomCount"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel>Bathroom count *</FormLabel>
                    <FormDescription>
                      How many bathrooms are in this room?
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="Bathroom count"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="feature"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Feature (Optional)</FormLabel>
                  <FormDescription>
                    What features does this room have?
                  </FormDescription>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the feature" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {features.map((feature, index) => {
                        return (
                          <SelectItem key={index} value={feature}>
                            {feature}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricePerNight"
              render={({ field }) => (
                <FormItem className="mb-3 w-full">
                  <FormLabel>Room Price (Baht)*</FormLabel>
                  <FormDescription>
                    What&apos;s the price for staying in this room for 24hrs?
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Room price" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel
                    className={`${
                      fileRejections.length !== 0 && "text-destructive"
                    }`}
                  >
                    Upload an image *
                  </FormLabel>
                  <FormDescription>
                    Choose an image that will show-case your hotel nicely
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <div
                        {...getRootProps()}
                        className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border  p-8  shadow-foreground"
                      >
                        {previewImg && (
                          <img
                            src={previewImg as string}
                            alt="Uploaded image"
                            className="max-h-[400px] rounded-lg"
                          />
                        )}
                        {!previewImg && room.image?.url! && (
                          <img
                            src={room.image.url}
                            alt="Uploaded image"
                            className="max-h-[400px] rounded-lg"
                          />
                        )}
                        {!previewImg && !room.image?.url && (
                          <ImagePlus
                            strokeWidth={1}
                            className={`size-10 ${
                              previewImg ? "hidden" : "block"
                            }`}
                          />
                        )}
                        <Input {...getInputProps()} type="file" />
                        {isDragActive ? (
                          <p>Drop the image!</p>
                        ) : (
                          !previewImg &&
                          !room.image?.url && (
                            <p>Click here or drag an image to upload it</p>
                          )
                        )}
                      </div>
                      {previewImg && (
                        <Button
                          type="button"
                          onClick={cancelPickImage}
                          className="absolute top-3 right-3 z-50"
                          variant="ghost"
                          size="icon"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage>
                    {fileRejections.length !== 0 && (
                      <p>
                        Image must be less than 5MB and of type png, jpg, or
                        jpeg
                      </p>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button className="mt-3" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="mt-3"
                key={room._id}
                disabled={
                  isLoading ||
                  form.formState.isSubmitting ||
                  (!form.formState.isDirty && !previewImg)
                }
                type="submit"
              >
                {isLoading ? <Loader /> : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
