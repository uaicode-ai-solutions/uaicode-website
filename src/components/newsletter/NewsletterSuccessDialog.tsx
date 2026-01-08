import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";

interface NewsletterSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsletterSuccessDialog = ({ open, onOpenChange }: NewsletterSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <div className="relative">
              <Mail className="w-8 h-8 text-accent" />
              <CheckCircle2 className="w-4 h-4 text-green-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            Cadastro realizado com sucesso!
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Você receberá nossas newsletters por email a cada novo lançamento.
          </DialogDescription>
        </DialogHeader>
        <Button 
          onClick={() => onOpenChange(false)} 
          className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterSuccessDialog;
