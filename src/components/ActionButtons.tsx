import { cn } from "@/lib/utils";

interface ActionButton {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  className?: string;
}

const ActionButtons = ({ buttons, className }: ActionButtonsProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 md:gap-6 flex-wrap",
        className
      )}
    >
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick}
          disabled={button.disabled}
          className={cn(
            "btn-vintage rounded-sm flex items-center gap-2",
            button.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {button.icon && <span>{button.icon}</span>}
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
