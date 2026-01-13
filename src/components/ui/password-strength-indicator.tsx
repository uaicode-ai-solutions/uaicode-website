import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { Progress } from "./progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  showCriteria?: boolean;
}

interface PasswordCriteria {
  minLength: boolean;
  minLength8: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  criteria: PasswordCriteria;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const criteria: PasswordCriteria = {
    minLength: password.length >= 6,
    minLength8: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;

  let level: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    level = 'weak';
  } else if (score <= 4) {
    level = 'medium';
  } else {
    level = 'strong';
  }

  return { score, level, criteria };
}

export function PasswordStrengthIndicator({ 
  password, 
  showCriteria = true 
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  const progressValue = (strength.score / 6) * 100;

  const levelConfig = {
    weak: {
      label: "Weak",
      color: "text-red-500",
      progressColor: "bg-red-500",
    },
    medium: {
      label: "Medium",
      color: "text-yellow-500",
      progressColor: "bg-yellow-500",
    },
    strong: {
      label: "Strong",
      color: "text-green-500",
      progressColor: "bg-green-500",
    },
  };

  const config = levelConfig[strength.level];

  const criteriaList = [
    { key: 'minLength', label: 'At least 6 characters', met: strength.criteria.minLength },
    { key: 'minLength8', label: 'At least 8 characters', met: strength.criteria.minLength8 },
    { key: 'hasLowercase', label: 'Contains lowercase letter', met: strength.criteria.hasLowercase },
    { key: 'hasUppercase', label: 'Contains uppercase letter', met: strength.criteria.hasUppercase },
    { key: 'hasNumber', label: 'Contains number', met: strength.criteria.hasNumber },
    { key: 'hasSpecial', label: 'Contains special character', met: strength.criteria.hasSpecial },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Progress bar with label */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Password strength</span>
          <span className={cn("text-xs font-medium", config.color)}>
            {config.label}
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className="h-2"
          indicatorClassName={cn("transition-all duration-300", config.progressColor)}
        />
      </div>

      {/* Criteria list */}
      {showCriteria && (
        <div className="grid grid-cols-2 gap-1.5">
          {criteriaList.map((item) => (
            <div 
              key={item.key}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors duration-200",
                item.met ? "text-green-500" : "text-muted-foreground"
              )}
            >
              {item.met ? (
                <Check className="h-3 w-3 flex-shrink-0" />
              ) : (
                <X className="h-3 w-3 flex-shrink-0" />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
