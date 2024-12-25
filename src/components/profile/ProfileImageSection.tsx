import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

interface ProfileImageSectionProps {
  profileImage: string;
  onChange: (value: string) => void;
}

export const ProfileImageSection = ({ profileImage, onChange }: ProfileImageSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={profileImage || "/placeholder.svg"}
          alt="Profile Preview"
          className="h-20 w-20 rounded-full object-cover border-2 border-green-100"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="space-y-2 flex-1">
          <Label htmlFor="profileImage" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Profile Image URL
          </Label>
          <Input
            id="profileImage"
            name="profileImage"
            type="url"
            placeholder="Enter image URL"
            value={profileImage}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};