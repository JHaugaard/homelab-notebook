# PocketBase Security Setup

This document explains how to secure your PocketBase collections so only authenticated users can access data.

## 1. Create Your User Account

1. Go to PocketBase Admin: `https://pocketbase.haugaard.dev/_/`
2. Navigate to **Users** collection
3. Click **+ New Record**
4. Enter your email and password
5. Save the record

## 2. Configure Collection API Rules

For each collection (`entries`, `projects`, `tags`), you need to set API rules that require authentication.

### Access Collection Settings

1. Go to PocketBase Admin
2. Click on the collection name (e.g., `entries`)
3. Click the **gear icon** (Settings) or go to **API Rules** tab

### Set the Rules

For **entries**, **projects**, and **tags** collections, set these rules:

| Rule | Value |
|------|-------|
| **List/Search** | `@request.auth.id != ""` |
| **View** | `@request.auth.id != ""` |
| **Create** | `@request.auth.id != ""` |
| **Update** | `@request.auth.id != ""` |
| **Delete** | `@request.auth.id != ""` |

The rule `@request.auth.id != ""` means "the request must have a valid authenticated user."

### Step-by-Step for Each Collection

#### entries collection
1. Go to `entries` collection → Settings
2. In "API Rules" section:
   - **List/Search rule**: `@request.auth.id != ""`
   - **View rule**: `@request.auth.id != ""`
   - **Create rule**: `@request.auth.id != ""`
   - **Update rule**: `@request.auth.id != ""`
   - **Delete rule**: `@request.auth.id != ""`
3. Click Save

#### projects collection
1. Go to `projects` collection → Settings
2. Apply same rules as above
3. Click Save

#### tags collection
1. Go to `tags` collection → Settings
2. Apply same rules as above
3. Click Save

## 3. Verify Security

After setting the rules, test that:

1. **Unauthenticated requests fail**: Try visiting `https://pocketbase.haugaard.dev/api/collections/entries/records` directly in a browser (should return 403 or empty)

2. **App redirects to login**: Visit `https://notebook.haugaard.dev` without being logged in (should redirect to login page)

3. **Data loads after login**: Log in with your credentials and verify you can see and create entries

## Summary

| Collection | All Rules Set To |
|------------|------------------|
| entries | `@request.auth.id != ""` |
| projects | `@request.auth.id != ""` |
| tags | `@request.auth.id != ""` |
| users | (default PocketBase rules - users can only access their own record) |

## Notes

- The `users` collection has built-in PocketBase rules that handle user authentication securely
- These rules make your notebook completely private - only you can access it
- If you ever need to add more users, create additional user records in the Users collection
