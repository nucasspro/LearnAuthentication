---
description: Generate comprehensive test suite with unit, integration, and edge case coverage for any file or component
---

# Generate Tests Workflow

Generate comprehensive test suite for the specified file or component.

## Steps

### 1. Detect Testing Setup

First, identify the current testing framework and configuration:

```bash
# Check package.json for test framework
cat package.json | grep -E "(jest|vitest|mocha|jasmine)"

# Look for test config files
ls -la | grep -E "(jest|vitest|mocha|jasmine).config"

# Find existing test files to understand patterns
find . -name "*.test.*" -o -name "*.spec.*" | head -5
```

### 2. Analyze Target Code

Examine the target file to understand:
- Functions and methods to test
- Component structure (if React/Vue/Angular)
- Dependencies and external integrations
- Edge cases and error handling scenarios

### 3. Review Existing Test Patterns

Look at existing tests in the project to match:
- Naming conventions (`.test.ts` vs `.spec.ts`)
- File organization (co-located vs separate test directory)
- Testing utilities and helpers used
- Mock patterns and strategies

### 4. Create Test File

Create the test file following project conventions:
- Use same naming pattern as existing tests
- Place in appropriate directory
- Import necessary testing utilities

### 5. Implement Test Cases

Write comprehensive tests covering:

**Unit Tests**
- Individual function testing with various inputs
- Component rendering and prop handling
- State management and lifecycle methods
- Utility function edge cases and error conditions

**Integration Tests**
- Component interaction testing
- API integration with mocked responses
- Service layer integration
- End-to-end user workflows

**Framework-Specific Tests**
- **React**: Component testing with React Testing Library
- **Vue**: Component testing with Vue Test Utils
- **Angular**: Component and service testing with TestBed
- **Node.js**: API endpoint and middleware testing

### 6. Add Mocks and Test Utilities

Implement necessary mocks:
- Mock external dependencies and API calls
- Use factories for test data generation
- Implement proper cleanup for async operations
- Mock timers and dates for deterministic tests

### 7. Verify Coverage

// turbo
```bash
# Run tests to ensure they pass
npm test

# Check coverage if available
npm run test:coverage
```

## Testing Best Practices

### Test Structure
- Use descriptive test names that explain the behavior
- Follow AAA pattern (Arrange, Act, Assert)
- Group related tests with describe blocks
- Use proper setup and teardown for test isolation

### Mock Strategy
- Mock external dependencies and API calls
- Use factories for test data generation
- Implement proper cleanup for async operations
- Mock timers and dates for deterministic tests

### Coverage Goals
- Aim for 80%+ code coverage
- Focus on critical business logic paths
- Test both happy path and error scenarios
- Include boundary value testing

## Example Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Arrange common test data
  });

  // Cleanup
  afterEach(() => {
    // Clean up mocks and state
  });

  describe('feature or method name', () => {
    it('should do something when condition is met', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected');
    });

    it('should handle error case', () => {
      // Test error scenarios
    });
  });
});
```

## Notes

- Adapt to your project's testing framework (Jest, Vitest, Cypress, etc.)
- Follow established patterns in the codebase
- Focus on testing behavior, not implementation details
- Keep tests maintainable and readable
