# Antigravity Admin Setup Guide

Since the platform uses a unified authentication system, administrative roles are managed directly via the database schema. Follow these steps to promote a user to an administrative role.

## 1. Role Assignment in Supabase

1.  Open your **Supabase Dashboard**.
2.  Navigate to the **Table Editor** (grid icon) and select the `profiles` table.
3.  Locate the user you wish to promote (search by `uid` or `name`).
4.  Double-click the **`role`** field for that user.
5.  Change the value to one of the following:
    *   **`lab`**: Lab Assistant / Librarian level (can approve to HOD stage).
    *   **`hod`**: Head of Department (can approve to Principal stage).
    *   **`principal`**: Final approving authority.
6.  Save the changes.

## 2. Admin Credentials

Administrative users in the `profiles` table use the same credential pattern as students for simplicity during the pilot:
*   **Username (UID)**: Their registered Enrollment/Staff ID.
*   **Password**: Their UID (same as username).

## 3. Workflow Permissions

| Role | Access Level | Primary Action |
| :--- | :--- | :--- |
| **Student** | Student Dashboard | Submit clearance requests and track status. |
| **Lab** | Admin Queue (`lab_pending`) | Approve/Reject students at the first stage. |
| **HOD** | Admin Queue (`hod_pending`) | Review and approve students cleared by labs. |
| **Principal** | Admin Queue (`principal_pending`) | Final approval sign-off. |

---

**Note:** For dedicated Authority accounts with traditional passwords, use the `authority_profiles` table in Supabase. The system will automatically detect which table to use during login.
