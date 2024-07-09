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
import { signin } from "@/actions/auth";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const signinFormSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .regex(/^[A-Za-z0-9\s]+$/, {
      message: "Password must contain only English letters and numbers",
    }),
});

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof signinFormSchema>) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    setIsLoading(true);
    const result = await signin(formData);
    if (result?.error) {
      setIsLoading(false);
      return form.setError("email", { message: result.message });
    }
    toast({
      description: "Success! You are now logged in!",
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
    <div className="mx-auto max-w-[500px] md:mt-8 mt-2 border p-6 rounded-sm shadow-sm">
      <h1 className="text-2xl font-bold mb-5">Sign in</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
          <div className="flex justify-between items-center w-full my-2">
            <Link
              className="text-sm text-primary hover:underline"
              href="/account/signup"
            >
              Create account
            </Link>
            <Link
              className="text-sm text-primary hover:underline"
              href="/account/signup"
            >
              Forget password?
            </Link>
          </div>
          <Button disabled={isLoading} className="w-full mt-5" type="submit">
            {isLoading ? <Loader /> : "Login"}
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
