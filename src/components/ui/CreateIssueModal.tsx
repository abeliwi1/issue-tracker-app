import React, { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useBoardStore } from "@/store/board-store";
import { IssueStatus, IssuePriority } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { PriorityIcon, PRIORITY_CONFIG } from "./PriorityIcon";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";

export const CreateIssueModal: React.FC = () => {
    const isOpen = useBoardStore((s) => s.isCreateModalOpen);
    const closeModal = useBoardStore((s) => s.closeCreateModal);
    const createIssue = useBoardStore((s) => s.createIssue);
    const activeProjectId = useBoardStore((s) => s.activeProjectId);

    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [status, setStatus] = useState<IssueStatus>(IssueStatus.TODO);
    const [priority, setPriority] = useState<IssuePriority>(IssuePriority.MEDIUM);
    const [assigneeId, setAssignee] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);

    // Focus title on open, reset on close
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => titleRef.current?.focus(), 50);
        } else {
            setTitle("");
            setDesc("");
            setStatus(IssueStatus.TODO);
            setPriority(IssuePriority.MEDIUM);
            setAssignee("");
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [closeModal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        // Simulate async — in a real app this would be an API call
        setTimeout(() => {
            createIssue({
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                priority,
                projectId: activeProjectId,
                assigneeId: assigneeId || null,
                reporterId: "usr_1", // current user
                labelIds: [],
            });
            setSubmitting(false);
            closeModal();
        }, 300);
    };

    if (!isOpen) return null;

    const statuses = Object.values(IssueStatus);
    const priorities = Object.values(IssuePriority);

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
            {/* Blur backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}/>

            {/* Modal panel */}
            <div
                className="
          relative z-10 w-full max-w-lg
          bg-[var(--bg-elevated)] border border-[var(--border)]
          rounded-xl shadow-2xl shadow-black/50
          animate-in fade-in zoom-in-95 duration-150
        "
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--border)]">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                        New Issue
                    </h2>
                    <button
                        onClick={closeModal}
                        className="
              p-1 rounded-md text-[var(--text-muted)]
              hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]
              transition-colors
            "
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Title */}
                    <input
                        ref={titleRef}
                        type="text"
                        placeholder="Issue title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="
              w-full bg-transparent text-[var(--text-primary)] text-base font-medium
              placeholder:text-[var(--text-muted)]
              border-none outline-none resize-none
            "
                        required
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Add a description..."
                        value={description}
                        onChange={(e) => setDesc(e.target.value)}
                        rows={3}
                        className="
              w-full bg-transparent text-sm text-[var(--text-secondary)]
              placeholder:text-[var(--text-muted)]
              border-none outline-none resize-none
            "
                    />

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">

                        {/* Status */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as IssueStatus)}
                            className="
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs
                bg-[var(--bg-hover)] text-[var(--text-secondary)]
                border border-[var(--border)] outline-none cursor-pointer
                hover:border-[var(--border-focus)] transition-colors
              "
                        >
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {STATUS_CONFIG[s].label}
                                </option>
                            ))}
                        </select>

                        {/* Priority */}
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as IssuePriority)}
                            className="
                px-2.5 py-1.5 rounded-md text-xs
                bg-[var(--bg-hover)] text-[var(--text-secondary)]
                border border-[var(--border)] outline-none cursor-pointer
                hover:border-[var(--border-focus)] transition-colors
              "
                        >
                            {priorities.map((p) => (
                                <option key={p} value={p}>
                                    {PRIORITY_CONFIG[p].label}
                                </option>
                            ))}
                        </select>

                        {/* Assignee */}
                        <select
                            value={assigneeId}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="
                px-2.5 py-1.5 rounded-md text-xs
                bg-[var(--bg-hover)] text-[var(--text-secondary)]
                border border-[var(--border)] outline-none cursor-pointer
                hover:border-[var(--border-focus)] transition-colors
              "
                        >
                            <option value="">Unassigned</option>
                            {MOCK_USERS.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="
                px-3 py-1.5 rounded-md text-xs font-medium
                text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-hover)] transition-colors
              "
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || submitting}
                            className="
                px-3 py-1.5 rounded-md text-xs font-semibold
                bg-[var(--accent)] text-white
                hover:bg-[var(--accent-hover)]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors flex items-center gap-1.5
              "
                        >
                            {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                            Create issue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};