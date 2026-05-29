import { describe, expect, it } from "vitest";

import { parseAuthCredentials } from "./validation";

function formDataFor(email: string, password: string) {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("password", password);
  return formData;
}

describe("parseAuthCredentials", () => {
  it("normalizes valid email credentials", () => {
    const parsed = parseAuthCredentials(
      formDataFor("  Ada@Example.COM ", "secret1"),
    );

    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.email).toBe("ada@example.com");
  });

  it("rejects invalid emails and short passwords", () => {
    const parsed = parseAuthCredentials(formDataFor("not-email", "12345"));

    expect(parsed.success).toBe(false);
    expect(parsed.success ? null : parsed.error.flatten().fieldErrors).toEqual({
      email: ["Enter a valid email address."],
      password: ["Password must be at least 6 characters."],
    });
  });
});
