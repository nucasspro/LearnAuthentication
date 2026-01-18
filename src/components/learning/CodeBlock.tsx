'use client';

import { Button } from '@/components/ui/button';
import { CodeExample } from '@/lib/types';
import { Check, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import csharp from 'react-syntax-highlighter/dist/cjs/languages/hljs/csharp';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/cjs/languages/hljs/python';
import ruby from 'react-syntax-highlighter/dist/cjs/languages/hljs/ruby';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('ruby', ruby);

// Custom cyberpunk theme for code content (Preserved for readability as requested)
const cyberpunkTheme: { [key: string]: React.CSSProperties } = {
  'hljs': {
    display: 'block',
    overflowX: 'auto' as React.CSSProperties['overflowX'],
    padding: '1rem',
    background: '#0a0a0a',
    color: '#e4e4e7', // zinc-200
  },
  'hljs-keyword': { color: '#f472b6', fontWeight: 'bold' }, // pink-400
  'hljs-string': { color: '#a7f3d0' }, // emerald-200
  'hljs-function': { color: '#60a5fa' }, // blue-400
  'hljs-number': { color: '#fcd34d' }, // amber-300
  'hljs-comment': { color: '#71717a', fontStyle: 'italic' }, // zinc-500
  'hljs-class': { color: '#c084fc' }, // purple-400
  'hljs-title': { color: '#60a5fa', fontWeight: 'bold' },
  'hljs-params': { color: '#e4e4e7' },
  'hljs-built_in': { color: '#c084fc' },
  'hljs-literal': { color: '#fcd34d' },
  'hljs-attr': { color: '#60a5fa' },
  'hljs-variable': { color: '#e4e4e7' },
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
        background: '#18181b',
        color: '#fff',
        border: '1px solid #27272a',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#18181b',
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-none border border-white/10 bg-zinc-950 overflow-hidden shadow-none hover:border-white/20 transition-all group">
      {/* Terminal Header - Clickable to Expand/Collapse */}
      <div className="bg-zinc-900 border-b border-white/10 px-4 py-2 flex items-center justify-between hover:bg-zinc-800/80 transition-colors">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          )}
          <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
          </div>
          {title && (
            <span className="text-xs font-mono text-zinc-400 ml-3">{title}</span>
          )}
        </button>
        {isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-zinc-400 hover:text-white hover:bg-white/10 flex-shrink-0 rounded-none uppercase text-xs"
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
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Language Tabs */}
          {examples.length > 1 && (
            <div className="bg-zinc-900/50 border-b border-white/5 flex gap-1 px-2 py-2">
              {examples.map((example, index) => (
                <button
                  key={example.language}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-1.5 text-xs font-mono rounded-none transition-all uppercase ${activeTab === index
                    ? 'bg-zinc-800 text-white border border-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    }`}
                >
                  {example.label}
                </button>
              ))}
            </div>
          )}

          {/* Code Display */}
          <div className="relative select-text">
            <SyntaxHighlighter
              language={examples[activeTab].language}
              style={cyberpunkTheme}
              showLineNumbers={showLineNumbers}
              lineNumberStyle={{ color: '#52525b', paddingRight: '1rem', userSelect: 'none' }}
              customStyle={{
                margin: 0,
                fontSize: '0.875rem',
                background: '#0a0a0a',
                userSelect: 'text' as any,
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
