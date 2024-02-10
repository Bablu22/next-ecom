"use client";
import React from "react";
import { Button, Input, Spinner } from "@material-tailwind/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import AuthFormContainer from "@/app/components/Auth/AuthFormContainer";
import { useFormik } from "formik";
import * as yup from "yup";
import { filterFormikErrors } from "@/app/utils/formikHelpers";
import { toast } from "react-toastify";
import Link from "next/link";
import { signIn } from "next-auth/react";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };

      if (res.ok) {
        toast.success(message);
        await signIn("credentials", { email, password });
      }
      if (!res.ok && error) {
        toast.error(error);
      }
    },
  });

  const formErrors: string[] = filterFormikErrors(errors, touched, values);
  const { name, email, password } = values;

  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        crossOrigin=""
        name="name"
        label="Name"
        onChange={handleChange}
        value={name}
        onBlur={handleBlur}
        error={error("name")}
      />
      <Input
        crossOrigin=""
        name="email"
        label="Email"
        onChange={handleChange}
        value={email}
        onBlur={handleBlur}
        error={error("email")}
      />
      <Input
        crossOrigin=""
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        value={password}
        onBlur={handleBlur}
        error={error("password")}
      />
      <Button
        placeholder=""
        type="submit"
        className="w-full flex items-center space-x-3 justify-center"
        disabled={isSubmitting}
      >
        <span> Sign up</span>
        {isSubmitting && <Spinner className="h-4 w-4" />}
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin">Sign In</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div
              key={err}
              className="space-x-1 mb-2 flex items-center text-red-500"
            >
              <XCircleIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
