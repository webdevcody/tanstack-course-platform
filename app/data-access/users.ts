import { database } from "~/db";
import { User, users } from "~/db/schema";
import { eq } from "drizzle-orm";
import { UserId } from "~/use-cases/types";

export async function deleteUser(userId: UserId) {
  await database.delete(users).where(eq(users.id, userId));
}

export async function getUser(userId: UserId) {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user;
}

export async function createUser(email: string) {
  const [user] = await database.insert(users).values({ email }).returning();
  return user;
}

export async function getUserByEmail(email: string) {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export async function setEmailVerified(userId: UserId) {
  await database
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.id, userId));
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await database.update(users).set(updatedUser).where(eq(users.id, userId));
}

export async function updateUserToPremium(userId: UserId) {
  await database
    .update(users)
    .set({ isPremium: true })
    .where(eq(users.id, userId));
}
