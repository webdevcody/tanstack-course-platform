import { useQuery } from "@tanstack/react-query";
import { getUserProfileFn } from "~/fn/users";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfileFn,
  });
}
