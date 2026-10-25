import { logoutAction } from "@/backend/action/auth.action";
import { LogOutIcon } from "lucide-react";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={`rounded-lg  px-4 py-2 text-sm font-medium  transition flex gap-2 items-start  ${className}`}
      >
        <LogOutIcon /> Logout
      </button>
    </form>
  );
}
