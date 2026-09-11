import type {
  Contractor,
  DashboardData,
  DecisionMemo,
  JobStatus,
  ServiceRequestSummary,
} from '../types/domain';

export const MOCK_REQUEST_ID = 'req_upstairs_ac';
export const MOCK_JOB_ID = 'job_coolway_ac';

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

export const dashboardData: DashboardData = {
  greetingName: undefined,
  activeRequests: [
    {
      id: MOCK_REQUEST_ID,
      title: 'Upstairs unit not cooling',
      status: 'memo_ready',
      statusMeta: '3 bids in · memo ready',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'req_maintenance',
      title: 'Annual maintenance',
      status: 'booked',
      statusMeta: 'Scheduled for Thu, Sep 17',
      updatedAt: new Date().toISOString(),
    } satisfies ServiceRequestSummary,
  ],
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

export const jobStatus: JobStatus = {
  jobId: MOCK_JOB_ID,
  requestId: MOCK_REQUEST_ID,
  requestTitle: 'Upstairs unit not cooling',
  contractorName: 'Coolway Air',
  appointmentWindow: 'Wed, 1:00–3:00 PM',
  awaitingCompletionConfirmation: true,
  timeline: [
    { id: 't1', title: 'Bid accepted', meta: 'Tue, 4:12 PM', status: 'done' },
    { id: 't2', title: 'Appointment confirmed', meta: 'Tue, 4:20 PM', status: 'done' },
    { id: 't3', title: 'Job completed', meta: 'Awaiting confirmation', status: 'pending' },
  ],
};
