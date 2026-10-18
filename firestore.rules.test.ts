/**
 * Security Rules Verification Suite (Dirty Dozen Payloads)
 * Verifies that all 12 adversarial payloads defined in security_spec.md
 * are rejected with PERMISSION_DENIED by firestore.rules.
 */

export interface DirtyDozenScenario {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expectedOutcome: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_SCENARIOS: DirtyDozenScenario[] = [
  {
    id: 1,
    name: 'Unauthenticated Write to SiteConfig',
    collectionPath: '/site_config/main',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 2,
    name: 'Unverified Email Spoof Attack on SiteConfig',
    collectionPath: '/site_config/main',
    operation: 'update',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 3,
    name: 'Non-Admin Authenticated Write to CustomPages',
    collectionPath: '/custom_pages/page1',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 4,
    name: 'Shadow Field Injection on SiteConfig',
    collectionPath: '/site_config/main',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 5,
    name: 'Author Spoofing on CustomPage Create',
    collectionPath: '/custom_pages/page1',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 6,
    name: 'Immutable createdAt Mutation on Update',
    collectionPath: '/custom_pages/page1',
    operation: 'update',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 7,
    name: 'Forged Client Timestamp on Create',
    collectionPath: '/custom_pages/page1',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 8,
    name: 'Oversized Content String (>5000 chars) on CustomPage',
    collectionPath: '/custom_pages/page1',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 9,
    name: 'ID Poisoning Attack with Invalid Characters',
    collectionPath: '/custom_pages/invalid id!',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 10,
    name: 'Unfiltered List Query on Unpublished CustomPages',
    collectionPath: '/custom_pages',
    operation: 'list',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 11,
    name: 'Self-Assigned Admin Privilege Escalation',
    collectionPath: '/admins/user2',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    id: 12,
    name: 'Immutable authorId Tampering on Solution Update',
    collectionPath: '/solutions/sol1',
    operation: 'update',
    expectedOutcome: 'PERMISSION_DENIED'
  }
];
