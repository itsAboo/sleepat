"use client";

import { IUser } from "@/models/user.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import Loader from "../ui/loader";
import { useToast } from "../ui/use-toast";
import { updateProfile } from "@/actions/auth";

const profileFormSchema = z.object({
  email: z.string().readonly(),
  firstName: z
    .string()
    .min(4, {
      message: "First name must be at least 4 characters",
    })
    .regex(/^[A-Za-z\s]+$/, {
      message: "First name must contain only English letters",
    }),
  lastName: z
    .string()
    .min(4, {
      message: "Last name must be at least 4 characters",
    })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Last name must contain only English letters",
    }),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return val?.match(/^[0-9]{10}$/);
    }, "Invalid phone number. It should contain exactly 10 digits."),
});

export default function ProfileForm({ user }: { user: IUser }) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phoneNumber", data.phoneNumber as string);
    formData.append("address", data.address as string);
    try {
      await updateProfile(formData);
      toast({
        description: "Successfully updated info.",
        className: "bg-green-600 text-white",
        duration: 3000,
      });
      form.reset(data);
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} readOnly disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-5">
            <FormField
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>address</FormLabel>
                <FormControl>
                  <Textarea placeholder="address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Button
              disabled={
                !form.formState.isDirty ||
                isLoading ||
                form.formState.isSubmitting
              }
              type="submit"
            >
              {isLoading ? <Loader /> : "Update info"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
