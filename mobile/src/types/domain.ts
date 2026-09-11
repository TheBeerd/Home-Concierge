/**
 * Domain types shared by the app and (eventually) the Home Concierge API.
 *
 * These mirror the concepts in the concierge model doc: a homeowner's
 * service request goes through a human-reviewed AI intake, contractors
 * submit structured bids, ops assembles a decision memo, and the
 * homeowner confirmation after the job is the source of truth for the
 * trust graph (price accuracy, callback rate, warranty follow-through).
 *
 * Keep this file as the single contract between the UI and whichever
 * `HomeConciergeApi` implementation is wired up (see src/api).
 */

export type RequestStatus =
  | 'intake' // homeowner is still answering guided questions
  | 'matching' // ops is structuring bids with contractors
  | 'memo_ready' // decision memo has been generated for the homeowner
  | 'booked' // homeowner accepted a bid, appointment confirmed
  | 'awaiting_confirmation' // job window has passed, waiting on homeowner yes/no
  | 'completed'; // homeowner confirmed the job was done

export interface ServiceRequestSummary {
  id: string;
  title: string;
  status: RequestStatus;
  statusMeta: string; // e.g. "3 bids in · memo ready" / "Scheduled for Thu, Sep 17"
  updatedAt: string; // ISO timestamp
  /** Set once a bid has been accepted and a job exists to track. */
  jobId?: string;
}

export interface SystemAgeBand {
  id: 'under_5' | '5_to_10' | 'over_10' | 'not_sure';
  label: string;
}

export interface IntakeAttachment {
  id: string;
  kind: 'photo' | 'voice_note';
  uri?: string; // local URI once captured
  label: string;
}

export type IntakeSender = 'ai' | 'user';

export interface IntakeMessage {
  id: string;
  sender: IntakeSender;
  text: string;
  quickReplies?: string[];
  attachmentRequest?: { kind: 'photo' | 'voice_note'; label: string }[];
  attachments?: IntakeAttachment[];
}

export interface IntakeSession {
  id: string;
  requestId: string;
  messages: IntakeMessage[];
  progress: number; // 0-1, drives the progress bar
  complete: boolean;
}

/** What the homeowner verifies vs. what onboarding verifies is intentionally
 * split (see the liability note: "verified", never "vetted"). */
export interface ContractorVerification {
  licenseNumber: string;
  licenseVerified: boolean;
  insuranceVerified: boolean;
}

/** The transaction-level trust graph — this, not the AI, is the moat. */
export interface ContractorTrustStats {
  jobsCompleted: number;
  callbackRateWithin30Days: number; // 0-1, lower is better
  warrantyFollowThroughRate: number; // 0-1, higher is better
  quoteAccuracyScore: number; // 0-1, final price vs. quoted range adherence
}

export interface Contractor {
  id: string;
  name: string;
  verification: ContractorVerification;
  trustStats: ContractorTrustStats;
}

export interface Bid {
  id: string;
  contractorId: string;
  contractorName: string;
  likelyCause: string;
  diagnosticFee: string; // formatted, e.g. "$89" or "Free"
  priceRangeLow: number;
  priceRangeHigh: number;
  warrantySummary: string;
  availability: string;
  isSuggested: boolean;
}

export interface DecisionMemoFlag {
  contractorId: string;
  contractorName: string;
  message: string;
}

export interface DecisionMemo {
  id: string;
  requestId: string;
  contractorCount: number;
  flags: DecisionMemoFlag[];
  bids: Bid[];
  ourTake: string;
  suggestedBidId: string;
}

export type JobTimelineStatus = 'done' | 'pending';

export interface JobTimelineEvent {
  id: string;
  title: string;
  meta: string;
  status: JobTimelineStatus;
}

export type JobPhase =
  | 'scheduled' // appointment booked, window hasn't happened yet
  | 'awaiting_confirmation' // window has passed, needs the homeowner's yes/no
  | 'completed'; // homeowner confirmed the job was done

export interface JobStatus {
  jobId: string;
  requestId: string;
  requestTitle: string;
  contractorName: string;
  appointmentWindow: string;
  timeline: JobTimelineEvent[];
  phase: JobPhase;
  completionConfirmedAt?: string;
}

export interface CompletionConfirmationInput {
  completed: boolean;
  photoUri?: string;
  note?: string;
}

export interface DashboardData {
  greetingName?: string;
  activeRequests: ServiceRequestSummary[];
}

// ---- Messages ----

export interface MessageThread {
  id: string;
  contractorId: string;
  contractorName: string;
  requestId?: string;
  lastMessagePreview: string;
  lastMessageAt: string; // ISO timestamp
  unread: boolean;
}

export type MessageSender = 'homeowner' | 'contractor';

export interface ThreadMessage {
  id: string;
  sender: MessageSender;
  text: string;
  sentAt: string; // ISO timestamp
}

export interface MessageThreadDetail {
  thread: MessageThread;
  messages: ThreadMessage[];
}

// ---- Account ----

export interface AccountProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}
