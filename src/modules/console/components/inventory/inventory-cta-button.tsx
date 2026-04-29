import { useNavigate } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";

export const InventoryCtaButton = ({ addItemUrl }: { addItemUrl: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between gap-2">
      {/* <button className="flex items-center gap-1 px-4 py-2 rounded-lg border border-hairline text-ash bg-white hover:bg-neutral-50 hover:border-ink hover:text-ink transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export
        </button> */}
      <button
        onClick={() => navigate({ to: addItemUrl, search: { type: 'Found' } })}
        className="flex items-center gap-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#e00b41]"
      >
        <Plus className="w-4 h-4" />
        Add New Item
      </button>
    </div>
  )
};