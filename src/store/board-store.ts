import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
    Issue,
    User,
    Project,
    Label,
    BoardColumnMap,
    BoardFilters,
    // IssueStatus,
    CreateIssuePayload,
    UpdateIssuePayload,
    MoveIssuePayload,
    Comment,
    ActivityLogEntry,
    AddCommentPayload,
} from "../types";
import {
    MOCK_ISSUES,
    MOCK_USERS,
    MOCK_PROJECTS,
    MOCK_LABELS,
    INITIAL_COLUMNS,
    generateId,
    generateIssueKey,
    MOCK_COMMENTS,
    MOCK_ACTIVITY,
    buildActivityEntry,
} from "../lib/mock-data";

// ============================================================
// State Shape
// ============================================================

interface BoardState {
    // ── Entities (normalized) ──────────────────────────────────
    issues: Record<string, Issue>;
    users: Record<string, User>;
    projects: Record<string, Project>;
    labels: Record<string, Label>;
    comments: Record<string, Comment>;
    activityLog: Record<string, ActivityLogEntry>;

    // ── Board structure ────────────────────────────────────────
    columns: BoardColumnMap;

    // ── Active context ─────────────────────────────────────────
    activeProjectId: string;
    activeView: "board" | "backlog" | "all-issues";

    // ── Filters ────────────────────────────────────────────────
    filters: BoardFilters;

    // ── UI State ───────────────────────────────────────────────
    selectedIssueId: string | null;
    isCreateModalOpen: boolean;
    /** Issue ID currently being dragged (for visual feedback) */
    draggingIssueId: string | null;
    
}

// ============================================================
// Actions Shape
// ============================================================

interface BoardActions {
    // ── Issue CRUD ─────────────────────────────────────────────
    createIssue: (payload: CreateIssuePayload) => Issue;
    updateIssue: (payload: UpdateIssuePayload) => void;
    deleteIssue: (issueId: string) => void;

    // ── Optimistic board moves ─────────────────────────────────
    moveIssue: (payload: MoveIssuePayload) => void;

    // ── Filter actions ─────────────────────────────────────────
    setSearchQuery: (query: string) => void;
    toggleAssigneeFilter: (userId: string) => void;
    togglePriorityFilter: (priority: import("../types").IssuePriority) => void;
    toggleLabelFilter: (labelId: string) => void;
    clearFilters: () => void;

    // ── View / navigation ──────────────────────────────────────
    setActiveProject: (projectId: string) => void;
    setActiveView: (view: BoardState["activeView"]) => void;

    // ── UI helpers ─────────────────────────────────────────────
    selectIssue: (issueId: string | null) => void;
    openCreateModal: () => void;
    closeCreateModal: () => void;
    setDraggingIssue: (issueId: string | null) => void;

    // ── Comment and activity actions ───────────────────────────
    addComment: (payload: AddCommentPayload) => void;
    getCommentsForIssue: (issueId: string) => Comment[];
    getActivityForIssue: (issueId: string) => ActivityLogEntry[];
}

// ============================================================
// Normalise arrays → Records on init
// ============================================================

const normalise = <T extends { id: string }>(arr: T[]): Record<string, T> =>
    arr.reduce((acc, item) => ({ ...acc, [item.id]: item }), {} as Record<string, T>);

const DEFAULT_FILTERS: BoardFilters = {
    search: "",
    assigneeIds: [],
    priorities: [],
    labelIds: [],
};

// ============================================================
// Store
// ============================================================

export const useBoardStore = create<BoardState & BoardActions>()(
    devtools(
        subscribeWithSelector(
            immer((set, get) => ({
                // ── Initial State ──────────────────────────────────────
                issues: normalise(MOCK_ISSUES),
                users: normalise(MOCK_USERS),
                projects: normalise(MOCK_PROJECTS),
                labels: normalise(MOCK_LABELS),
                comments: normalise(MOCK_COMMENTS),
                activityLog: normalise(MOCK_ACTIVITY),
                columns: INITIAL_COLUMNS,
                activeProjectId: "proj_1",
                activeView: "board",
                filters: { ...DEFAULT_FILTERS },
                selectedIssueId: null,
                isCreateModalOpen: false,
                draggingIssueId: null,

                // ── Issue CRUD ─────────────────────────────────────────

                createIssue: (payload) => {
                    const allIssues = Object.values(get().issues);
                    const id = generateId("iss");
                    const key = generateIssueKey(payload.projectId, allIssues);
                    const now = new Date().toISOString();
                    const column = get().columns[payload.status];

                    const newIssue: Issue = {
                        id,
                        key,
                        title: payload.title,
                        description: payload.description ?? null,
                        status: payload.status,
                        priority: payload.priority,
                        sortOrder: column.issueIds.length, // append to end
                        projectId: payload.projectId,
                        assigneeId: payload.assigneeId ?? null,
                        reporterId: payload.reporterId,
                        labelIds: payload.labelIds ?? [],
                        storyPoints: payload.storyPoints ?? null,
                        dueDate: payload.dueDate ?? null,
                        createdAt: now,
                        updatedAt: now,
                    };

                    set((state) => {
                        state.issues[id] = newIssue;
                        state.columns[payload.status].issueIds.push(id);
                    });

                    return newIssue;
                },

                updateIssue: (payload) => {
                    set((state) => {
                        const issue = state.issues[payload.id];
                        if (!issue) return;

                        const now = new Date().toISOString();
                        const actorId = "usr_1"; // current user

                        // Status change → log activity
                        if (payload.status && payload.status !== issue.status) {
                            const oldCol = state.columns[issue.status];
                            oldCol.issueIds = oldCol.issueIds.filter((id) => id !== payload.id);
                            state.columns[payload.status].issueIds.push(payload.id);

                            const entry = buildActivityEntry(
                                issue.id,
                                actorId,
                                "STATUS_CHANGED",
                                issue.status,
                                payload.status
                            );
                            state.activityLog[entry.id] = entry;

                            issue.status = payload.status;
                        }

                        // Priority change → log activity
                        if (payload.priority !== undefined && payload.priority !== issue.priority) {
                            const entry = buildActivityEntry(
                                issue.id,
                                actorId,
                                "PRIORITY_CHANGED",
                                issue.priority,
                                payload.priority
                            );
                            state.activityLog[entry.id] = entry;
                            issue.priority = payload.priority;
                        }

                        // Assignee change → log activity
                        if (payload.assigneeId !== undefined && payload.assigneeId !== issue.assigneeId) {
                            const fromUser = issue.assigneeId ? state.users[issue.assigneeId]?.name : "Unassigned";
                            const toUser = payload.assigneeId ? state.users[payload.assigneeId]?.name : "Unassigned";

                            const entry = buildActivityEntry(
                                issue.id,
                                actorId,
                                "ASSIGNEE_CHANGED",
                                fromUser ?? "Unassigned",
                                toUser ?? "Unassigned"
                            );
                            state.activityLog[entry.id] = entry;
                            issue.assigneeId = payload.assigneeId;
                        }

                        if (payload.title !== undefined && payload.title !== issue.title) {
                            issue.title = payload.title;
                        }
                        if (payload.description !== undefined) issue.description = payload.description;
                        if (payload.labelIds !== undefined) issue.labelIds = payload.labelIds;
                        if (payload.storyPoints !== undefined) issue.storyPoints = payload.storyPoints;
                        if (payload.dueDate !== undefined) issue.dueDate = payload.dueDate;

                        issue.updatedAt = now;
                    });
                },

                deleteIssue: (issueId) => {
                    set((state) => {
                        const issue = state.issues[issueId];
                        if (!issue) return;

                        // Remove from column
                        const col = state.columns[issue.status];
                        col.issueIds = col.issueIds.filter((id) => id !== issueId);

                        // Remove from entity map
                        delete state.issues[issueId];

                        // Deselect if this was selected
                        if (state.selectedIssueId === issueId) {
                            state.selectedIssueId = null;
                        }
                    });
                },

                addComment: (payload) => {
                    set((state) => {
                        const id = generateId("cmt");
                        const comment: Comment = {
                            id,
                            issueId: payload.issueId,
                            authorId: payload.authorId,
                            body: payload.body,
                            createdAt: new Date().toISOString(),
                        };
                        state.comments[id] = comment;
                    });
                },

                getCommentsForIssue: (issueId) => {
                    return Object.values(get().comments)
                        .filter((c) => c.issueId === issueId)
                        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                },

                getActivityForIssue: (issueId) => {
                    return Object.values(get().activityLog)
                        .filter((a) => a.issueId === issueId)
                        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                },

                // ── Optimistic Drag-and-Drop Move ──────────────────────

                moveIssue: ({ issueId, fromStatus, toStatus, toIndex }) => {
                    set((state) => {
                        const fromCol = state.columns[fromStatus];
                        const toCol = state.columns[toStatus];

                        if (!fromCol || !toCol) return;

                        // Remove from source column
                        fromCol.issueIds = fromCol.issueIds.filter((id) => id !== issueId);

                        // Insert at target index in destination column
                        const clampedIndex = Math.min(toIndex, toCol.issueIds.length);
                        toCol.issueIds.splice(clampedIndex, 0, issueId);

                        // Update the issue entity's status and sortOrder
                        const issue = state.issues[issueId];
                        if (issue) {
                            issue.status = toStatus;
                            issue.sortOrder = clampedIndex;
                            issue.updatedAt = new Date().toISOString();
                        }

                        // Recompute sortOrder for all issues in affected columns
                        fromCol.issueIds.forEach((id, idx) => {
                            if (state.issues[id]) state.issues[id].sortOrder = idx;
                        });
                        if (fromStatus !== toStatus) {
                            toCol.issueIds.forEach((id, idx) => {
                                if (state.issues[id]) state.issues[id].sortOrder = idx;
                            });
                        }
                    });
                },

                // ── Filters ────────────────────────────────────────────

                setSearchQuery: (query) => {
                    set((state) => {
                        state.filters.search = query;
                    });
                },

                toggleAssigneeFilter: (userId) => {
                    set((state) => {
                        const idx = state.filters.assigneeIds.indexOf(userId);
                        if (idx === -1) {
                            state.filters.assigneeIds.push(userId);
                        } else {
                            state.filters.assigneeIds.splice(idx, 1);
                        }
                    });
                },

                togglePriorityFilter: (priority) => {
                    set((state) => {
                        const idx = state.filters.priorities.indexOf(priority);
                        if (idx === -1) {
                            state.filters.priorities.push(priority);
                        } else {
                            state.filters.priorities.splice(idx, 1);
                        }
                    });
                },

                toggleLabelFilter: (labelId) => {
                    set((state) => {
                        const idx = state.filters.labelIds.indexOf(labelId);
                        if (idx === -1) {
                            state.filters.labelIds.push(labelId);
                        } else {
                            state.filters.labelIds.splice(idx, 1);
                        }
                    });
                },

                clearFilters: () => {
                    set((state) => {
                        state.filters = { ...DEFAULT_FILTERS };
                    });
                },

                // ── Navigation ─────────────────────────────────────────

                setActiveProject: (projectId) => {
                    set((state) => {
                        state.activeProjectId = projectId;
                        state.filters = { ...DEFAULT_FILTERS };
                    });
                },

                setActiveView: (view) => {
                    set((state) => {
                        state.activeView = view;
                    });
                },

                // ── UI Helpers ─────────────────────────────────────────

                selectIssue: (issueId) => {
                    set((state) => {
                        state.selectedIssueId = issueId;
                    });
                },

                openCreateModal: () => {
                    set((state) => {
                        state.isCreateModalOpen = true;
                    });
                },

                closeCreateModal: () => {
                    set((state) => {
                        state.isCreateModalOpen = false;
                    });
                },

                setDraggingIssue: (issueId) => {
                    set((state) => {
                        state.draggingIssueId = issueId;
                    });
                },
            }))
        ),
        { name: "BoardStore" }
    )
);