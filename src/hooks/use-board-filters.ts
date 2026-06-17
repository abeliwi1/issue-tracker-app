import { useMemo } from "react";
import { useBoardStore } from "../store/board-store";
import { Issue, IssueStatus, BoardColumnMap } from "../types";

/**
 * Returns the board columns with issue IDs filtered by the active
 * search query, assignee filter, and priority filter.
 *
 * Uses useMemo so consumers only re-render when filter state or
 * relevant issue data changes — not on every unrelated store mutation.
 */
export function useFilteredColumns(): BoardColumnMap {
    const issues = useBoardStore((s) => s.issues);
    const columns = useBoardStore((s) => s.columns);
    const filters = useBoardStore((s) => s.filters);
    const activeProjectId = useBoardStore((s) => s.activeProjectId);

    return useMemo(() => {
        const { search, assigneeIds, priorities, labelIds } = filters;

        const searchLower = search.toLowerCase().trim();

        const matchesFilters = (issue: Issue): boolean => {
            // Project scope
            if (issue.projectId !== activeProjectId) return false;

            // Text search against title (case-insensitive, substring)
            if (searchLower && !issue.title.toLowerCase().includes(searchLower)) return false;

            // Assignee filter (OR semantics — show if any selected assignee matches)
            if (assigneeIds.length > 0) {
                if (!issue.assigneeId || !assigneeIds.includes(issue.assigneeId)) return false;
            }

            // Priority filter (OR semantics)
            if (priorities.length > 0 && !priorities.includes(issue.priority)) return false;

            // Label filter (AND semantics — issue must have ALL selected labels)
            if (labelIds.length > 0) {
                const hasAllLabels = labelIds.every((lid) => issue.labelIds.includes(lid));
                if (!hasAllLabels) return false;
            }

            return true;
        };

        const statuses = Object.values(IssueStatus) as IssueStatus[];

        return statuses.reduce((acc, status) => {
            const column = columns[status];
            const filteredIds = column.issueIds.filter((id) => {
                const issue = issues[id];
                return issue ? matchesFilters(issue) : false;
            });

            return {
                ...acc,
                [status]: { ...column, issueIds: filteredIds },
            };
        }, {} as BoardColumnMap);
    }, [issues, columns, filters, activeProjectId]);
}

/**
 * Returns a flat, sorted array of all issues for the active project,
 * respecting active filters. Useful for Backlog and All Issues views.
 */
export function useFilteredIssueList(): Issue[] {
    const filteredColumns = useFilteredColumns();
    const issues = useBoardStore((s) => s.issues);

    return useMemo(() => {
        return Object.values(filteredColumns)
            .flatMap((col) => col.issueIds)
            .map((id) => issues[id])
            .filter((issue): issue is Issue => Boolean(issue))
            .sort((a, b) => {
                // Sort by status order, then sortOrder within status
                const statusOrder = Object.values(IssueStatus);
                const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                if (statusDiff !== 0) return statusDiff;
                return a.sortOrder - b.sortOrder;
            });
    }, [filteredColumns, issues]);
}