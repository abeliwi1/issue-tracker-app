// ============================================================
// Core Enums
// ============================================================

export enum IssueStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export enum IssuePriority {
    NO_PRIORITY = "NO_PRIORITY",
    URGENT = "URGENT",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
}

export enum ProjectStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
}

// ============================================================
// Entity Interfaces
// ============================================================

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    /** Initials derived from name, used as fallback avatar */
    initials: string;
    role: "ADMIN" | "MEMBER" | "VIEWER";
}

export interface Label {
    id: string;
    name: string;
    /** Hex color string, e.g. "#6366f1" */
    color: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    /** Short identifier prefix for issue keys, e.g. "PLT" → PLT-42 */
    prefix: string;
    /** Owner user ID */
    ownerId: string;
    memberIds: string[];
    createdAt: string; // ISO 8601
    updatedAt: string;
}

export interface Issue {
    id: string;
    /** Human-readable key, e.g. "PLT-42" */
    key: string;
    title: string;
    description: string | null;
    status: IssueStatus;
    priority: IssuePriority;
    /** Sequence number within the project for ordering within a column */
    sortOrder: number;
    projectId: string;
    assigneeId: string | null;
    reporterId: string;
    labelIds: string[];
    /** Estimated effort in story points */
    storyPoints: number | null;
    dueDate: string | null; // ISO 8601 date string
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// Board / UI State Interfaces
// ============================================================

/** Column definition — driven by IssueStatus enum */
export interface BoardColumn {
    id: IssueStatus;
    title: string;
    color: string;
    issueIds: string[];
}

export type BoardColumnMap = Record<IssueStatus, BoardColumn>;

/** Active filter state stored in the global store */
export interface BoardFilters {
    search: string;
    assigneeIds: string[];
    priorities: IssuePriority[];
    labelIds: string[];
}

/** Payload for creating a new issue */
export interface CreateIssuePayload {
    title: string;
    description?: string;
    status: IssueStatus;
    priority: IssuePriority;
    projectId: string;
    assigneeId?: string | null;
    reporterId: string;
    labelIds?: string[];
    storyPoints?: number | null;
    dueDate?: string | null;
}

/** Payload for updating an existing issue */
export interface UpdateIssuePayload {
    id: string;
    title?: string;
    description?: string | null;
    status?: IssueStatus;
    priority?: IssuePriority;
    assigneeId?: string | null;
    labelIds?: string[];
    storyPoints?: number | null;
    dueDate?: string | null;
}

/** Arguments for the optimistic move action */
export interface MoveIssuePayload {
    issueId: string;
    fromStatus: IssueStatus;
    toStatus: IssueStatus;
    /** Target index within the destination column's issueIds array */
    toIndex: number;
}

// ============================================================
// Comments & Activity Log
// ============================================================

export interface Comment {
    id: string;
    issueId: string;
    authorId: string;
    body: string;
    createdAt: string; // ISO 8601
}

export type ActivityAction =
    | "CREATED"
    | "STATUS_CHANGED"
    | "PRIORITY_CHANGED"
    | "ASSIGNEE_CHANGED"
    | "TITLE_CHANGED"
    | "LABEL_ADDED"
    | "LABEL_REMOVED";

export interface ActivityLogEntry {
    id: string;
    issueId: string;
    actorId: string;
    action: ActivityAction;
    /** Human-readable "from" value, if applicable (e.g. previous status) */
    fromValue: string | null;
    /** Human-readable "to" value, if applicable (e.g. new status) */
    toValue: string | null;
    createdAt: string;
}

export interface AddCommentPayload {
    issueId: string;
    authorId: string;
    body: string;
}