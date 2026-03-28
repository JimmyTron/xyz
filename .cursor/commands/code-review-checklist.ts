import * as vscode from 'vscode';

/**
 * Code Review Checklist Command
 * 
 * Generates a comprehensive code review checklist to ensure quality, security, and maintainability.
 */
export async function codeReviewChecklist() {
  const checklist = `# Code Review Checklist

## Overview
Comprehensive checklist for conducting thorough code reviews to ensure quality, security, and maintainability.

## Review Categories

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs or logic errors

### Code Quality
- [ ] Code is readable and well-structured
- [ ] Functions are small and focused
- [ ] Variable names are descriptive
- [ ] No code duplication
- [ ] Follows project conventions

### Security
- [ ] No obvious security vulnerabilities
- [ ] Input validation is present
- [ ] Sensitive data is handled properly
- [ ] No hardcoded secrets

### Performance
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] Unnecessary computations are avoided
- [ ] Memory leaks are prevented

### Testing
- [ ] Unit tests are present and passing
- [ ] Edge cases are covered by tests
- [ ] Test coverage is adequate
- [ ] Integration tests are considered

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] API documentation is updated
- [ ] README is updated if needed

### Dependencies
- [ ] Dependencies are necessary
- [ ] No security vulnerabilities in dependencies
- [ ] Versions are pinned appropriately
- [ ] No unused dependencies

### Git & Version Control
- [ ] Commit messages are clear
- [ ] No large files committed
- [ ] No sensitive data in commits
- [ ] Branch naming follows conventions

### Accessibility (if applicable)
- [ ] ARIA labels are present
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Screen reader compatibility

### UI/UX (if applicable)
- [ ] User experience is intuitive
- [ ] Responsive design works
- [ ] Loading states are handled
- [ ] Error messages are user-friendly`;

  // Create a new document with the checklist
  const doc = await vscode.workspace.openTextDocument({
    content: checklist,
    language: 'markdown'
  });

  await vscode.window.showTextDocument(doc);
  
  vscode.window.showInformationMessage('Code Review Checklist generated!');
}

