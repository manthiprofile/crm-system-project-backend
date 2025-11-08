import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Architecture tests to ensure clean architecture dependency rules are not violated.
 * Rules:
 * 1. Domain layer should not depend on infrastructure or presentation
 * 2. Use cases should not depend on infrastructure or presentation
 * 3. Infrastructure should not depend on presentation
 * 4. Presentation can depend on use cases and infrastructure
 */

describe('Architecture Dependency Rules', () => {
  const srcPath = join(process.cwd(), 'src');
  const domainPath = join(srcPath, 'domain');
  const usecasesPath = join(srcPath, 'usecases');
  const infrastructurePath = join(srcPath, 'infrastructure');
  const presentationPath = join(srcPath, 'presentation');

  /**
   * Recursively gets all TypeScript files in a directory.
   */
  function getTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.includes('__tests__')) {
        files.push(...getTypeScriptFiles(fullPath));
      } else if (entry.isFile() && extname(entry.name) === '.ts') {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Extracts import statements from a file.
   */
  function getImports(filePath: string): string[] {
    const content = readFileSync(filePath, 'utf-8');
    const importRegex =
      /import\s+(?:.*\s+from\s+)?['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1] || match[2];
      if (importPath) {
        imports.push(importPath);
      }
    }

    return imports;
  }

  /**
   * Checks if an import violates dependency rules.
   */
  function violatesRule(
    _filePath: string,
    importPath: string,
    forbiddenLayers: string[],
  ): boolean {
    for (const layer of forbiddenLayers) {
      if (
        importPath.includes(`/${layer}/`) ||
        importPath.includes(`\\${layer}\\`) ||
        importPath.startsWith(`@${layer}`)
      ) {
        return true;
      }
    }
    return false;
  }

  describe('Domain Layer', () => {
    it('should not import from infrastructure layer', () => {
      const domainFiles = getTypeScriptFiles(domainPath);
      const violations: string[] = [];

      for (const file of domainFiles) {
        const imports = getImports(file);
        for (const importPath of imports) {
          if (
            violatesRule(file, importPath, ['infrastructure', 'presentation'])
          ) {
            violations.push(`${file}: imports ${importPath}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('should not import from presentation layer', () => {
      const domainFiles = getTypeScriptFiles(domainPath);
      const violations: string[] = [];

      for (const file of domainFiles) {
        const imports = getImports(file);
        for (const importPath of imports) {
          if (violatesRule(file, importPath, ['presentation'])) {
            violations.push(`${file}: imports ${importPath}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe('Use Cases Layer', () => {
    it('should not import from presentation layer', () => {
      const usecasesFiles = getTypeScriptFiles(usecasesPath);
      const violations: string[] = [];

      for (const file of usecasesFiles) {
        const imports = getImports(file);
        for (const importPath of imports) {
          if (violatesRule(file, importPath, ['presentation'])) {
            violations.push(`${file}: imports ${importPath}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe('Infrastructure Layer', () => {
    it('should not import from presentation layer', () => {
      const infrastructureFiles = getTypeScriptFiles(infrastructurePath);
      const violations: string[] = [];

      for (const file of infrastructureFiles) {
        const imports = getImports(file);
        for (const importPath of imports) {
          if (violatesRule(file, importPath, ['presentation'])) {
            violations.push(`${file}: imports ${importPath}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe('Layer Isolation', () => {
    it('should have proper layer separation', () => {
      // Check that domain, usecases, infrastructure, and presentation directories exist
      expect(statSync(domainPath).isDirectory()).toBe(true);
      expect(statSync(usecasesPath).isDirectory()).toBe(true);
      expect(statSync(infrastructurePath).isDirectory()).toBe(true);
      expect(statSync(presentationPath).isDirectory()).toBe(true);
    });
  });
});

