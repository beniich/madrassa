export type MedEventType =
    | "VitalsRecorded"
    | "WorkflowStepChanged"
    | "NoteAdded";

export type MedEvent = {
    id: string;
    type: MedEventType;
    workspaceId: string;
    patientId?: string;
    payload: Record<string, any>;
    createdAt: string;
};
