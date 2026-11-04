# Ponytail coding rules

Apply the [Ponytail skill](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) to coding work in this directory and its projects. Use its default `full` level unless the user asks for another level.

- Before editing, read the relevant code and trace its callers, tests, fixtures, configuration, and exports. Check what the change could break or expose.
- Make the smallest complete change that solves the requested task. Reuse the project's existing components and conventions first, then platform or standard-library features, then installed dependencies. Add a dependency only when the task justifies it.
- Finish every necessary call site and supporting change. Avoid speculative features, wrappers, configuration, and abstractions. Prefer a clear small diff over compressed code that is hard to read.
- For a bug fix, find the callers and fix the root cause in shared code. Preserve validation and error handling when moving or merging code.
- Add one focused test or assert-based check for new nontrivial logic, such as branches, loops, parsing, financial calculations, security logic, or a new script or app. Skip tests for trivial changes.
- Preserve trust-boundary validation, data-loss protection, security, accessibility, hardware calibration, and every explicit user requirement.
- If a deliberate shortcut has a known limit, leave a brief `shortcut: <limit>, <when to revisit>` comment.
- End the work summary with any material unchecked area or risk. Do not invent a risk when there is none.

## Pixel effects

For pixel-art VFX, sprite animations, or sprite-sheet work, read the project-local [pixelfx skill](.agents/skills/pixelfx/SKILL.md) and use its existing effects or authoring workflow when relevant. Acquire the pixelfx effect library for the actual project only when an effect is needed; the skill instructions and the library are separate.
