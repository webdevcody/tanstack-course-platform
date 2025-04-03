import { useState, useEffect } from "react";
import { publicEnv } from "~/utils/env-public";
import { subscribeFn } from "~/routes/-components/newsletter";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function useNewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${publicEnv.VITE_RECAPTCHA_KEY}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await new Promise<void>((resolve, reject) => {
        window.grecaptcha.ready(function () {
          window.grecaptcha
            .execute(publicEnv.VITE_RECAPTCHA_KEY, { action: "submit" })
            .then(async function (token: string) {
              try {
                await subscribeFn({
                  data: {
                    email,
                    recaptchaToken: token,
                  },
                });
                setIsSubmitted(true);
                resolve();
              } catch (error) {
                reject(error);
              }
            })
            .catch(reject);
        });
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isSubmitted,
    isLoading,
    error,
    handleSubmit,
  };
}
