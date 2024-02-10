"use client";

import { Button, Input, Spinner } from "@material-tailwind/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { filterFormikErrors } from "@/app/utils/formikHelpers";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuthFormContainer from "@/app/components/Auth/AuthFormContainer";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const signRes = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (signRes?.error === "CredentialsSignin") {
        toast.error("Invalid credentials");
      }

      if (!signRes?.error) {
        router.refresh();
      }
    },
  });

  const formErrors: string[] = filterFormikErrors(errors, touched, values);
  const { email, password } = values;

  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Sign in to your Account" onSubmit={handleSubmit}>
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
        <span> Sign In</span>
        {isSubmitting && <Spinner className="h-4 w-4" />}
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup">Sign Up</Link>
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
