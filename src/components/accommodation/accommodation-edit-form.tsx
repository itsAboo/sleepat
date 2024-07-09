"use client";

import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { amenitieIcon, amenitiesList } from "@/util/amenities";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICity, IState } from "country-state-city";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import getLocation from "@/util/get-location";
import { updateAccommodation } from "@/actions/accommodation";
import Loader from "../ui/loader";
import { useToast } from "../ui/use-toast";
import { IAccommodation } from "@/models/accommodation.model";
import Link from "next/link";
import AddRoomModal from "./add-room-modal";
import RoomPreviewList from "./room-preview-list";

export const accommodationFormSchema = z.object({
  name: z.string().min(4, { message: "name must be at least 4 characters" }),
  description: z.string().min(1, { message: "This field is required" }),
  address: z.string().min(1, { message: "This field is required" }),
  category: z.string().min(1, { message: "This field is required" }),
  amenities: z.optional(z.array(z.string())),
  country: z.string().min(1, { message: "This field is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  minPricePerNight: z.coerce.number().gte(100, "At least 100 and above"),
  file: z.instanceof(File).optional(),
});

export default function AccommodationEditForm({
  accommodation,
}: {
  accommodation: IAccommodation;
}) {
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>("");

  const { getAllCountries, getCountryStates, getStateCities } = getLocation();

  const countries = getAllCountries();

  const { toast } = useToast();

  const handleSubmit = async (
    data: z.infer<typeof accommodationFormSchema>
  ) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("category", data.category);
    formData.append("amenities", JSON.stringify(data.amenities));
    formData.append("country", data.country);
    formData.append("state", data.state || "");
    formData.append("city", data.city || "");
    formData.append("minPricePerNight", JSON.stringify(data.minPricePerNight));
    formData.append("file", data.file as File);
    try {
      await updateAccommodation(formData, accommodation._id!);
      setIsLoading(false);
      toast({
        description: "Successfully updated the accommodation.",
        className: "bg-green-600 text-white",
        duration: 3000,
      });
      form.reset(data);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };

  const form = useForm<z.infer<typeof accommodationFormSchema>>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      name: accommodation.name || "",
      description: accommodation.description || "",
      address: accommodation.address || "",
      category: accommodation.category || "house",
      amenities: accommodation.amenities || [],
      country: accommodation.country || undefined,
      state: accommodation.state || undefined,
      city: accommodation.city || undefined,
      minPricePerNight: accommodation.minPricePerNight || 0,
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

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
  }, [form.watch("country"), form.watch("state")]);

  return (
    <div className="mt-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-5 flex justify-between gap-2 flex-wrap mb-10"
        >
          <div className="w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Accommodation name *</FormLabel>
                  <FormDescription>
                    Provide your accommodation name
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Accommodation name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Accommodation description *</FormLabel>
                  <FormDescription>
                    Provide a detailed description of your accommodation
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Accommodation description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Accommodation address *</FormLabel>
                  <FormDescription>
                    Provide your accommodation address
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Accommodation address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Accommodation type *</FormLabel>
                  <FormDescription>
                    Choose the type of your accommodation
                  </FormDescription>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="cabin">Cabin</SelectItem>
                      <SelectItem value="tent">Tent</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem className="mb-5">
                  <div className="mb-5">
                    <div className="mb-2">
                      <FormLabel>Choose amenities (Optional)</FormLabel>
                    </div>
                    <FormDescription>
                      Choose amenities that are available at your accommodation
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {amenitiesList.map((amen) => (
                      <FormField
                        key={amen.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={amen.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  className="size-6"
                                  checked={field.value?.includes(amen.label)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value!,
                                          amen.label,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== amen.label
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <span className="mr-3">
                                  {amenitieIcon(amen.id)}
                                </span>
                                {amen.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Select Country *</FormLabel>
                  <FormDescription>
                    In which country is your property located?
                  </FormDescription>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Country"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => {
                        return (
                          <SelectItem
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-2">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Select State</FormLabel>
                      <FormDescription>
                        In which state is your property located?
                      </FormDescription>
                      <Select
                        disabled={states.length < 1}
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a State"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => {
                            return (
                              <SelectItem
                                key={state.isoCode}
                                value={state.isoCode}
                              >
                                {state.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Select City</FormLabel>
                      <FormDescription>
                        In which city is your property located?
                      </FormDescription>
                      <Select
                        disabled={cities.length < 1}
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a City"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => {
                            return (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="minPricePerNight"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Minimum price / 24hr *</FormLabel>
                  <FormDescription>
                    Provide the estimated minimum price of your accommodation
                  </FormDescription>
                  <FormControl>
                    <Input
                      min={0}
                      type="number"
                      placeholder="Accommodation minimum price"
                      {...field}
                    />
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
                        {!previewImg && accommodation.image?.url! && (
                          <img
                            src={accommodation.image.url}
                            alt="Uploaded image"
                            className="max-h-[400px] rounded-lg"
                          />
                        )}
                        {!previewImg && !accommodation.image?.url && (
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
                          !accommodation.image?.url && (
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
          </div>
          <div className="w-full bg-primary-foreground h-20 z-50 sticky bottom-0 left-0 right-0 flex justify-between items-center rounded-sm px-3">
            <Link
              className="bg-green-600 rounded-sm p-2 px-3 text-sm hover:bg-green-700 text-white sm:flex items-center sm:visible hidden"
              href={`/accommodation/details/${accommodation._id}`}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </span>
              View
            </Link>
            <Button
              type="button"
              variant="outline"
              className="flex items-center"
              onClick={() => setOpen(true)}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              Add Room
            </Button>
            <Button
              type="submit"
              disabled={
                (!form.formState.isDirty && !previewImg) ||
                form.formState.isSubmitting ||
                isLoading ||
                open
              }
            >
              {isLoading ? (
                <Loader />
              ) : (
                <span className="flex items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </span>
                  Save changes
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <RoomPreviewList accommodation={accommodation} />
      <AddRoomModal accId={accommodation._id!} open={open} setOpen={setOpen} />
    </div>
  );
}
