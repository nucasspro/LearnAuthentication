# Antigravity Configuration for LearnAuthentication

This directory contains Antigravity-specific configuration including skills and workflows.

## Directory Structure

```
.agent/
├── skills/           # Specialized AI skills for different tasks
│   ├── auth-learning-guide/
│   ├── ui-ux-consistency/
│   ├── frontend-developer/
│   └── nextjs-code-reviewer/
├── workflows/        # Automated workflow commands
│   └── generate-tests.md
└── README.md        # This file
```

## Skills

### 🔐 Authentication Learning Guide
**Location**: `.agent/skills/auth-learning-guide/`

Expert authentication and authorization educator that teaches security concepts through story-driven, step-by-step explanations.

**Use when:**
- Learning about authentication/authorization concepts
- Understanding JWT, OAuth, session-based auth
- Implementing auth in ASP.NET or React
- Need security best practices explained

**Example usage:**
```
Can you explain how JWT tokens work?
I need to add authentication to my React app with ASP.NET backend
What's the difference between authentication and authorization?
```

### 🎨 UI/UX Consistency Analyzer
**Location**: `.agent/skills/ui-ux-consistency/`

Expert UI/UX analyst specializing in educational interfaces, accessibility, and design consistency.

**Use when:**
- Analyzing UI/UX for readability issues
- Checking WCAG accessibility compliance
- Ensuring design consistency across pages
- Optimizing learning experience

**Example usage:**
```
Review my tutorial pages for readability issues
Analyze the contrast ratios in my code blocks
Check consistency across my documentation pages
```

### ⚛️ Frontend Developer
**Location**: `.agent/skills/frontend-developer/`

Frontend development specialist for React applications, responsive design, and performance optimization.

**Use when:**
- Building React components
- Implementing responsive designs
- Optimizing frontend performance
- Adding accessibility features
- Managing state with Redux/Zustand/Context

**Example usage:**
```
Create a responsive navigation component
Optimize this component for performance
Add accessibility to this form
```

### 🔍 Next.js Code Reviewer
**Location**: `.agent/skills/nextjs-code-reviewer/`

Elite code reviewer for Next.js/React TypeScript projects focusing on quality, optimization, and best practices.

**Use when:**
- Code has been written or modified
- Need comprehensive code review
- Looking for optimization opportunities
- Checking for code duplication
- Ensuring TypeScript best practices

**Example usage:**
```
Review this new ProductCard component
Analyze the refactored authentication code
Check for code duplication in my services
```

## Workflows

### 🧪 Generate Tests
**Location**: `.agent/workflows/generate-tests.md`

Generates comprehensive test suites with unit, integration, and edge case coverage.

**Usage:**
```
/generate-tests src/components/LoginForm.tsx
/generate-tests UserService
```

**What it does:**
- Detects your testing framework (Jest, Vitest, etc.)
- Analyzes target code structure
- Creates test files following project conventions
- Implements unit, integration, and edge case tests
- Adds necessary mocks and utilities
- Verifies test coverage

## How to Use Skills

Skills are automatically available to Antigravity. To use a skill:

1. **View the skill instructions:**
   ```
   Can you read the auth-learning-guide skill?
   ```

2. **Antigravity will automatically use relevant skills** based on your request

3. **Explicitly request a skill:**
   ```
   Use the UI/UX Consistency Analyzer skill to review my pages
   ```

## How to Use Workflows

Workflows can be invoked using slash commands or by referencing them:

```
/generate-tests src/components/Button.tsx
Can you run the generate-tests workflow on my LoginForm component?
```

## Migrated from Claude

This configuration was migrated from `.claude/` directory:
- `.claude/agents/` → `.agent/skills/`
- `.claude/commands/` → `.agent/workflows/`

The functionality remains the same, adapted for Antigravity's skill and workflow system.
