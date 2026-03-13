export type AutomationCondition = {
    field: string;
    operator: "equals" | "greaterThan" | "lessThan" | "contains";
    value: any;
};

export type AutomationAction =
    | { type: "NOTIFY_TEAM"; teamId: string }
    | { type: "CREATE_TASK"; title: string };

export type AutomationRule = {
    id: string;
    eventType: string;
    conditions: AutomationCondition[];
    actions: AutomationAction[];
};
