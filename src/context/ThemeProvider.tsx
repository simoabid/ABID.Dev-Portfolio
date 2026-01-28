'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'portfolio-theme';

/**
 * Get the initial theme from localStorage or system preference.
 * Returns undefined during SSR to prevent hydration mismatch.
 */
function getInitialTheme(): Theme | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }

    // Check localStorage first
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
    }

    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }

    // Default to dark theme
    return 'dark';
}

/**
 * Apply theme class to document element.
 */
function applyTheme(theme: Theme) {
    const root = document.documentElement;

    if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
    } else {
        root.classList.add('dark');
        root.classList.remove('light');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute(
            'content',
            theme === 'light' ? '#f8f9fc' : '#1a1a2e'
        );
    }
}

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({
    children,
    defaultTheme = 'dark',
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    // Initialize theme on mount
    useEffect(() => {
        const initialTheme = getInitialTheme() ?? defaultTheme;
        setThemeState(initialTheme);
        applyTheme(initialTheme);
        setMounted(true);
    }, [defaultTheme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        const handleChange = (e: MediaQueryListEvent) => {
            // Only auto-switch if user hasn't set a preference
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (!storedTheme) {
                const newTheme = e.matches ? 'light' : 'dark';
                setThemeState(newTheme);
                applyTheme(newTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        applyTheme(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    // Prevent hydration mismatch by not rendering until mounted
    // The inline script in layout.tsx handles the initial theme
    const value = {
        theme: mounted ? theme : defaultTheme,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme context.
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
