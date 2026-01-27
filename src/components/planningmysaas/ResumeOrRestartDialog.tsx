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
import { Play, RotateCcw } from "lucide-react";

interface ResumeOrRestartDialogProps {
  open: boolean;
  currentStep: number;
  projectName: string;
  onResume: () => void;
  onRestart: () => void;
}

const ResumeOrRestartDialog = ({
  open,
  currentStep,
  projectName,
  onResume,
  onRestart,
}: ResumeOrRestartDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Report Generation in Progress
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              We found an existing generation for{" "}
              <span className="font-semibold text-accent">{projectName}</span>{" "}
              at Step {currentStep}.
            </p>
            <p>Would you like to resume or start over?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onResume}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Resume from Step {currentStep}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onRestart}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResumeOrRestartDialog;
