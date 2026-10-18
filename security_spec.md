# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Global Default Deny**: Any path not explicitly matched in `/site_config/{configId}`, `/solutions/{solutionId}`, `/custom_pages/{pageId}`, `/admins/{adminId}`, `/chat_faqs/{faqId}`, or `/contact_leads/{leadId}` is unconditionally denied (`allow read, write: if false;`).
2. **Administrator Identity Invariant**: Only verified administrators (`isAdmin()`) may create, update, or delete website configuration (`/site_config`), solution cards (`/solutions`), custom pages/menus (`/custom_pages`), or chat FAQs (`/chat_faqs`). For `/contact_leads`, public visitors can submit a new lead (`status == 'novo'`), while only `isAdmin()` can read (`get`, `list`), update (`status`), or delete leads (strictly isolating visitor PII such as phone numbers).
3. **Author & Ownership Integrity**: Every write to `/site_config`, `/solutions`, and `/custom_pages` must have `authorId == request.auth.uid` on creation and preserve `authorId == existing().authorId` and `createdAt == existing().createdAt` on update.
4. **Temporal Integrity**: `createdAt` must equal `request.time` on document creation, and `updatedAt` must equal `request.time` on both creation and update.
5. **Query Enforcer on Public Lists**: Public visitors can read published `/solutions` and `/custom_pages` only when `resource.data.isPublished == true` (or if the requester is `isAdmin()`).
6. **Strict Key & Size Bounds**: Every string field is strictly bounded by `.size()` matching `firebase-blueprint.json`, and every create/update operation enforces `.hasAll()` and `.hasOnly()` / `affectedKeys().hasOnly()`.

## 2. The "Dirty Dozen" Payloads

1. **Unauthenticated Write to SiteConfig**: `auth = null`, attempting `create` on `/site_config/main` -> `PERMISSION_DENIED`.
2. **Unverified Email Spoof Attack**: `auth = { uid: 'spoof1', token: { email: 'microedi7@gmail.com', email_verified: false } }`, attempting `update` on `/site_config/main` -> `PERMISSION_DENIED`.
3. **Non-Admin Authenticated Write**: `auth = { uid: 'user2', token: { email: 'visitor@example.com', email_verified: true } }`, attempting `create` on `/custom_pages/page1` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection on SiteConfig**: Admin sends valid `SiteConfig` fields plus `isSuperAdmin: true` -> `PERMISSION_DENIED`.
5. **Author Spoofing on CustomPage Create**: Admin `uid: 'admin1'` sends `authorId: 'someone_else'` -> `PERMISSION_DENIED`.
6. **Immutable `createdAt` Mutation on Update**: Admin attempts to modify `createdAt` during an `update` on `/custom_pages/page1` -> `PERMISSION_DENIED`.
7. **Forged Client Timestamp on Create**: Admin sends `createdAt` in the past instead of `request.time` -> `PERMISSION_DENIED`.
8. **Value Poisoning / Oversized Content String**: Admin sends `content` with 10,000 characters (exceeding `maxLength: 5000`) on `/custom_pages/page1` -> `PERMISSION_DENIED`.
9. **ID Poisoning Attack**: Admin attempts to create `/custom_pages/invalid id with spaces!` -> `PERMISSION_DENIED`.
10. **Unfiltered List Query on Unpublished CustomPages**: Visitor queries `/custom_pages` without `where('isPublished', '==', true)` when an unpublished page exists -> `PERMISSION_DENIED`.
11. **Self-Assigned Admin Privilege Escalation**: Non-admin user attempts `create` on `/admins/user2` -> `PERMISSION_DENIED`.
12. **Immutable `authorId` Tampering on Solution Update**: Admin attempts to change `authorId` on an existing `/solutions/sol1` document -> `PERMISSION_DENIED`.
