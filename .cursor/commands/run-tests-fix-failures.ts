import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Run All Tests and Fix Failures Command
 * 
 * Execute the full test suite and systematically fix any failures,
 * ensuring code quality and functionality.
 */
export async function runTestsAndFixFailures() {
  const outputChannel = vscode.window.createOutputChannel('Test Runner');
  outputChannel.show();

  try {
    // Step 1: Run test suite
    outputChannel.appendLine('=== Step 1: Running Test Suite ===');
    outputChannel.appendLine('Executing all tests in the project...\n');

    let testCommand = 'npm test';
    
    // Detect package manager
    const packageManager = await detectPackageManager();
    if (packageManager === 'pnpm') {
      testCommand = 'pnpm test';
    } else if (packageManager === 'yarn') {
      testCommand = 'yarn test';
    }

    outputChannel.appendLine(`Using command: ${testCommand}\n`);

    try {
      const { stdout, stderr } = await execAsync(testCommand, {
        cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      outputChannel.appendLine(stdout);
      if (stderr) {
        outputChannel.appendLine('STDERR:');
        outputChannel.appendLine(stderr);
      }

      // Check if tests passed
      if (stdout.includes('Tests:') && !stdout.match(/Tests:\s*\d+\s+failed/i)) {
        vscode.window.showInformationMessage('✅ All tests passed!');
        outputChannel.appendLine('\n=== All tests passed successfully! ===');
        return;
      }

    } catch (error: any) {
      outputChannel.appendLine(`\n❌ Test execution failed or tests failed:\n${error.message}`);
      if (error.stdout) outputChannel.appendLine(error.stdout);
      if (error.stderr) outputChannel.appendLine(error.stderr);
    }

    // Step 2: Analyze failures
    outputChannel.appendLine('\n=== Step 2: Analyzing Failures ===');
    outputChannel.appendLine('Please review the test output above.');
    outputChannel.appendLine('\nFailure Categories:');
    outputChannel.appendLine('- Flaky tests (intermittent failures)');
    outputChannel.appendLine('- Broken tests (consistent failures)');
    outputChannel.appendLine('- New failures (related to recent changes)');
    outputChannel.appendLine('\nPrioritize fixes based on:');
    outputChannel.appendLine('- Impact on functionality');
    outputChannel.appendLine('- Number of affected tests');
    outputChannel.appendLine('- Relation to recent code changes');

    // Step 3: Provide guidance for fixing
    outputChannel.appendLine('\n=== Step 3: Fix Issues Systematically ===');
    outputChannel.appendLine('Guidelines:');
    outputChannel.appendLine('1. Start with the most critical failures');
    outputChannel.appendLine('2. Fix one issue at a time');
    outputChannel.appendLine('3. Re-run tests after each fix');
    outputChannel.appendLine('4. Verify no regressions are introduced');

    // Show actionable items
    const action = await vscode.window.showWarningMessage(
      'Tests failed. How would you like to proceed?',
      'View Test Output',
      'Run Tests Again',
      'Open Test Files'
    );

    if (action === 'View Test Output') {
      outputChannel.show();
    } else if (action === 'Run Tests Again') {
      runTestsAndFixFailures();
    } else if (action === 'Open Test Files') {
      const testFiles = await findTestFiles();
      if (testFiles.length > 0) {
        const selected = await vscode.window.showQuickPick(
          testFiles.map(f => ({ label: f.name, description: f.path })),
          { placeHolder: 'Select a test file to open' }
        );
        if (selected) {
          const file = testFiles.find(f => f.name === selected.label);
          if (file) {
            const doc = await vscode.workspace.openTextDocument(file.uri);
            await vscode.window.showTextDocument(doc);
          }
        }
      }
    }

  } catch (error: any) {
    vscode.window.showErrorMessage(`Error running tests: ${error.message}`);
    outputChannel.appendLine(`\n❌ Error: ${error.message}`);
  }
}

/**
 * Detect which package manager is being used
 */
async function detectPackageManager(): Promise<'npm' | 'pnpm' | 'yarn'> {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspacePath) return 'npm';

  try {
    // Check for pnpm-lock.yaml
    const { access } = await import('fs/promises');
    try {
      await access(`${workspacePath}/pnpm-lock.yaml`);
      return 'pnpm';
    } catch {
      // Check for yarn.lock
      try {
        await access(`${workspacePath}/yarn.lock`);
        return 'yarn';
      } catch {
        return 'npm';
      }
    }
  } catch {
    return 'npm';
  }
}

/**
 * Find test files in the workspace
 */
async function findTestFiles(): Promise<Array<{ name: string; path: string; uri: vscode.Uri }>> {
  const testFiles: Array<{ name: string; path: string; uri: vscode.Uri }> = [];
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri;

  if (!workspacePath) return testFiles;

  // Common test file patterns
  const testPatterns = [
    '**/*.test.{ts,tsx,js,jsx}',
    '**/*.spec.{ts,tsx,js,jsx}',
    '**/__tests__/**/*.{ts,tsx,js,jsx}',
    '**/tests/**/*.{ts,tsx,js,jsx}'
  ];

  for (const pattern of testPatterns) {
    const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 50);
    for (const file of files) {
      const relativePath = vscode.workspace.asRelativePath(file);
      testFiles.push({
        name: file.path.split('/').pop() || relativePath,
        path: relativePath,
        uri: file
      });
    }
  }

  return testFiles;
}

