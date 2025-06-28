import { getAccountByGoogleId } from "~/data-access/accounts";

export async function getAccountByGoogleIdUseCase(googleId: string) {
  return await getAccountByGoogleId(googleId);
}
