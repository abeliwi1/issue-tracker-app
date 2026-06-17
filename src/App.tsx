import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useBoardStore } from "@/store/board-store";

// Placeholder views — replaced in Step 3
const BoardPlaceholder = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-2">
      <p className="text-[var(--text-muted)] text-sm">
        Kanban board renders here in Step 3
      </p>
      <p className="text-[var(--text-muted)] text-xs font-mono">
        &lt;KanbanBoard /&gt;
      </p>
    </div>
  </div>
);

const BacklogPlaceholder = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-[var(--text-muted)] text-sm">Backlog view — Step 3</p>
  </div>
);

const App: React.FC = () => {
  const activeView = useBoardStore((s) => s.activeView);

  return (
    <AppShell>
      {activeView === "board" && <BoardPlaceholder />}
      {activeView === "backlog" && <BacklogPlaceholder />}
      {activeView === "all-issues" && <BacklogPlaceholder />}
    </AppShell>
  );
};

export default App;