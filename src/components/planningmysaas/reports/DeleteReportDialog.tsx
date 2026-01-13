import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  projectName: string;
}

const DeleteReportDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  projectName 
}: DeleteReportDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-premium border-accent/20 bg-background/95 backdrop-blur-xl max-w-md">
        {/* Ícone decorativo com glow */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Trash2 className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-xl font-bold text-foreground">
            Delete Report
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-accent">"{projectName}"</span>?{" "}
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex gap-3 sm:gap-3 mt-6">
          <AlertDialogCancel className="flex-1 border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReportDialog;
