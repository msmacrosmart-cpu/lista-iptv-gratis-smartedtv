import { describe, it, expect } from "vitest";
import { validateDownloadUrl, validateApkFile, sanitizeFilename, loginEmailFor } from "./release-validation";

describe("release validation", () => {
  it("rejects non-https download links", () => {
    expect(validateDownloadUrl("http://x.com/a.apk")).not.toBeNull();
    expect(validateDownloadUrl("https://x.com/a.apk")).toBeNull();
  });
  it("only accepts .apk files up to 200 MB", () => {
    expect(validateApkFile({ name: "a.zip", size: 10 })).not.toBeNull();
    expect(validateApkFile({ name: "a.apk", size: 201 * 1024 * 1024 })).not.toBeNull();
    expect(validateApkFile({ name: "SMARTEDTV.apk", size: 1024 })).toBeNull();
  });
  it("always produces an .apk filename", () => {
    expect(sanitizeFilename("SMARTEDTV v2")).toBe("SMARTEDTV-v2.apk");
  });
  it("maps the admin username to its login address", () => {
    expect(loginEmailFor("admin1997")).toBe("admin1997@smartedtv.local");
    expect(loginEmailFor("dono@exemplo.com")).toBe("dono@exemplo.com");
  });
});
