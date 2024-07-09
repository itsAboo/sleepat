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
import { createAccommodation } from "@/actions/accommodation";
import Loader from "../ui/loader";
import { useToast } from "../ui/use-toast";

export const accommodationFormSchema = z.object({
  name: z.string().min(4, { message: "name must be at least 4 characters" }),
  description: z.string().min(1, { message: "This field is required" }),
  address: z.string().min(1, { message: "This field is required" }),
  category: z.string({ message: "This field is required" }),
  amenities: z.optional(z.array(z.string())),
  country: z.string().min(1, { message: "This field is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  minPricePerNight: z.coerce.number().gte(100, "At least 100 and above"),
  file: z
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image"),
});

export default function AccommodationForm() {
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

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
    formData.append("file", data.file);
    try {
      await createAccommodation(formData);
      setIsLoading(false);
      toast({
        description: "Accommodation created successfully.",
        className: "bg-green-600 text-white",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };

  const form = useForm<z.infer<typeof accommodationFormSchema>>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      amenities: [],
      country: "",
      state: "",
      city: "",
      minPricePerNight: 0,
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
    <div className="my-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-5 flex flex-col gap-5 justify-between lg:flex-row"
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
                    What the type of your accommodation?
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
                          placeholder="Choose the type of your accommodation"
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
                        <ImagePlus
                          strokeWidth={1}
                          className={`size-10 ${
                            previewImg ? "hidden" : "block"
                          }`}
                        />
                        <Input {...getInputProps()} type="file" />
                        {isDragActive ? (
                          <p>Drop the image!</p>
                        ) : (
                          !previewImg && (
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
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isLoading}
              >
                {isLoading ? <Loader /> : "Create Accommodation"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
