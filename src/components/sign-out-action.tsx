"use client";

import { useRouter } from "next/navigation";

type SignOutActionProps = {
  className?: string;
  label?: string;
  redirectUrl?: string;
};

export const SignOutAction = ({
  className,
  label = "Гарах",
  redirectUrl = "/",
}: SignOutActionProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(redirectUrl);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={className}
    >
      {label}
    </button>
  );
};
