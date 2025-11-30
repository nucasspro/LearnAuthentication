'use client';

import { Check, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';
import csharp from 'react-syntax-highlighter/dist/cjs/languages/hljs/csharp';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/cjs/languages/hljs/python';
import ruby from 'react-syntax-highlighter/dist/cjs/languages/hljs/ruby';
import { CodeExample } from '@/lib/types';
import { Button } from '@/components/ui/button';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('ruby', ruby);

// Custom cyberpunk theme
const cyberpunkTheme: { [key: string]: React.CSSProperties } = {
  'hljs': {
    display: 'block',
    overflowX: 'auto' as React.CSSProperties['overflowX'],
    padding: '1rem',
    background: '#0a0a0a',
    color: '#4aff00',
  },
  'hljs-keyword': { color: '#ff2d6d', fontWeight: 'bold' },
  'hljs-string': { color: '#6dff2d' },
  'hljs-function': { color: '#22d3ee' },
  'hljs-number': { color: '#fbbf24' },
  'hljs-comment': { color: '#6b7280', fontStyle: 'italic' },
  'hljs-class': { color: '#a855f7' },
  'hljs-title': { color: '#22d3ee', fontWeight: 'bold' },
  'hljs-params': { color: '#4aff00' },
  'hljs-built_in': { color: '#c084fc' },
  'hljs-literal': { color: '#fbbf24' },
  'hljs-attr': { color: '#22d3ee' },
  'hljs-variable': { color: '#4aff00' },
};

interface CodeBlockProps {
  examples: CodeExample[];
  title?: string;
  showLineNumbers?: boolean;
  collapsed?: boolean;
}

export function CodeBlock({ examples, title, showLineNumbers = true, collapsed = true }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  const handleCopy = () => {
    navigator.clipboard.writeText(examples[activeTab].code);
    setCopied(true);
    toast.success('Code copied to clipboard!', {
      style: {
        background: '#0a0a0a',
        color: '#4aff00',
        border: '2px solid #4aff00',
      },
      iconTheme: {
        primary: '#4aff00',
        secondary: '#0a0a0a',
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg border-2 border-neon-500/30 bg-gray-950 overflow-hidden shadow-[0_0_30px_rgba(74,255,0,0.2)]">
      {/* Terminal Header - Clickable to Expand/Collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-900 border-b-2 border-neon-500/30 px-4 py-2 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-neon-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-neon-400 flex-shrink-0" />
          )}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {title && (
            <span className="text-xs font-mono text-neon-200 ml-3">{title}</span>
          )}
        </div>
        {isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="h-7 px-2 text-neon-400 hover:text-neon-300 hover:bg-neon-500/10 flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Language Tabs */}
          {examples.length > 1 && (
            <div className="bg-gray-900/50 border-b border-neon-500/20 flex gap-1 px-2 py-2">
              {examples.map((example, index) => (
                <button
                  key={example.language}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-1.5 text-xs font-mono rounded transition-all ${
                    activeTab === index
                      ? 'bg-neon-500/20 text-neon-300 border border-neon-500/50'
                      : 'text-gray-400 hover:text-neon-400 hover:bg-gray-800'
                  }`}
                >
                  {example.label}
                </button>
              ))}
            </div>
          )}

          {/* Code Display */}
          <div className="relative">
            <SyntaxHighlighter
              language={examples[activeTab].language}
              style={cyberpunkTheme}
              showLineNumbers={showLineNumbers}
              lineNumberStyle={{ color: '#4b5563', paddingRight: '1rem', userSelect: 'none' }}
              customStyle={{
                margin: 0,
                fontSize: '0.875rem',
                background: '#0a0a0a',
              }}
            >
              {examples[activeTab].code}
            </SyntaxHighlighter>
          </div>
        </>
      )}
    </div>
  );
}
