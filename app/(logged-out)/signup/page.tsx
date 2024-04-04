"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, PersonStandingIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const accountTypeSchema = z
  .object({
    accountType: z.enum(["personal", "company"]),
    companyName: z.string().optional(),
    numberOfEmployees: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === "company" && !data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Company name is required",
      });
    }
    if (
      data.accountType === "company" &&
      (!data.numberOfEmployees || data.numberOfEmployees < 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["numberOfEmployees"],
        message: "Number of employees is required",
      });
    }
  });

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .refine((password) => {
        return /^(?=.*[!@#$%^&*()_+{}|:"<>?[\]\;',./\\\-])(?=.*[A-Z])[A-Z][a-zA-Z\d!@#$%^&*()_+{}|:"<>?[\]\;',./\\\-]+$/.test(
          password
        );
      }, "Password must begin with uppercase letter and contain at least one special character"),
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "Passwords do not match",
      });
    }
  });

const baseSchema = z.object({
  email: z.string().email(),
  dob: z
    .date({
      required_error: "Date of birth is required",
    })
    .refine((date) => {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return date <= eighteenYearsAgo;
    }, "You must be atleast 18 years old"),
  acceptTerms: z
    .boolean({
      required_error: "You must accept the terms and conditions",
    })
    .refine((checked) => checked, "You must accept the terms and conditions"),
});

const formSchema = baseSchema.and(passwordSchema).and(accountTypeSchema);

const Signup = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Signup validation passed", data);
    router.push("/dashboard");
  };

  const accountType = form.watch("accountType");

  const dobFromDate = new Date();
  dobFromDate.setFullYear(dobFromDate.getFullYear() - 120);

  console.log({ accountType });

  return (
    <>
      <PersonStandingIcon size={50} />
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Sign up to your SupportMe account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='flex flex-col gap-4'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john@doe.com'
                        // type='email'
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                      This is your email address.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='accountType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className=''>
                          <SelectValue placeholder='Select an account type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='personal'>Personal</SelectItem>
                        <SelectItem value='company'>Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {accountType === "company" && (
                <>
                  <FormField
                    control={form.control}
                    name='companyName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Company name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='numberOfEmployees'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employees</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Employees'
                            type='number'
                            min={0}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name='dob'
                render={({ field }) => (
                  <FormItem className='flex flex-col pt-2'>
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className='flex justify-between pr-1'
                          >
                            {!!field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='start' className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          defaultMonth={field.value}
                          selected={field.value}
                          onSelect={field.onChange}
                          fixedWeeks
                          weekStartsOn={1}
                          fromDate={dobFromDate}
                          toDate={new Date()}
                          captionLayout='dropdown-buttons'
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='********'
                        // type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className='text-[12px]'>
                      Password must begin with uppercase letter, contain at
                      least one special character and be atleast 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='passwordConfirm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='********'
                        // type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='acceptTerms'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-center'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>I accept the terms and conditions</FormLabel>
                    </div>
                    <FormDescription className='text-[12px]'>
                      By signing up you agree to our{" "}
                      <Link
                        href='/terms'
                        className='text-primary hover:underline'
                      >
                        terms and conditions
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='mt-3'>
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='justify-between'>
          <small>Already have an account?</small>
          <Button asChild variant='outline' size='sm'>
            <Link href='/login'>Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Signup;
