/**
 * Shared UI Components
 * Re-exports shadcn/ui components for consistent usage
 * This allows gradual migration while maintaining single import source
 */

// Re-export shadcn/ui components
export { Button } from '@/components/ui/button';
export type { ButtonProps } from '@/components/ui/button';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';

export { Input } from '@/components/ui/input';

export { Alert, AlertDescription } from '@/components/ui/alert';

export { Badge } from '@/components/ui/badge';

export { Progress } from '@/components/ui/progress';

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';

// Keep custom utilities
export { default as CodeBlock } from './CodeBlock';
export { DarkModeToggle } from './DarkModeToggle';
