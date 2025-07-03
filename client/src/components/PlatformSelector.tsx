import { Label } from "@/components/ui/label";
import { Platform } from "@/lib/types";

interface PlatformSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
  disabled?: boolean;
}

const platforms = [
  { 
    id: "replit" as Platform, 
    name: "Replit", 
    icon: "🔶",
    color: "text-orange-500" 
  },
  { 
    id: "cursor" as Platform, 
    name: "Cursor", 
    icon: "🖱️",
    color: "text-blue-500" 
  },
  { 
    id: "lovable" as Platform, 
    name: "Lovable", 
    icon: "❤️",
    color: "text-red-500" 
  },
  { 
    id: "windsurf" as Platform, 
    name: "Windsurf", 
    icon: "🏄‍♀️",
    color: "text-cyan-500" 
  },
];

export function PlatformSelector({ value, onChange, disabled }: PlatformSelectorProps) {
  return (
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-3">
        Target Platform
      </Label>
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <label key={platform.id} className="relative">
            <input
              type="radio"
              name="platform"
              value={platform.id}
              checked={value === platform.id}
              onChange={(e) => onChange(e.target.value as Platform)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{platform.icon}</span>
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
