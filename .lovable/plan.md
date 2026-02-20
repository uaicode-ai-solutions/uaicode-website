
# Add Edit and Delete Actions to User Management Table

## Overview

Add an "Actions" column to the Hero User Management table with edit (pencil) and delete (trash) icons for each user row. Clicking edit opens a dialog to modify the user's role and team. Clicking delete opens a confirmation dialog before removing the user.

## Changes

### 1. New file: `src/components/hero/admin/EditUserDialog.tsx`

A dialog similar to `InviteUserDialog` that allows editing:
- **Role** (admin / contributor / viewer) -- updates `tb_hero_roles`
- **Team** (none / admin / marketing / sales) -- updates `tb_hero_users.team`
- Displays the user's name and email as read-only context
- On save: updates the database, invalidates the `hero-users` query, shows a success toast

### 2. New file: `src/components/hero/admin/DeleteUserDialog.tsx`

An AlertDialog confirmation before deleting:
- Shows the user's name/email for confirmation
- On confirm: deletes from `tb_hero_roles` (user's roles) and `tb_hero_users` (the user record)
- Invalidates `hero-users` query and shows success toast
- Styled with the dark Hero theme (same as existing dialogs)

### 3. Modified: `src/components/hero/admin/HeroUserManagement.tsx`

- Add a 6th column header: **Actions**
- Add edit (Pencil icon) and delete (Trash2 icon) buttons in each row
- Both are icon-only buttons with ghost variant, styled for the dark theme
- Pencil: opens `EditUserDialog` with the selected user's data
- Trash: opens `DeleteUserDialog` with the selected user's data
- State management: `editingUser` and `deletingUser` state variables to track which user is being acted on

## Technical Details

| File | Type | Description |
|---|---|---|
| `src/components/hero/admin/EditUserDialog.tsx` | New | Edit role/team dialog |
| `src/components/hero/admin/DeleteUserDialog.tsx` | New | Delete confirmation dialog |
| `src/components/hero/admin/HeroUserManagement.tsx` | Modified | Add Actions column with edit/delete icons |

### Database Operations

- **Edit**: `supabase.from("tb_hero_roles").delete().eq("user_id", id)` then insert new role; `supabase.from("tb_hero_users").update({ team }).eq("id", id)`
- **Delete**: `supabase.from("tb_hero_roles").delete().eq("user_id", id)` then `supabase.from("tb_hero_users").delete().eq("id", id)`
- All operations use `as any` cast (same pattern as existing code) since these tables are not in the generated types

### UI Consistency

- Follows the same dark theme (`bg-[#141414]`, `border-white/[0.06]`, `text-white`)
- Uses existing UI components: Dialog, AlertDialog, Button, Select, Label
- Icons: `Pencil` and `Trash2` from lucide-react
