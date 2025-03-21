import { createUser, deleteUser, getUserByEmail } from "~/data-access/users";
import { PublicError } from "./errors";
import { GoogleUser, UserId, UserSession } from "./types";
import { createProfile, getProfile } from "~/data-access/profiles";
import { createAccountViaGoogle } from "~/data-access/accounts";
import { getCurrentUser } from "~/utils/session";
import { isAdmin } from "~/lib/auth";

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new PublicError("You can only delete your own account");
  }

  await deleteUser(userToDeleteId);
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new PublicError("User not found");
  }

  return profile;
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email);
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub);

  await createProfile(existingUser.id, googleUser.name, googleUser.picture);

  return existingUser.id;
}

export async function isAdminUseCase() {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return isAdmin(user);
}
