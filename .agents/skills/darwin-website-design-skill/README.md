# Darwin Website Design System Skill

## Install in Codex

Recommended repo-scoped location:

```text
<your-website-repo>/.agents/skills/darwin-website-design-system/
```

Put `SKILL.md`, `assets/`, and `examples/` inside that folder.

Recommended repo instructions file:

```text
<your-website-repo>/AGENTS.md
```

Add:

```md
# Project guidance
When building or editing this website, use the `darwin-website-design-system` skill. Read its SKILL.md and compare output against the mockups in `.agents/skills/darwin-website-design-system/assets/mockups/`.
```

## Image generation

This skill now includes an image-generation policy. It says to use `gpt-image-2` only when that model/tool is actually available and when the user explicitly requests new visual assets. Otherwise, reuse existing assets or create SVG/CSS equivalents.
