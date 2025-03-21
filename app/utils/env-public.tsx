// This has to live in a separate file because import.meta breaks when running migrations

export const publicEnv = {
  VITE_FILE_URL: import.meta.env.VITE_FILE_URL!,
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!,
};
