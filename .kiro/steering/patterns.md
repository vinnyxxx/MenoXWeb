---
inclusion: always
---

# Proven Patterns

## 1) Test-First for CSS/UI Changes (MANDATORY)

When there are multiple possible CSS/UI approaches:
1. Create a standalone test HTML file (e.g., `test-<feature>.html`) with all candidate approaches side by side
2. Show the test page to the user for visual verification
3. Only apply the confirmed-correct approach to the real code
4. Delete the test file after the fix is applied

Never apply a CSS/UI change directly without visual verification when multiple approaches exist.
