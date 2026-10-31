# Agent Operating Instructions & Plugin Orchestration

## Core Plugins & Active Frameworks

All agent interactions and tasks must leverage the full power of the installed ecosystem:

1. **GSD (Get Shit Done)**:
   - For any multi-step task or feature request, create a concrete specification and break work into discrete atomic tasks.
   - Keep context tight and focused; verify each milestone before proceeding to the next.

2. **Ralph Loop (Autonomous Verification Gate)**:
   - Every code modification must satisfy strict verification gates: run `npm run build` or equivalent verification.
   - All 45/45 routes must build with exit code 0 and zero TypeScript/lint errors.
   - Create clean, descriptive git commits per atomic step.

3. **CodeRabbit Quality & Security**:
   - Apply CodeRabbit security principles: sanitize all inputs, protect environment secrets, enforce HMAC-SHA256 signatures on payments, and prevent timing attacks.
   - Perform static code audits before marking tasks complete.

4. **Mobbin & Dribbble Dual Design Engine**:
   - For all frontend UI and design tasks, follow real-world shipping patterns from top apps (Uber, Blinkit, Swiggy, Airbnb, Apple, Linear, Stripe) via Mobbin, combined with modern visual aesthetic trends (glassmorphism, subtle gradients, soft multi-layer shadows, micro-interactions) via Dribbble.
   - Never generate plain, flat, or generic template UI. Use modern spacing, micro-interactions, responsive hierarchy, and accessible components.

5. **Cross-Model Resilience (Claude Opus <-> Gemini 3.8 / Pro)**:
   - Maintain execution context in persistent planning files and clean commits.
   - Ensure that if the user switches models due to quota limits, the agent resumes execution immediately without requiring redundant instructions.

## Strict Guidelines
- Strictly ZERO EMOJIS in all code, comments, responses, and git commits.
- Hinglish communication style with the user.
- Clickable markdown links with `file://` scheme for all referenced files.
