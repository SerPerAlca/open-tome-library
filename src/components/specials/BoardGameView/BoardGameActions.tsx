import { useState } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
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

interface BoardGameActionsProps {
  onSuccess: () => void;
  onGameOver: () => void;
}

const BoardGameActions = ({ onSuccess, onGameOver }: BoardGameActionsProps) => {
  const [showFailureDialog, setShowFailureDialog] = useState(false);

  const handleFailureConfirm = () => {
    setShowFailureDialog(false);
    onGameOver();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {/* Success Button */}
        <button
          onClick={onSuccess}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-all duration-300 font-display text-lg shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Check className="w-6 h-6" />
          <span>CONSEGUIDO</span>
        </button>

        {/* Failure Button */}
        <button
          onClick={() => setShowFailureDialog(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-all duration-300 font-display text-lg shadow-lg hover:shadow-xl hover:scale-105"
        >
          <X className="w-6 h-6" />
          <span>NO CONSEGUIDO</span>
        </button>
      </div>

      {/* Failure Confirmation Dialog */}
      <AlertDialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <AlertDialogContent className="bg-[#F0E6D6] border-4 border-double border-amber-700/60">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl text-amber-900 flex items-center gap-2 justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-700" />
              Fin del Camino
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-amber-800 text-center text-lg leading-relaxed pt-4">
              No habéis superado la prueba y vuestra aventura ha acabado aquí.
              <br />
              <span className="font-bold">¿Estáis seguros?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-4 justify-center sm:justify-center">
            <AlertDialogCancel className="bg-amber-100 text-amber-900 border-amber-700/50 hover:bg-amber-200 font-display">
              NO, VOLVER
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFailureConfirm}
              className="bg-rose-700 text-white hover:bg-rose-800 font-display"
            >
              SÍ, FIN DEL JUEGO
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BoardGameActions;
