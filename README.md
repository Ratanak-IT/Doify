# TaskFlow – Complete Refactor Summary

## What Changed

### 1. Real API Integration (`src/lib/features/api/api.ts`)
- `baseApi` now calls `NEXT_PUBLIC_API/api/v1` directly (Spring Boot backend)
- Added response unwrapper for `{ data: ... }` envelope from backend
- Next.js proxy route handlers (`src/app/api/...`) are no longer used by any page

### 2. Zod Validation (`src/lib/schemas/index.ts`) — NEW FILE
Full schemas for every feature:
| Schema | Fields validated |
|---|---|
| `loginSchema` | email (required, valid), password (min 6) |
| `registerSchema` | fullName, username (alphanumeric, min 3), email, password (min 8, uppercase, number), confirmPassword match |
| `forgotPasswordSchema` | email |
| `resetPasswordSchema` | token, newPassword (min 8, uppercase, number), confirmPassword match |
| `updateProfileSchema` | fullName, username, email |
| `changePasswordSchema` | currentPassword, newPassword (strong), confirmPassword match |
| `createPersonalTaskSchema` | title (required, max 200), description, priority enum, dueDate |
| `createProjectTaskSchema` | + assigneeId, parentTaskId |
| `updateTaskSchema` | all fields optional |
| `createCommentSchema` | content (min 1, max 1000) |
| `updateCommentSchema` | content |
| `createProjectSchema` | name (required), description, startDate, dueDate, color (#hex), teamId |
| `updateProjectSchema` | all optional |
| `createTeamSchema` | name (min 2, max 100), description |
| `updateTeamSchema` | all optional |
| `inviteMemberSchema` | email, role enum (ADMIN/MEMBER), teamId |

### 3. Types (`src/lib/features/types/task-type.ts`)
- Task statuses updated to match backend: `TODO | IN_PROGRESS | IN_REVIEW | DONE`
- Task priorities updated: `LOW | MEDIUM | HIGH | URGENT`
- Added `PageResponse<T>` generic for paginated results
- Added `Attachment` interface
- Added `MemberRole` type

### 4. Auth API (`src/lib/features/auth/authApi.ts`)
New endpoints added:
- `POST /auth/refresh` → `useRefreshMutation`
- `POST /auth/logout` → `useLogoutApiMutation`
- `POST /auth/forgot-password` → `useForgotPasswordMutation`
- `POST /auth/reset-password` → `useResetPasswordMutation`
- `GET /auth/verify-email?token=` → `useVerifyEmailQuery`

### 5. Task API (`src/lib/features/tasks/taskApi.ts`) — full rewrite
| Hook | Endpoint |
|---|---|
| `useGetPersonalTasksQuery` | `GET /tasks/personal?status&search&page&size` |
| `useCreatePersonalTaskMutation` | `POST /tasks/personal` |
| `useGetProjectTasksQuery` | `GET /tasks/project/{projectId}?assigneeId&page&size` |
| `useCreateProjectTaskMutation` | `POST /tasks/project/{projectId}` |
| `useGetTaskQuery` | `GET /tasks/{id}` |
| `useUpdateTaskMutation` | `PUT /tasks/{id}` |
| `useDeleteTaskMutation` | `DELETE /tasks/{id}` |
| `useGetSubtasksQuery` | `GET /tasks/{id}/subtasks` |
| `useAddAttachmentMutation` | `POST /tasks/{id}/attachments` |
| `useDeleteAttachmentMutation` | `DELETE /tasks/{id}/attachments/{attachmentId}` |
| `useGetCommentsQuery` | `GET /tasks/{id}/comments?page&size` |
| `useAddCommentMutation` | `POST /tasks/{id}/comments` |
| `useUpdateCommentMutation` | `PUT /tasks/{id}/comments/{commentId}` (NEW) |
| `useDeleteCommentMutation` | `DELETE /tasks/{id}/comments/{commentId}` |
| `useGetProjectsQuery` | `GET /projects?page&size` |
| `useGetProjectsByTeamQuery` | `GET /projects/team/{teamId}` (NEW) |
| `useGetProjectQuery` | `GET /projects/{id}` |
| `useCreateProjectMutation` | `POST /projects` |
| `useUpdateProjectMutation` | `PUT /projects/{id}` |
| `useDeleteProjectMutation` | `DELETE /projects/{id}` |
| `useGetDashboardQuery` | `GET /dashboard` |

### 6. Team API (`src/lib/features/team/teamApi.ts`) — full rewrite
| Hook | Endpoint |
|---|---|
| `useGetTeamsQuery` | `GET /teams?page&size` (paginated) |
| `useGetTeamByIdQuery` | `GET /teams/{id}` (NEW) |
| `useCreateTeamMutation` | `POST /teams` |
| `useUpdateTeamMutation` | `PUT /teams/{id}` (NEW) |
| `useDeleteTeamMutation` | `DELETE /teams/{id}` (NEW) |
| `useGetTeamMembersQuery` | `GET /teams/{id}/members?page&size` (paginated) |
| `useInviteMemberMutation` | `POST /teams/{id}/invitations` |
| `useUpdateMemberRoleMutation` | `PATCH /teams/{id}/members/{memberId}/role` (NEW) |
| `useRemoveMemberMutation` | `DELETE /teams/{id}/members/{userId}` |
| `useAcceptInvitationMutation` | `POST /teams/invitations/{id}/accept` (NEW) |

### 7. Notifications API
- `useGetNotificationsQuery` now accepts `{ page, size }` — returns `PageResponse<Notification>`

### 8. Pages Updated

#### `tasks/page.tsx`
- Uses `useGetPersonalTasksQuery` (was `useGetTasksQuery`)
- Kanban columns use correct API statuses: `TODO, IN_PROGRESS, IN_REVIEW, DONE`
- New Task modal with inline Zod validation + field-level errors
- Comments drawer now supports **edit** and **delete** comments (NEW)
- Search passes query to API (server-side search)

#### `projects/page.tsx`
- Uses paginated `useGetProjectsQuery({})` → `.data?.content ?? []`
- Full **Edit Project** modal with Zod validation (NEW)
- Dropdown menu per card with Edit + Delete

#### `team/page.tsx` — major rewrite
- Team selector shows all teams, highlights active team
- **Create Team** modal with Zod validation (NEW)
- **Edit Team** modal (NEW)
- **Delete Team** with confirm dialog (NEW)
- Members list from `useGetTeamMembersQuery` (paginated)
- Per-member actions: **Update Role** (toggle Admin/Member) + **Remove** (NEW)
- Invite modal with full Zod validation

#### `notifications/page.tsx`
- Pagination controls (NEW)
- Filter tabs: All / Unread (NEW)
- Click notification to mark as read

#### `settings/page.tsx`
- **Profile tab**: Zod validation, syncs Redux store on save
- **Security tab**: Change password with Zod (strong password rules), show/hide toggles, field-level errors
- **Notifications tab**: Toggle preferences UI (NEW)
- **Logout**: calls `POST /auth/logout` with refreshToken before clearing Redux state

#### `login/page.tsx`
- Zod validation replaces manual validate()
- Password show/hide toggle (NEW)
- Forgot password link → `/forgot-password`

#### `register/page.tsx`
- Zod validation (removes gender field — not in API)
- Password show/hide toggle for both fields (NEW)
- Confirm password field

#### `forgot-password/page.tsx` — NEW PAGE
- `POST /auth/forgot-password` with Zod
- Success state shows confirmation

#### `reset-password/page.tsx` — NEW PAGE
- Reads `?token=` from URL
- `POST /auth/reset-password` with Zod
- Redirects to `/login` on success

### 9. `NewTaskModal` component
- Supports both **personal tasks** and **project tasks** (project selector)
- No `onSubmit` prop needed — handles creation internally
- Zod validation with field-level errors

## How to Run

```bash
npm install
npm run dev
```

Ensure `.env` has:
```
NEXT_PUBLIC_API=https://taskflow-api-682258391368.asia-southeast1.run.app
```
