import React, { useState } from "react";
import {
    LayoutGrid,
    List,
    AlignLeft,
    ChevronDown,
    ChevronRight,
    Settings,
    HelpCircle,
} from "lucide-react";
import { useBoardStore } from "@/store/board-store";
import { MOCK_USERS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import { ProjectStatus } from "@/types";
import { ModeThemeToggle } from "../ui/ModeThemeToggle";

const VIEW_NAV = [
    { id: "board" as const, label: "Board", icon: LayoutGrid },
    { id: "backlog" as const, label: "Backlog", icon: AlignLeft },
    { id: "all-issues" as const, label: "All Issues", icon: List },
];

const PROJECT_STATUS_DOT: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: "bg-emerald-500",
    [ProjectStatus.PAUSED]: "bg-yellow-500",
    [ProjectStatus.COMPLETED]: "bg-slate-500",
};

export const Sidebar: React.FC = () => {
    const projects = useBoardStore((s) => s.projects);
    const activeProjectId = useBoardStore((s) => s.activeProjectId);
    const activeView = useBoardStore((s) => s.activeView);
    const setActiveProject = useBoardStore((s) => s.setActiveProject);
    const setActiveView = useBoardStore((s) => s.setActiveView);

    const [projectsOpen, setProjectsOpen] = useState(true);

    const currentUser = MOCK_USERS[0];
    const projectList = Object.values(projects);
    //const activeProject = projects[activeProjectId];

    return (
        <aside
            className="
        w-56 flex-shrink-0 h-screen flex flex-col
        bg-[var(--bg-surface)] border-r border-[var(--border)]
        select-none
      "
        >
            {/* Workspace header */}
            <div className="px-3 py-3 border-b border-[var(--border)]">
                <button
                    className="
            w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md
            hover:bg-[var(--bg-hover)] transition-colors group
          "
                >
                    <div
                        className="
              w-6 h-6 rounded-md bg-gradient-to-br from-blue-800 to-teal-400
              flex items-center justify-center flex-shrink-0
            "
                    >
                        <span className="text-[10px] font-bold text-white">Ft</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        FluxTrak
                    </span>
                    <ChevronDown
                        className="
              w-3.5 h-3.5 text-[var(--text-muted)] ml-auto
              group-hover:text-[var(--text-secondary)] transition-colors
            "
                    />
                </button>
            </div>

            {/* Scrollable nav area */}
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5">

                {/* Views */}
                <div>
                    <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                        Views
                    </p>
                    <ul className="space-y-0.5">
                        {VIEW_NAV.map(({ id, label, icon: Icon }) => (
                            <li key={id}>
                                <button
                                    onClick={() => setActiveView(id)}
                                    className={`
                    w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm
                    transition-colors
                    ${activeView === id
                                            ? "bg-[var(--accent-subtle)] text-[var(--text-primary)]"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                                        }
                  `}
                                >
                                    <Icon
                                        className={`w-4 h-4 flex-shrink-0 ${activeView === id ? "text-indigo-400" : "text-[var(--text-muted)]"
                                            }`}
                                        strokeWidth={1.75}
                                    />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Projects */}
                <div>
                    <button
                        onClick={() => setProjectsOpen((o) => !o)}
                        className="
              w-full flex items-center gap-1.5 px-2 mb-1
              text-[10px] font-semibold uppercase tracking-widest
              text-[var(--text-muted)] hover:text-[var(--text-secondary)]
              transition-colors
            "
                    >
                        {projectsOpen
                            ? <ChevronDown className="w-3 h-3" />
                            : <ChevronRight className="w-3 h-3" />
                        }
                        Projects
                    </button>

                    {projectsOpen && (
                        <ul className="space-y-0.5">
                            {projectList.map((project) => (
                                <li key={project.id}>
                                    <button
                                        onClick={() => setActiveProject(project.id)}
                                        className={`
                      w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm
                      transition-colors group
                      ${activeProjectId === project.id
                                                ? "bg-[var(--accent-subtle)] text-[var(--text-primary)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                                            }
                    `}
                                    >
                                        <span
                                            className={`
                        w-1.5 h-1.5 rounded-full flex-shrink-0
                        ${PROJECT_STATUS_DOT[project.status]}
                      `}
                                        />
                                        <span className="truncate">{project.name}</span>
                                        <span className="ml-auto text-[10px] text-[var(--text-muted)] font-mono">
                                            {project.prefix}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </nav>

            {/* Bottom: user + settings */}
            <div className="px-2 py-3 border-t border-[var(--border)] space-y-2">
                <button
                    className="
            w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm
            text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]
            hover:text-[var(--text-primary)] transition-colors
          "
                >
                    <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.75} />
                    Help
                </button>
                <div className="flex items-center gap-0.5">
                    <button
                        className="
              flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm
              text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]
              hover:text-[var(--text-primary)] transition-colors
            "
                    >
                        <Settings className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.75} />
                        Settings
                    </button>
                </div>

                {/* Current user */}
                <div className="flex items-center gap-2.5 px-2 py-1.5 mt-1">
                    <Avatar user={currentUser} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                            {currentUser.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">
                            {currentUser.role.toLowerCase()}
                        </p>
                    </div>
                    <ModeThemeToggle />
                </div>
            </div>
        </aside>
    );
};