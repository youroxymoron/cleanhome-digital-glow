import { useEditMode } from "@/contexts/EditModeContext";
import { Pencil, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={toggleEditMode}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-colors ${
        isEditMode
          ? "bg-primary text-primary-foreground"
          : "bg-card text-foreground border border-border"
      }`}
    >
      <AnimatePresence mode="wait">
        {isEditMode ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">Просмотр</span>
          </motion.div>
        ) : (
          <motion.div
            key="viewing"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <Pencil className="w-5 h-5" />
            <span className="font-medium">Редактировать</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
