import type {
  AccountProfile,
  Contractor,
  DashboardData,
  DecisionMemo,
  JobStatus,
  MessageThread,
  ServiceRequestSummary,
  ThreadMessage,
} from '../types/domain';

export const MOCK_REQUEST_ID = 'req_upstairs_ac';
export const MOCK_JOB_ID = 'job_coolway_ac';

export const MOCK_MAINTENANCE_REQUEST_ID = 'req_maintenance';
export const MOCK_MAINTENANCE_JOB_ID = 'job_maintenance_visit';

export const MOCK_THERMOSTAT_REQUEST_ID = 'req_thermostat';
export const MOCK_THERMOSTAT_JOB_ID = 'job_thermostat';

export const contractors: Contractor[] = [
  {
    id: 'contractor_coolway',
    name: 'Coolway Air',
    verification: { licenseNumber: 'TACLB000001C', licenseVerified: true, insuranceVerified: true },
    trustStats: {
      jobsCompleted: 214,
      callbackRateWithin30Days: 0.04,
      warrantyFollowThroughRate: 0.97,
      quoteAccuracyScore: 0.93,
    },
  },
  {
    id: 'contractor_northtexas',
    name: 'North Texas HVAC',
    verification: { licenseNumber: 'TACLB000002C', licenseVerified: true, insuranceVerified: true },
    trustStats: {
      jobsCompleted: 156,
      callbackRateWithin30Days: 0.09,
      warrantyFollowThroughRate: 0.88,
      quoteAccuracyScore: 0.85,
    },
  },
  {
    id: 'contractor_metroair',
    name: 'Metro Air',
    verification: { licenseNumber: 'TACLB000003C', licenseVerified: true, insuranceVerified: true },
    trustStats: {
      jobsCompleted: 98,
      callbackRateWithin30Days: 0.12,
      warrantyFollowThroughRate: 0.79,
      quoteAccuracyScore: 0.71,
    },
  },
];

/** Every request the homeowner has ever filed — backs both the Home
 * "in progress" preview and the full Requests tab. */
export const allRequests: ServiceRequestSummary[] = [
  {
    id: MOCK_REQUEST_ID,
    title: 'Upstairs unit not cooling',
    status: 'memo_ready',
    statusMeta: '3 bids in · memo ready',
    updatedAt: new Date().toISOString(),
  },
  {
    id: MOCK_MAINTENANCE_REQUEST_ID,
    title: 'Annual maintenance',
    status: 'booked',
    statusMeta: 'Scheduled for Thu, Sep 17',
    updatedAt: new Date().toISOString(),
    jobId: MOCK_MAINTENANCE_JOB_ID,
  },
  {
    id: MOCK_THERMOSTAT_REQUEST_ID,
    title: 'Thermostat replacement',
    status: 'completed',
    statusMeta: 'Completed Aug 22',
    updatedAt: '2026-08-22T18:30:00.000Z',
    jobId: MOCK_THERMOSTAT_JOB_ID,
  },
];

export const dashboardData: DashboardData = {
  greetingName: undefined,
  activeRequests: allRequests.filter((request) => request.status !== 'completed'),
};

export const decisionMemo: DecisionMemo = {
  id: 'memo_upstairs_ac',
  requestId: MOCK_REQUEST_ID,
  contractorCount: 3,
  flags: [
    {
      contractorId: 'contractor_metroair',
      contractorName: 'Metro Air',
      message: 'Quoted full replacement without inspecting the compressor first.',
    },
  ],
  ourTake:
    "Start with Coolway Air. A repair-first diagnosis and a real labor warranty, at a fair price. If it turns out the compressor can't be saved, you'll have a clear diagnosis to make that call from.",
  suggestedBidId: 'bid_coolway',
  bids: [
    {
      id: 'bid_coolway',
      contractorId: 'contractor_coolway',
      contractorName: 'Coolway Air',
      likelyCause: 'Failing compressor',
      diagnosticFee: '$89',
      priceRangeLow: 600,
      priceRangeHigh: 1400,
      warrantySummary: '2 yr, parts & labor',
      availability: 'Today',
      isSuggested: true,
    },
    {
      id: 'bid_northtexas',
      contractorId: 'contractor_northtexas',
      contractorName: 'North Texas HVAC',
      likelyCause: 'Refrigerant leak',
      diagnosticFee: '$75',
      priceRangeLow: 450,
      priceRangeHigh: 900,
      warrantySummary: '1 yr, parts only',
      availability: 'Next day',
      isSuggested: false,
    },
    {
      id: 'bid_metroair',
      contractorId: 'contractor_metroair',
      contractorName: 'Metro Air',
      likelyCause: 'Full replacement',
      diagnosticFee: 'Free',
      priceRangeLow: 11800,
      priceRangeHigh: 13200,
      warrantySummary: '10 yr, manufacturer only',
      availability: 'Today',
      isSuggested: false,
    },
  ],
};

/** Job created once the AC decision memo's suggested bid is accepted. */
export const jobStatus: JobStatus = {
  jobId: MOCK_JOB_ID,
  requestId: MOCK_REQUEST_ID,
  requestTitle: 'Upstairs unit not cooling',
  contractorName: 'Coolway Air',
  appointmentWindow: 'Wed, 1:00–3:00 PM',
  phase: 'awaiting_confirmation',
  timeline: [
    { id: 't1', title: 'Bid accepted', meta: 'Tue, 4:12 PM', status: 'done' },
    { id: 't2', title: 'Appointment confirmed', meta: 'Tue, 4:20 PM', status: 'done' },
    { id: 't3', title: 'Job completed', meta: 'Awaiting confirmation', status: 'pending' },
  ],
};

/** The annual maintenance visit — booked, but its appointment window is
 * still ahead, so it isn't asking for a completion confirmation yet. */
export const maintenanceJobStatus: JobStatus = {
  jobId: MOCK_MAINTENANCE_JOB_ID,
  requestId: MOCK_MAINTENANCE_REQUEST_ID,
  requestTitle: 'Annual maintenance',
  contractorName: 'North Texas HVAC',
  appointmentWindow: 'Thu, Sep 17, 9:00–11:00 AM',
  phase: 'scheduled',
  timeline: [
    { id: 't1', title: 'Appointment scheduled', meta: 'Mon, 2:05 PM', status: 'done' },
    { id: 't2', title: 'Job completed', meta: 'Arrives Thu, Sep 17', status: 'pending' },
  ],
};

/** A fully closed-out job, for the Requests tab's "Completed" section. */
export const thermostatJobStatus: JobStatus = {
  jobId: MOCK_THERMOSTAT_JOB_ID,
  requestId: MOCK_THERMOSTAT_REQUEST_ID,
  requestTitle: 'Thermostat replacement',
  contractorName: 'Coolway Air',
  appointmentWindow: 'Fri, Aug 22, 10:00 AM–12:00 PM',
  phase: 'completed',
  completionConfirmedAt: '2026-08-22T18:30:00.000Z',
  timeline: [
    { id: 't1', title: 'Bid accepted', meta: 'Wed, Aug 20', status: 'done' },
    { id: 't2', title: 'Appointment confirmed', meta: 'Wed, Aug 20', status: 'done' },
    { id: 't3', title: 'Job completed', meta: 'Confirmed Aug 22', status: 'done' },
  ],
};

export const jobStatusByJobId: Record<string, JobStatus> = {
  [MOCK_JOB_ID]: jobStatus,
  [MOCK_MAINTENANCE_JOB_ID]: maintenanceJobStatus,
  [MOCK_THERMOSTAT_JOB_ID]: thermostatJobStatus,
};

export const messageThreads: MessageThread[] = [
  {
    id: 'thread_coolway',
    contractorId: 'contractor_coolway',
    contractorName: 'Coolway Air',
    requestId: MOCK_REQUEST_ID,
    lastMessagePreview: "See you Wednesday between 1–3 PM!",
    lastMessageAt: '2026-09-09T16:22:00.000Z',
    unread: false,
  },
  {
    id: 'thread_northtexas',
    contractorId: 'contractor_northtexas',
    contractorName: 'North Texas HVAC',
    requestId: MOCK_MAINTENANCE_REQUEST_ID,
    lastMessagePreview: 'Quick question about your maintenance visit — is the attic access clear?',
    lastMessageAt: '2026-09-10T14:05:00.000Z',
    unread: true,
  },
];

export const messagesByThreadId: Record<string, ThreadMessage[]> = {
  thread_coolway: [
    {
      id: 'm1',
      sender: 'homeowner',
      text: "Hi! Just confirming the appointment for the upstairs unit.",
      sentAt: '2026-09-09T15:58:00.000Z',
    },
    {
      id: 'm2',
      sender: 'contractor',
      text: "See you Wednesday between 1–3 PM!",
      sentAt: '2026-09-09T16:22:00.000Z',
    },
  ],
  thread_northtexas: [
    {
      id: 'm1',
      sender: 'contractor',
      text: 'Quick question about your maintenance visit — is the attic access clear?',
      sentAt: '2026-09-10T14:05:00.000Z',
    },
  ],
};

export const accountProfile: AccountProfile = {
  name: 'Jordan Ellis',
  email: 'jordan.ellis@example.com',
  phone: '(214) 555-0142',
  address: '4821 Bluebonnet Ln, Plano, TX 75024',
};
