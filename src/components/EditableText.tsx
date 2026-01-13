import { useState, useRef, useEffect } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  onSave,
  className,
  as: Component = "span",
  multiline = false,
  placeholder = "Введите текст...",
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-flex items-center gap-2 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "bg-card border-2 border-primary rounded-lg px-3 py-2 w-full min-h-[100px] resize-y",
              className
            )}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "bg-card border-2 border-primary rounded-lg px-3 py-1 w-full",
              className
            )}
            placeholder={placeholder}
          />
        )}
        <button
          onClick={handleSave}
          className="p-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1.5 rounded-full bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="group relative inline-flex items-center gap-2 cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <Component className={cn(className, "border-b-2 border-dashed border-primary/50")}>
        {value || placeholder}
      </Component>
      <Pencil className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
