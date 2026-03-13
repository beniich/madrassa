import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted/40", className)} {...props} />;
}

const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border-none shadow-lg space-y-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        ))}
    </div>
);

const ChartSkeleton = () => (
    <div className="p-10 rounded-[3rem] bg-white shadow-xl space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <Skeleton className="h-[250px] w-full rounded-2xl" />
    </div>
);

const ListSkeleton = ({ count = 3 }) => (
    <div className="space-y-6">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
        ))}
    </div>
);

export { Skeleton, StatsSkeleton, ChartSkeleton, ListSkeleton };
