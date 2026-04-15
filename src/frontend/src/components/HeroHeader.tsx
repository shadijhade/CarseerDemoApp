import { useTheme } from "@/components/theme-provider";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroHeaderProps {
    totalMakes: number;
}

export function HeroHeader({ totalMakes }: HeroHeaderProps) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="flex items-center justify-between pt-6 pb-8 md:pt-8 md:pb-10">
            {/* Left — brand */}
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                    Carseer
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    NHTSA Vehicle Database Explorer
                </p>
            </div>

            {/* Right — meta */}
            <div className="flex items-center gap-3">
                {totalMakes > 0 && (
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <AnimatedCounter
                            target={totalMakes}
                            className="font-semibold text-foreground"
                        />
                        <span>makes</span>
                    </div>
                )}

                <div className="w-px h-5 bg-border hidden sm:block" />

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-secondary border border-transparent hover:border-border transition-colors cursor-pointer"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
            </div>
        </header>
    );
}
