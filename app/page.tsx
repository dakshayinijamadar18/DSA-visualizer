'use client'

import { useState } from 'react'
import { Navbar, Tab } from '@/components/Navbar'
import { SortingVisualizer } from '@/components/sorting/SortingVisualizer'
import { GraphVisualizer } from '@/components/graph/GraphVisualizer'
import { CompareVisualizer } from '@/components/compare/CompareVisualizer'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('sorting')

  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'sorting' && <SortingVisualizer />}
        {activeTab === 'graph' && <GraphVisualizer />}
        {activeTab === 'compare' && <CompareVisualizer />}
      </main>

      {/* Footer */}
      <footer className="glass-card mt-auto border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              DSA Visualizer - Learn algorithms interactively
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <span className="text-sm text-muted-foreground">
                Built with Next.js
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
