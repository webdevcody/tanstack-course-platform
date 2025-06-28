import { eq } from "drizzle-orm";
import { database } from "~/db";
import { accounts } from "~/db/schema";
import { UserId } from "~/use-cases/types";

export async function createAccountViaGoogle(userId: UserId, googleId: string) {
  await database
    .insert(accounts)
    .values({
      userId: userId,
      googleId,
    })
    .onConflictDoNothing()
    .returning();
}

export async function getAccountByUserId(userId: UserId) {
  const account = await database.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
}

export async function getAccountByGoogleId(googleId: string) {
  return await database.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId),
  });
}
