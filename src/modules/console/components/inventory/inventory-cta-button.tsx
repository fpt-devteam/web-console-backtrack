import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const InventoryCtaButton = ({ addItemUrl }: { addItemUrl: string }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate({ to: addItemUrl, search: { type: 'Found' } })}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e00b41] sm:w-auto sm:justify-start sm:px-6 sm:py-2"
    >
      <Plus className="h-4 w-4 shrink-0" />
      Add New Item
    </button>
  );
};