import {
    User,
    Project,
    Issue,
    Label,
    IssueStatus,
    IssuePriority,
    ProjectStatus,
    BoardColumnMap,
    Comment, ActivityLogEntry
} from "@/types";

// ============================================================
// Users
// ============================================================

export const MOCK_USERS: User[] = [
    {
        id: "usr_1",
        name: "Alex Rivera",
        email: "alex@orbitapp.io",
        avatarUrl: null,
        initials: "AR",
        role: "ADMIN",
    },
    {
        id: "usr_2",
        name: "Sam Okafor",
        email: "sam@orbitapp.io",
        avatarUrl: null,
        initials: "SO",
        role: "MEMBER",
    },
    {
        id: "usr_3",
        name: "Jordan Lee",
        email: "jordan@orbitapp.io",
        avatarUrl: null,
        initials: "JL",
        role: "MEMBER",
    },
    {
        id: "usr_4",
        name: "Priya Nair",
        email: "priya@orbitapp.io",
        avatarUrl: null,
        initials: "PN",
        role: "MEMBER",
    },
];

// ============================================================
// Labels
// ============================================================

export const MOCK_LABELS: Label[] = [
    { id: "lbl_1", name: "bug", color: "#ef4444" },
    { id: "lbl_2", name: "feature", color: "#6366f1" },
    { id: "lbl_3", name: "improvement", color: "#22c55e" },
    { id: "lbl_4", name: "docs", color: "#f59e0b" },
    { id: "lbl_5", name: "performance", color: "#06b6d4" },
    { id: "lbl_6", name: "security", color: "#ec4899" },
];

// ============================================================
// Projects
// ============================================================

export const MOCK_PROJECTS: Project[] = [
    {
        id: "proj_1",
        name: "Platform Core",
        description: "Core infrastructure and API services",
        status: ProjectStatus.ACTIVE,
        prefix: "PLT",
        ownerId: "usr_1",
        memberIds: ["usr_1", "usr_2", "usr_3", "usr_4"],
        createdAt: "2024-11-01T09:00:00Z",
        updatedAt: "2025-05-15T14:22:00Z",
    },
    {
        id: "proj_2",
        name: "Web App",
        description: "Customer-facing React frontend",
        status: ProjectStatus.ACTIVE,
        prefix: "WEB",
        ownerId: "usr_2",
        memberIds: ["usr_1", "usr_2", "usr_3"],
        createdAt: "2024-11-15T10:00:00Z",
        updatedAt: "2025-05-20T11:00:00Z",
    },
    {
        id: "proj_3",
        name: "Mobile (iOS/Android)",
        description: "React Native mobile application",
        status: ProjectStatus.PAUSED,
        prefix: "MOB",
        ownerId: "usr_3",
        memberIds: ["usr_3", "usr_4"],
        createdAt: "2025-01-10T08:00:00Z",
        updatedAt: "2025-04-01T09:00:00Z",
    },
];

// ============================================================
// Issues — relational, cross-referencing projects & users
// ============================================================

export const MOCK_ISSUES: Issue[] = [
    // ── BACKLOG ────────────────────────────────────────────────
    {
        id: "iss_1",
        key: "PLT-1",
        title: "Migrate auth service to OAuth 2.1",
        description:
            "Upgrade legacy session-based auth to OAuth 2.1 with PKCE support. Remove deprecated JWT signing methods.",
        status: IssueStatus.BACKLOG,
        priority: IssuePriority.HIGH,
        sortOrder: 0,
        projectId: "proj_1",
        assigneeId: "usr_2",
        reporterId: "usr_1",
        labelIds: ["lbl_2", "lbl_6"],
        storyPoints: 8,
        dueDate: "2025-08-01",
        createdAt: "2025-04-01T09:00:00Z",
        updatedAt: "2025-05-01T09:00:00Z",
    },
    {
        id: "iss_2",
        key: "PLT-2",
        title: "Implement rate limiting on all public endpoints",
        description: "Add Redis-backed sliding window rate limiting at the gateway layer.",
        status: IssueStatus.BACKLOG,
        priority: IssuePriority.MEDIUM,
        sortOrder: 1,
        projectId: "proj_1",
        assigneeId: null,
        reporterId: "usr_1",
        labelIds: ["lbl_6", "lbl_5"],
        storyPoints: 5,
        dueDate: null,
        createdAt: "2025-04-05T10:00:00Z",
        updatedAt: "2025-05-02T10:00:00Z",
    },
    {
        id: "iss_3",
        key: "WEB-1",
        title: "Redesign onboarding flow with new brand guidelines",
        description: null,
        status: IssueStatus.BACKLOG,
        priority: IssuePriority.LOW,
        sortOrder: 2,
        projectId: "proj_2",
        assigneeId: "usr_3",
        reporterId: "usr_2",
        labelIds: ["lbl_2"],
        storyPoints: 13,
        dueDate: "2025-09-15",
        createdAt: "2025-04-10T11:00:00Z",
        updatedAt: "2025-04-10T11:00:00Z",
    },

    // ── TODO ───────────────────────────────────────────────────
    {
        id: "iss_4",
        key: "PLT-3",
        title: "Set up distributed tracing with OpenTelemetry",
        description:
            "Instrument all microservices with OTEL spans. Export traces to Jaeger/Tempo.",
        status: IssueStatus.TODO,
        priority: IssuePriority.HIGH,
        sortOrder: 0,
        projectId: "proj_1",
        assigneeId: "usr_4",
        reporterId: "usr_1",
        labelIds: ["lbl_3", "lbl_5"],
        storyPoints: 8,
        dueDate: "2025-07-01",
        createdAt: "2025-04-15T09:00:00Z",
        updatedAt: "2025-05-10T09:00:00Z",
    },
    {
        id: "iss_5",
        key: "WEB-2",
        title: "Implement command palette (⌘K) for quick navigation",
        description: "Build a fuzzy-search command palette similar to Linear's.",
        status: IssueStatus.TODO,
        priority: IssuePriority.MEDIUM,
        sortOrder: 1,
        projectId: "proj_2",
        assigneeId: "usr_3",
        reporterId: "usr_2",
        labelIds: ["lbl_2", "lbl_3"],
        storyPoints: 5,
        dueDate: null,
        createdAt: "2025-04-20T14:00:00Z",
        updatedAt: "2025-05-05T14:00:00Z",
    },
    {
        id: "iss_6",
        key: "WEB-3",
        title: "Fix memory leak in real-time subscription hook",
        description:
            "useRealtimeData cleanup is not running on unmount, causing stale subscriptions.",
        status: IssueStatus.TODO,
        priority: IssuePriority.URGENT,
        sortOrder: 2,
        projectId: "proj_2",
        assigneeId: "usr_1",
        reporterId: "usr_3",
        labelIds: ["lbl_1"],
        storyPoints: 3,
        dueDate: "2025-06-15",
        createdAt: "2025-05-01T08:00:00Z",
        updatedAt: "2025-05-28T08:00:00Z",
    },

    // ── IN PROGRESS ────────────────────────────────────────────
    {
        id: "iss_7",
        key: "PLT-4",
        title: "Build webhook delivery system with retry queue",
        description:
            "Persistent outbound webhook delivery with exponential backoff, dead-letter queue, and delivery logs.",
        status: IssueStatus.IN_PROGRESS,
        priority: IssuePriority.HIGH,
        sortOrder: 0,
        projectId: "proj_1",
        assigneeId: "usr_2",
        reporterId: "usr_1",
        labelIds: ["lbl_2", "lbl_5"],
        storyPoints: 13,
        dueDate: "2025-06-20",
        createdAt: "2025-05-01T09:00:00Z",
        updatedAt: "2025-06-01T09:00:00Z",
    },
    {
        id: "iss_8",
        key: "WEB-4",
        title: "Kanban board drag-and-drop implementation",
        description:
            "Implement @dnd-kit powered Kanban board with optimistic UI updates and keyboard accessibility.",
        status: IssueStatus.IN_PROGRESS,
        priority: IssuePriority.HIGH,
        sortOrder: 1,
        projectId: "proj_2",
        assigneeId: "usr_3",
        reporterId: "usr_2",
        labelIds: ["lbl_2", "lbl_3"],
        storyPoints: 8,
        dueDate: "2025-06-18",
        createdAt: "2025-05-10T10:00:00Z",
        updatedAt: "2025-06-05T10:00:00Z",
    },
    {
        id: "iss_9",
        key: "PLT-5",
        title: "Write API documentation with OpenAPI 3.1",
        description: "Document all REST endpoints. Auto-generate SDK types from spec.",
        status: IssueStatus.IN_PROGRESS,
        priority: IssuePriority.MEDIUM,
        sortOrder: 2,
        projectId: "proj_1",
        assigneeId: "usr_4",
        reporterId: "usr_1",
        labelIds: ["lbl_4"],
        storyPoints: 5,
        dueDate: null,
        createdAt: "2025-05-15T11:00:00Z",
        updatedAt: "2025-06-02T11:00:00Z",
    },

    // ── DONE ───────────────────────────────────────────────────
    {
        id: "iss_10",
        key: "PLT-6",
        title: "Set up CI/CD pipeline with GitHub Actions",
        description: "Automated test, lint, build, and deploy pipeline across all services.",
        status: IssueStatus.DONE,
        priority: IssuePriority.HIGH,
        sortOrder: 0,
        projectId: "proj_1",
        assigneeId: "usr_1",
        reporterId: "usr_1",
        labelIds: ["lbl_3"],
        storyPoints: 5,
        dueDate: null,
        createdAt: "2025-03-01T09:00:00Z",
        updatedAt: "2025-03-20T09:00:00Z",
    },
    {
        id: "iss_11",
        key: "WEB-5",
        title: "Migrate from CRA to Vite",
        description: "Remove Create React App, configure Vite with SWC.",
        status: IssueStatus.DONE,
        priority: IssuePriority.MEDIUM,
        sortOrder: 1,
        projectId: "proj_2",
        assigneeId: "usr_2",
        reporterId: "usr_2",
        labelIds: ["lbl_3", "lbl_5"],
        storyPoints: 3,
        dueDate: null,
        createdAt: "2025-03-15T10:00:00Z",
        updatedAt: "2025-04-01T10:00:00Z",
    },
    {
        id: "iss_12",
        key: "WEB-6",
        title: "Add dark mode support across all components",
        description:
            "Implement CSS variable-driven dark theme. Persist preference in localStorage.",
        status: IssueStatus.DONE,
        priority: IssuePriority.LOW,
        sortOrder: 2,
        projectId: "proj_2",
        assigneeId: "usr_3",
        reporterId: "usr_2",
        labelIds: ["lbl_3"],
        storyPoints: 3,
        dueDate: null,
        createdAt: "2025-04-01T09:00:00Z",
        updatedAt: "2025-04-20T09:00:00Z",
    },
];


// ============================================================
// Comments — a few initially seeded per issue for testing/UI purposes
// ============================================================

export const MOCK_COMMENTS: Comment[] = [
    {
        id: "cmt_1",
        issueId: "iss_7",
        authorId: "usr_1",
        body: "Should we use exponential backoff with jitter here, or keep it simple with fixed intervals?",
        createdAt: "2025-05-12T10:15:00Z",
    },
    {
        id: "cmt_2",
        issueId: "iss_7",
        authorId: "usr_2",
        body: "Going with jitter — flat backoff causes thundering herd when a downstream service recovers.",
        createdAt: "2025-05-12T11:02:00Z",
    },
    {
        id: "cmt_3",
        issueId: "iss_8",
        authorId: "usr_2",
        body: "Nice work on the collision detection switch to closestCorners — much more accurate near column edges.",
        createdAt: "2025-06-04T09:30:00Z",
    },
    {
        id: "cmt_4",
        issueId: "iss_6",
        authorId: "usr_3",
        body: "Confirmed — the cleanup function in useEffect was missing the unsubscribe call. Fix incoming.",
        createdAt: "2025-05-29T08:45:00Z",
    },
];

// ============================================================
// Activity Log — auto-generated narrative per issue
// ============================================================

export const MOCK_ACTIVITY: ActivityLogEntry[] = [
    {
        id: "act_1",
        issueId: "iss_7",
        actorId: "usr_1",
        action: "CREATED",
        fromValue: null,
        toValue: null,
        createdAt: "2025-05-01T09:00:00Z",
    },
    {
        id: "act_2",
        issueId: "iss_7",
        actorId: "usr_2",
        action: "STATUS_CHANGED",
        fromValue: "Todo",
        toValue: "In Progress",
        createdAt: "2025-05-08T13:20:00Z",
    },
    {
        id: "act_3",
        issueId: "iss_7",
        actorId: "usr_1",
        action: "PRIORITY_CHANGED",
        fromValue: "Medium",
        toValue: "High",
        createdAt: "2025-05-09T10:00:00Z",
    },
    {
        id: "act_4",
        issueId: "iss_8",
        actorId: "usr_2",
        action: "CREATED",
        fromValue: null,
        toValue: null,
        createdAt: "2025-05-10T10:00:00Z",
    },
    {
        id: "act_5",
        issueId: "iss_8",
        actorId: "usr_3",
        action: "ASSIGNEE_CHANGED",
        fromValue: "Unassigned",
        toValue: "Jordan Lee",
        createdAt: "2025-05-11T09:00:00Z",
    },
    {
        id: "act_6",
        issueId: "iss_6",
        actorId: "usr_3",
        action: "CREATED",
        fromValue: null,
        toValue: null,
        createdAt: "2025-05-01T08:00:00Z",
    },
    {
        id: "act_7",
        issueId: "iss_6",
        actorId: "usr_1",
        action: "PRIORITY_CHANGED",
        fromValue: "High",
        toValue: "Urgent",
        createdAt: "2025-05-27T08:00:00Z",
    },
];


// ============================================================
// Board Column Definitions
// ============================================================

export const INITIAL_COLUMNS: BoardColumnMap = {
    [IssueStatus.BACKLOG]: {
        id: IssueStatus.BACKLOG,
        title: "Backlog",
        color: "#64748b",
        issueIds: MOCK_ISSUES.filter((i) => i.status === IssueStatus.BACKLOG).map((i) => i.id),
    },
    [IssueStatus.TODO]: {
        id: IssueStatus.TODO,
        title: "Todo",
        color: "#94a3b8",
        issueIds: MOCK_ISSUES.filter((i) => i.status === IssueStatus.TODO).map((i) => i.id),
    },
    [IssueStatus.IN_PROGRESS]: {
        id: IssueStatus.IN_PROGRESS,
        title: "In Progress",
        color: "#6366f1",
        issueIds: MOCK_ISSUES.filter((i) => i.status === IssueStatus.IN_PROGRESS).map((i) => i.id),
    },
    [IssueStatus.DONE]: {
        id: IssueStatus.DONE,
        title: "Done",
        color: "#22c55e",
        issueIds: MOCK_ISSUES.filter((i) => i.status === IssueStatus.DONE).map((i) => i.id),
    },
};

// ============================================================
// Lookup Helpers (used by store selectors & hooks)
// ============================================================

export const getUserById = (id: string | null): User | undefined =>
    id ? MOCK_USERS.find((u) => u.id === id) : undefined;

export const getLabelById = (id: string): Label | undefined =>
    MOCK_LABELS.find((l) => l.id === id);

export const getProjectById = (id: string): Project | undefined =>
    MOCK_PROJECTS.find((p) => p.id === id);

/** Generate the next issue key for a given project */
export const generateIssueKey = (projectId: string, existingIssues: Issue[]): string => {
    const project = getProjectById(projectId);
    if (!project) return `ISS-${existingIssues.length + 1}`;
    const projectIssues = existingIssues.filter((i) => i.projectId === projectId);
    return `${project.prefix}-${projectIssues.length + 1}`;
};

/** Generate a naive unique ID for new entities */
export const generateId = (prefix: string): string =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

/** Build a fresh activity log entry for an issue field change */
export const buildActivityEntry = (
    issueId: string,
    actorId: string,
    action: import("@/types").ActivityAction,
    fromValue: string | null,
    toValue: string | null
): ActivityLogEntry => ({
    id: generateId("act"),
    issueId,
    actorId,
    action,
    fromValue,
    toValue,
    createdAt: new Date().toISOString(),
});