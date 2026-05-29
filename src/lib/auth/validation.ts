import { z } from "zod";

export type AuthActionState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  status: "idle" | "error" | "success";
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
};

const authCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function parseAuthCredentials(formData: FormData) {
  return authCredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}
