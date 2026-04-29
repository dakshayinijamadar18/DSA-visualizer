'use client'

import { useState } from 'react'
import { Clock, Database, Code, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AlgorithmInfo } from '@/data/algorithmInfo'

type InfoPanelsProps = {
  algorithmInfo: AlgorithmInfo
  currentDescription: string
  highlightedLine?: number
}

type CodeLanguage = 'cpp' | 'java'

export function InfoPanels({
  algorithmInfo,
  currentDescription,
  highlightedLine,
}: InfoPanelsProps) {
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('cpp')

  const code = codeLanguage === 'cpp' ? algorithmInfo.cppCode : algorithmInfo.javaCode
  const codeLines = code.split('\n')

  return (
    <div className="flex flex-col gap-4">
      {/* Complexity Panel */}
      <div className="glass-card rounded-2xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Complexity</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-lg bg-secondary/50 p-2 text-center">
              <div className="text-muted-foreground">Best</div>
              <div className="font-mono text-sorted">{algorithmInfo.timeComplexity.best}</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-2 text-center">
              <div className="text-muted-foreground">Average</div>
              <div className="font-mono text-swapping">{algorithmInfo.timeComplexity.average}</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-2 text-center">
              <div className="text-muted-foreground">Worst</div>
              <div className="font-mono text-comparing">{algorithmInfo.timeComplexity.worst}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Space:</span>
            <span className="font-mono text-sm text-accent">{algorithmInfo.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* Code Panel */}
      <div className="glass-card rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Code</h3>
          </div>
          <div className="flex rounded-lg bg-secondary/50 p-0.5">
            <button
              onClick={() => setCodeLanguage('cpp')}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-all',
                codeLanguage === 'cpp'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              C++
            </button>
            <button
              onClick={() => setCodeLanguage('java')}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-all',
                codeLanguage === 'java'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Java
            </button>
          </div>
        </div>
        <div className="code-block max-h-64 overflow-auto rounded-lg p-3">
          <pre className="text-xs leading-relaxed">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  'px-2 -mx-2 transition-colors duration-200',
                  highlightedLine === index + 1 && 'code-line-highlight'
                )}
              >
                <span className="mr-4 inline-block w-6 text-right text-muted-foreground/50">
                  {index + 1}
                </span>
                <code className="text-foreground/90">{line}</code>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="glass-card rounded-2xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Current Step</h3>
        </div>
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-sm text-foreground leading-relaxed">
            {currentDescription || algorithmInfo.description}
          </p>
        </div>
        <div className="mt-3">
          <h4 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Algorithm Steps</h4>
          <ol className="space-y-1">
            {algorithmInfo.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
