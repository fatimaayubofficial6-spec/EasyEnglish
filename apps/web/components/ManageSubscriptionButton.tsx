"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2, Settings } from "lucide-react";

interface ManageSubscriptionButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export function ManageSubscriptionButton({ 
  children, 
  className,
  variant = "outline",
  ...props 
}: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={isLoading}
      variant={variant}
      className={className || "w-full"}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children || (
          <>
            <Settings className="mr-2 h-4 w-4" />
            Manage Subscription
          </>
        )
      )}
    </Button>
  );
}
