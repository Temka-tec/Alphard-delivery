"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MouseEvent } from "react";
import { toast } from "@/components/toast";
import { useRipple } from "@/hooks/use-ripple";

type AdminApplicationActionsProps = {
  applicationId: string;
  currentStatus: string;
};

export const AdminApplicationActions = ({
  applicationId,
  currentStatus,
}: AdminApplicationActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const ripple = useRipple();

  const updateStatus = async (
    status: "APPROVED" | "REJECTED",
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    ripple(event);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/admin/driver-applications/${applicationId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        toast.error(message || "Төлөв шинэчлэх үед алдаа гарлаа.");
        return;
      }

      toast.success(
        status === "APPROVED"
          ? "Хүсэлт амжилттай зөвшөөрөгдлөө"
          : "Хүсэлт татгалзагдлаа",
      );

      router.push(
        `/admin/driver-applications?status=${
          status === "APPROVED" ? "approved" : "rejected"
        }`,
      );
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={isLoading || currentStatus === "APPROVED"}
        onClick={(event) => updateStatus("APPROVED", event)}
        className="btn-ripple-effect rounded-lg bg-[#3ECF8E] px-4 py-2 text-sm font-medium text-[#04130B] transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Зөвшөөрөх
      </button>
      <button
        type="button"
        disabled={isLoading || currentStatus === "REJECTED"}
        onClick={(event) => updateStatus("REJECTED", event)}
        className="btn-ripple-effect rounded-lg bg-[rgba(248,113,113,0.12)] px-4 py-2 text-sm text-[#F87171] transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Татгалзах
      </button>
    </div>
  );
};
