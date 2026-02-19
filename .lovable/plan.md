

# Fix: Remove `tb_media_content_pillar_check` Constraint

## Problem

The CHECK constraint `tb_media_content_pillar_check` on `tb_media_content` still exists and only allows these old values:

```text
'strategy', 'development', 'marketing'
```

The n8n workflow is sending `"technology"`, and the current content pillars defined in the system are:

- AI & Innovation
- Business Strategy
- Growth & Scaling
- Technical Guide

None of these match the old constraint, so every insert fails.

## Solution

Drop the constraint entirely. The pillar values are controlled by the n8n workflow and AI prompts, so a database-level constraint adds friction without value.

## Change

Run a single migration:

```sql
ALTER TABLE tb_media_content
DROP CONSTRAINT tb_media_content_pillar_check;
```

No code changes needed -- this is a database-only fix.

## After Dropping

Re-run the n8n carousel workflow to confirm the insert succeeds without error.

