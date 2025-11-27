// Password utilities (renamed from jwt.ts since we use Lucia, not JWT)
// This file handles password hashing and comparison

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  // 10 rounds = good balance between security and performance
  return bcrypt.hash(password, 10);
}

// Compare password with hash
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}
