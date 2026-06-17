import React from "react";
import { Circle, CircleDot, Timer, CheckCircle2 } from "lucide-react";
import { IssueStatus } from "@/types";

interface StatusBadgeProps {
    status: IssueStatus;
    showLabel?: boolean;
    className?: string;
}

const STATUS_CONFIG: Record<
IssueStatus,
    { icon: React.ElementType; color: string; bg: string; label: string }
    > = {
    [IssueStatus.BACKLOG]: { icon: Circle, color: "text-[#64748b]", bg: "bg-slate-800/60", label: "Backlog" },
    [IssueStatus.TODO]: { icon: CircleDot, color: "text-[#94a3b8]", bg: "bg-slate-700/60", label: "Todo" },
    [IssueStatus.IN_PROGRESS]: { icon: Timer, color: "text-indigo-400", bg: "bg-indigo-950/60", label: "In Progress" },
    [IssueStatus.DONE]: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-950/60", label: "Done" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    showLabel = false,
    className = "",
}) => {
    const { icon: Icon, color, bg, label } = STATUS_CONFIG[status];

    if (!showLabel) {
        return (
            <Icon
                className={`w-3.5 h-3.5 flex-shrink-0 ${color} ${className}`}
                strokeWidth={2}
                title={label}
            />
        );
    }

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium
        ${bg} ${color} ${className}
      `}
        >
            <Icon className="w-3 h-3" strokeWidth={2} />
            {label}
        </span>
    );
};

export { STATUS_CONFIG };