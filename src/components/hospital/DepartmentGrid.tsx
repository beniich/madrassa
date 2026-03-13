import { BedCard } from "./BedCard";

interface BedData {
    id: string;
    number: string;
    status: string;
    patient: {
        name: string;
        condition: string;
        admissionTime: string;
    } | null;
}

interface DepartmentGridProps {
    department: {
        id: string;
        name: string;
        floor: string;
        color: string;
    };
    beds: BedData[];
    onBedClick: (bedId: string) => void;
}

export const DepartmentGrid = ({ department, beds, onBedClick }: DepartmentGridProps) => {
    return (
        <div className="space-y-4">
            <div className={`flex items-center justify-between p-3 rounded-lg bg-${department.color}-500/10 border border-${department.color}-500/20`}>
                <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full bg-${department.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.2)]`} />
                    <h2 className="text-lg font-semibold tracking-tight">{department.name}</h2>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-background/50 text-muted-foreground">
                    {department.floor}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {beds.map((bed) => (
                    <BedCard
                        key={bed.id}
                        data={bed}
                        onClick={() => onBedClick(bed.id)}
                    />
                ))}
            </div>
        </div>
    );
};
