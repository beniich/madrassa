export type WorkflowStep = {
    id: string;
    name: string;
};

export type Patient = {
    id: string;
    fullName: string;
    workflowStepId: string;
    critical?: boolean;
};
