import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CreateIssueModal } from "@/components/ui/CreateIssueModal";
import { useBoardStore } from "@/store/board-store"; 
import { IssueDetailModal } from "../ui/IssueDetailModal";

interface AppShellProps {
    children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const activeView = useBoardStore((s) => s.activeView);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-app)]">
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar />

                {/* Main content area */}
                <main
                    className={`
            flex-1 overflow-auto
            ${activeView === "board" ? "overflow-x-auto" : ""}
          `}
                >
                    {children}
                </main>
            </div>

            {/* Global modals/dialogs — rendered outside column flow */}
            <CreateIssueModal />
            <IssueDetailModal/>
        </div>
    );
};