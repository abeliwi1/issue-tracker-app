import React, { useRef } from "react";
import {
    Search,
    Plus,
    X,
    ChevronDown,
} from "lucide-react";
import { useBoardStore } from "@/store/board-store";
import { MOCK_USERS } from "@/lib/mock-data";
import { IssuePriority } from "@/types";
import { PriorityIcon, PRIORITY_CONFIG } from "@/components/ui/PriorityIcon";
import { Avatar } from "@/components/ui/Avatar";

export const TopBar: React.FC = () => {
    const filters = useBoardStore((s) => s.filters);
    const activeProjectId = useBoardStore((s) => s.activeProjectId);
    const projects = useBoardStore((s) => s.projects);
    const activeView = useBoardStore((s) => s.activeView);
    const setSearch = useBoardStore((s) => s.setSearchQuery);
    const toggleAssignee = useBoardStore((s) => s.toggleAssigneeFilter);
    const togglePriority = useBoardStore((s) => s.togglePriorityFilter);
    const clearFilters = useBoardStore((s) => s.clearFilters);
    const openModal = useBoardStore((s) => s.openCreateModal);

    const searchRef = useRef<HTMLInputElement>(null);

    const activeProject = projects[activeProjectId];

    const VIEW_LABELS = {
        "board": "Board",
        "backlog": "Backlog",
        "all-issues": "All Issues",
    };

    const hasActiveFilters =
        filters.assigneeIds.length > 0 ||
        filters.priorities.length > 0 ||
        filters.labelIds.length > 0;

    const priorities = [
        IssuePriority.URGENT,
        IssuePriority.HIGH,
        IssuePriority.MEDIUM,
        IssuePriority.LOW,
        IssuePriority.NO_PRIORITY,
    ];

    return (
        <header
            className="
        h-12 flex-shrink-0 flex items-center gap-3 px-5
        bg-[var(--bg-surface)] border-b border-[var(--border)]
      "
        >
            {/* Page title */}
            <div className="flex items-center gap-2 min-w-0 mr-2">
                <h1 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {activeProject?.name}
                </h1>
                <span className="text-[var(--text-muted)] text-sm">/</span>
                <span className="text-sm text-[var(--text-secondary)]">
                    {VIEW_LABELS[activeView]}
                </span>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
                <Search
                    className="
            absolute left-2.5 top-1/2 -translate-y-1/2
            w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none
          "
                />
                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search issues..."
                    value={filters.search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
            w-full h-7 pl-8 pr-8 rounded-md text-xs
            bg-[var(--bg-elevated)] border border-[var(--border)]
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            outline-none focus:border-[var(--border-focus)]
            transition-colors
          "
                />
                {filters.search && (
                    <button
                        onClick={() => setSearch("")}
                        className="
              absolute right-2 top-1/2 -translate-y-1/2
              text-[var(--text-muted)] hover:text-[var(--text-secondary)]
            "
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Filter group */}
            <div className="flex items-center gap-1.5">

                {/* Assignee filter */}
                <div className="relative group">
                    <button
                        className={`
              flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs
              border transition-colors
              ${filters.assigneeIds.length > 0
                                ? "border-indigo-500/50 bg-[var(--accent-subtle)] text-indigo-300"
                                : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                            }
            `}
                    >
                        Assignee
                        {filters.assigneeIds.length > 0 && (
                            <span className="bg-indigo-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                {filters.assigneeIds.length}
                            </span>
                        )}
                        <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    {/* Dropdown */}
                    <div
                        className="
              absolute left-0 top-full mt-1 z-30
              w-44 bg-[var(--bg-elevated)] border border-[var(--border)]
              rounded-lg shadow-xl shadow-black/40
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-150
            "
                    >
                        <div className="p-1">
                            {MOCK_USERS.map((user) => {
                                const active = filters.assigneeIds.includes(user.id);
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => toggleAssignee(user.id)}
                                        className={`
                      w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs
                      transition-colors text-left
                      ${active
                                                ? "bg-[var(--accent-subtle)] text-[var(--text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                                            }
                    `}
                                    >
                                        <Avatar user={user} size="xs" />
                                        <span className="truncate">{user.name}</span>
                                        {active && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Priority filter */}
                <div className="relative group">
                    <button
                        className={`
              flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs
              border transition-colors
              ${filters.priorities.length > 0
                                ? "border-indigo-500/50 bg-[var(--accent-subtle)] text-indigo-300"
                                : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                            }
            `}
                    >
                        Priority
                        {filters.priorities.length > 0 && (
                            <span className="bg-indigo-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                {filters.priorities.length}
                            </span>
                        )}
                        <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    <div
                        className="
              absolute left-0 top-full mt-1 z-30
              w-40 bg-[var(--bg-elevated)] border border-[var(--border)]
              rounded-lg shadow-xl shadow-black/40
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-150
            "
                    >
                        <div className="p-1">
                            {priorities.map((p) => {
                                const active = filters.priorities.includes(p);
                                return (
                                    <button
                                        key={p}
                                        onClick={() => togglePriority(p)}
                                        className={`
                      w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs
                      transition-colors text-left
                      ${active
                                                ? "bg-[var(--accent-subtle)] text-[var(--text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                                            }
                    `}
                                    >
                                        <PriorityIcon priority={p} />
                                        {PRIORITY_CONFIG[p].label}
                                        {active && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="
              flex items-center gap-1 h-7 px-2 rounded-md text-xs
              text-[var(--text-muted)] hover:text-red-400
              transition-colors
            "
                        title="Clear all filters"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* New Issue button */}
            <button
                onClick={openModal}
                className="
          flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-semibold
          bg-[var(--accent)] text-white
          hover:bg-[var(--accent-hover)]
          transition-colors
        "
            >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                New Issue
            </button>
        </header>
    );
};