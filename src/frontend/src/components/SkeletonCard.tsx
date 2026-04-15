import { cn } from "@/lib/utils";

interface SkeletonCardProps {
    className?: string;
    count?: number;
}

export function SkeletonCard({ className, count = 1 }: SkeletonCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "relative overflow-hidden rounded-lg bg-muted/60 border border-border/50",
                        className
                    )}
                >
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>
            ))}
        </>
    );
}
