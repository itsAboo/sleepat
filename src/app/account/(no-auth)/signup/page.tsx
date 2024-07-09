"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const signupFormSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .regex(/^[A-Za-z0-9\s]+$/, {
      message: "Password must contain only English letters and numbers",
    }),
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
});

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof signupFormSchema>) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    setIsLoading(true);
    const result = await signup(formData);
    if (result?.error) {
      setIsLoading(false);
      return form.setError("email", { message: result.message });
    }
    toast({
      description: "Success! You are now registered.",
      className: "bg-green-600 text-white",
      duration: 3000,
    });
  };

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <div className="mx-auto max-w-[500px] mt-8 border p-6 rounded-sm shadow-sm">
      <h1 className="text-2xl font-bold mb-5">Sign up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full mt-5" type="submit">
            {isLoading ? <Loader /> : "Create account"}
          </Button>
          <div className="flex justify-between items-center my-5">
            <span className="border w-full"></span>
            <span className="px-4">or</span>
            <span className="border w-full"></span>
          </div>
          <Button variant="outline" asChild className="w-full">
            <Link href="/account/signin">Already have an account? Sign in</Link>
          </Button>
        </form>
      </Form>
      <p className="text-sm mt-5 font-light text-center">
        By signing in, I agree to Sleepat&apos;s{" "}
        <span className="text-primary">Terms of Use</span> and{" "}
        <span className="text-primary">Privacy Policy</span>.
      </p>
    </div>
  );
}
