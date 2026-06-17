import React from "react";
import {
    AlertCircle,
    ArrowUp,
    ArrowRight,
    ArrowDown,
    Minus,
} from "lucide-react";
import { IssuePriority } from "@/types";

interface PriorityIconProps {
    priority: IssuePriority;
    className?: string;
    showLabel?: boolean;
}

const PRIORITY_CONFIG: Record<
IssuePriority,
    { icon: React.ElementType; color: string; label: string }
    > = {
    [IssuePriority.URGENT]: { icon: AlertCircle, color: "text-red-500", label: "Urgent" },
    [IssuePriority.HIGH]: { icon: ArrowUp, color: "text-orange-500", label: "High" },
    [IssuePriority.MEDIUM]: { icon: ArrowRight, color: "text-yellow-500", label: "Medium" },
    [IssuePriority.LOW]: { icon: ArrowDown, color: "text-blue-400", label: "Low" },
    [IssuePriority.NO_PRIORITY]: { icon: Minus, color: "text-[#4a4a6a]", label: "No priority" },
};

export const PriorityIcon: React.FC<PriorityIconProps> = ({
    priority,
    className = "",
    showLabel = false,
}) => {
    const { icon: Icon, color, label } = PRIORITY_CONFIG[priority];

    return (
        <span className={`inline-flex items-center gap-1.5 ${className}`} title={label}>
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} strokeWidth={2.5} />
            {showLabel && (
                <span className="text-xs text-[var(--text-secondary)]">{label}</span>
            )}
        </span>
    );
};

export { PRIORITY_CONFIG };