import { AdminBadge } from "@/components/AdminBadge";
import { resolveBlobAssetUrl } from "@/lib/blob-url";
import { isSafeAssetUrl } from "@/lib/safe-url";

type UserAvatarProps = {
  name?: string | null;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  isAdmin?: boolean;
  adminTitle?: string;
};

const sizes = {
  sm: "h-9 w-9 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-28 w-28 text-3xl sm:h-32 sm:w-32",
} as const;

const adminMarkSizes = {
  sm: "h-4 w-4 text-[9px]",
  md: "h-[18px] w-[18px] text-[10px]",
  lg: "h-6 w-6 text-[11px]",
} as const;

export function UserAvatar({
  name,
  avatar,
  size = "md",
  className = "",
  isAdmin = false,
  adminTitle,
}: UserAvatarProps) {
  const initial = (name?.[0] ?? "U").toUpperCase();
  const safeAvatar =
    avatar &&
    (avatar.startsWith("blob:") || isSafeAssetUrl(avatar))
      ? avatar.startsWith("blob:")
        ? avatar
        : resolveBlobAssetUrl(avatar)
      : null;

  return (
    <div className="relative shrink-0">
      <div
        className={`flex items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-semibold text-indigo-700 ${sizes[size]} ${className} ${
          isAdmin ? "ring-2 ring-red-500 ring-offset-2 ring-offset-white" : ""
        }`}
      >
        {safeAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={safeAvatar} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </div>
      {isAdmin && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-red-600 font-bold text-white ring-2 ring-white ${adminMarkSizes[size]}`}
          aria-hidden="true"
          title={adminTitle}
        >
          A
        </span>
      )}
    </div>
  );
}

export function UserRoleLabel({
  roleLabel,
  isAdmin = false,
}: {
  roleLabel: string;
  isAdmin?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-zinc-500">{roleLabel}</span>
      {isAdmin && <AdminBadge />}
    </div>
  );
}
