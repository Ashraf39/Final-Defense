import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicineAdminActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const MedicineAdminActions = ({
  onEdit,
  onDelete,
}: MedicineAdminActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={onEdit}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button variant="destructive" onClick={onDelete}>
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};