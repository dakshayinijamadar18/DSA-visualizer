'use client'

import { cn } from '@/lib/utils'

export type Tab = 'sorting' | 'graph' | 'compare'

type NavbarProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'sorting', label: 'Sorting' },
    { id: 'graph', label: 'Graph' },
    { id: 'compare', label: 'Compare' },
  ]

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <svg
                className="h-6 w-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">DSA Visualizer</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Interactive Algorithm Learning</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-full bg-secondary/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                  activeTab === tab.id
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {activeTab === tab.id && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent" />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
