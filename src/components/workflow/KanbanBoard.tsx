import React from 'react';

interface KanbanBoardProps {
  workflowId: string;
}

export function KanbanBoard({ workflowId }: KanbanBoardProps) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-lg font-medium text-foreground">Kanban Board (WIP)</h3>
        <p className="text-sm text-muted-foreground w-[80%]">
          The Kanban board for workflow {workflowId} is currently under development.
        </p>
      </div>
    </div>
  );
}
