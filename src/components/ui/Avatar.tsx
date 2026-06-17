import React from "react";
import { User } from "@/types";
 
// Deterministic color per user based on their ID
const AVATAR_COLORS = [
    "bg-violet-600",
    "bg-indigo-600",
    "bg-blue-600",
    "bg-cyan-600",
    "bg-teal-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-orange-600",
];

function getAvatarColor(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface AvatarProps {
    user: User;
    size?: "xs" | "sm" | "md";
    className?: string;
}

const SIZE_CLASSES = {
    xs: "w-5 h-5 text-[10px]",
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
};

export const Avatar: React.FC<AvatarProps> = ({ user, size = "sm", className = "" }) => {
    const colorClass = getAvatarColor(user.id);
    const sizeClass = SIZE_CLASSES[size];

    if (user.avatarUrl) {
        return (
            <img
                src={user.avatarUrl}
                alt={user.name}
                title={user.name}
                className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
            />
        );
    }

    return (
        <div
            title={user.name}
            className={`
        ${sizeClass} ${colorClass} ${className}
        rounded-full flex items-center justify-center
        font-semibold text-white flex-shrink-0 select-none
      `}
        >
            {user.initials}
        </div>
    );
};