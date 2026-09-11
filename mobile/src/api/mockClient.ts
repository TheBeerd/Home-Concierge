import type {
  AccountProfile,
  CompletionConfirmationInput,
  DashboardData,
  DecisionMemo,
  IntakeMessage,
  IntakeSession,
  JobStatus,
  MessageThread,
  MessageThreadDetail,
  ServiceRequestSummary,
  ThreadMessage,
} from '../types/domain';
import {
  MOCK_JOB_ID,
  MOCK_REQUEST_ID,
  accountProfile,
  allRequests,
  dashboardData,
  decisionMemo,
  jobStatusByJobId,
  messageThreads,
  messagesByThreadId,
} from '../data/mockData';
import type { HomeConciergeApi } from './client';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}_${(idCounter += 1)}`;

/**
 * A fixed guided-intake script standing in for the real, human-reviewed
 * AI intake. Each step is keyed off how many user replies have come in —
 * a real backend would branch on the actual answers.
 */
function scriptedNextMessage(userReplyCount: number): IntakeMessage {
  switch (userReplyCount) {
    case 0:
      return {
        id: nextId('ai'),
        sender: 'ai',
        text: "Is the air blowing warm, or is nothing coming out at all?",
      };
    case 1:
      return {
        id: nextId('ai'),
        sender: 'ai',
        text: 'Got it. How old is your system, if you know?',
        quickReplies: ['Under 5 years', '5–10 years', '10+ years', 'Not sure'],
      };
    case 2:
      return {
        id: nextId('ai'),
        sender: 'ai',
        text: "A photo of the outdoor unit's data plate helps us a lot here.",
        attachmentRequest: [
          { kind: 'photo', label: 'Take photo' },
          { kind: 'voice_note', label: 'Voice note' },
        ],
      };
    default:
      return {
        id: nextId('ai'),
        sender: 'ai',
        text:
          "Perfect — that's everything we need. Our team will review this and get it in front of licensed local contractors.",
      };
  }
}

const sessions = new Map<string, { session: IntakeSession; userReplyCount: number }>();

// Deep-ish copies so repeated reads/writes in a session don't mutate the
// shared seed data in mockData.ts.
const requestStore: ServiceRequestSummary[] = allRequests.map((request) => ({ ...request }));
const jobStore = new Map<string, JobStatus>(
  Object.entries(jobStatusByJobId).map(([id, job]) => [id, { ...job, timeline: job.timeline.map((e) => ({ ...e })) }]),
);
const threadMessageStore = new Map<string, ThreadMessage[]>(
  Object.entries(messagesByThreadId).map(([id, msgs]) => [id, msgs.map((m) => ({ ...m }))]),
);

export class MockHomeConciergeApi implements HomeConciergeApi {
  async getDashboard(): Promise<DashboardData> {
    await delay(250);
    return {
      ...dashboardData,
      activeRequests: requestStore.filter((r) => r.status !== 'completed'),
    };
  }

  async startIntakeSession(): Promise<IntakeSession> {
    await delay(200);
    const session: IntakeSession = {
      id: nextId('session'),
      requestId: MOCK_REQUEST_ID,
      messages: [scriptedNextMessage(0)],
      progress: 0.15,
      complete: false,
    };
    sessions.set(session.id, { session, userReplyCount: 0 });
    return session;
  }

  async sendIntakeReply(
    sessionId: string,
    reply: { text?: string; quickReply?: string; attachmentLabel?: string },
  ): Promise<IntakeSession> {
    const entry = sessions.get(sessionId);
    if (!entry) throw new Error(`Unknown intake session: ${sessionId}`);

    const userText = reply.quickReply ?? reply.attachmentLabel ?? reply.text ?? '';
    const userMessage: IntakeMessage = {
      id: nextId('user'),
      sender: 'user',
      text: userText,
    };

    entry.userReplyCount += 1;
    await delay(500);

    const aiMessage = scriptedNextMessage(entry.userReplyCount);
    const complete = entry.userReplyCount >= 3;

    entry.session = {
      ...entry.session,
      messages: [...entry.session.messages, userMessage, aiMessage],
      progress: Math.min(1, 0.15 + entry.userReplyCount * 0.28),
      complete,
    };

    return entry.session;
  }

  async submitIntakeSession(sessionId: string): Promise<{ requestId: string }> {
    const entry = sessions.get(sessionId);
    if (!entry) throw new Error(`Unknown intake session: ${sessionId}`);
    await delay(600);
    // In production this is where ops review + contractor matching kicks
    // off. The mock always resolves to the same seeded request/memo.
    return { requestId: entry.session.requestId };
  }

  async getDecisionMemo(requestId: string): Promise<DecisionMemo> {
    await delay(500);
    if (requestId !== decisionMemo.requestId) {
      throw new Error(`No decision memo for request ${requestId}`);
    }
    return decisionMemo;
  }

  async acceptBid(_requestId: string, _bidId: string): Promise<JobStatus> {
    await delay(400);
    const job = jobStore.get(MOCK_JOB_ID);
    if (!job) throw new Error(`No seeded job for accepted bid`);
    return job;
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    await delay(300);
    const job = jobStore.get(jobId);
    if (!job) throw new Error(`No job status for job ${jobId}`);
    return job;
  }

  async confirmJobCompletion(
    jobId: string,
    confirmation: CompletionConfirmationInput,
  ): Promise<JobStatus> {
    await delay(400);
    const job = jobStore.get(jobId);
    if (!job) throw new Error(`No job status for job ${jobId}`);
    if (!confirmation.completed) {
      return job;
    }
    const updated: JobStatus = {
      ...job,
      phase: 'completed',
      completionConfirmedAt: new Date().toISOString(),
      timeline: job.timeline.map((event) =>
        event.status === 'pending'
          ? { ...event, status: 'done', meta: 'Confirmed by you just now' }
          : event,
      ),
    };
    jobStore.set(jobId, updated);

    const request = requestStore.find((r) => r.jobId === jobId || r.id === job.requestId);
    if (request) {
      request.status = 'completed';
      request.statusMeta = 'Completed just now';
    }

    return updated;
  }

  async listRequests(): Promise<ServiceRequestSummary[]> {
    await delay(300);
    return requestStore;
  }

  async listMessageThreads(): Promise<MessageThread[]> {
    await delay(250);
    return messageThreads;
  }

  async getMessageThread(threadId: string): Promise<MessageThreadDetail> {
    await delay(250);
    const thread = messageThreads.find((t) => t.id === threadId);
    if (!thread) throw new Error(`No message thread ${threadId}`);
    thread.unread = false;
    return { thread, messages: threadMessageStore.get(threadId) ?? [] };
  }

  async sendMessage(threadId: string, text: string): Promise<ThreadMessage[]> {
    const existing = threadMessageStore.get(threadId) ?? [];
    const homeownerMessage: ThreadMessage = {
      id: nextId('msg'),
      sender: 'homeowner',
      text,
      sentAt: new Date().toISOString(),
    };
    await delay(400);
    const autoReply: ThreadMessage = {
      id: nextId('msg'),
      sender: 'contractor',
      text: "Thanks for the message — we'll get back to you shortly.",
      sentAt: new Date().toISOString(),
    };
    const updated = [...existing, homeownerMessage, autoReply];
    threadMessageStore.set(threadId, updated);

    const thread = messageThreads.find((t) => t.id === threadId);
    if (thread) {
      thread.lastMessagePreview = autoReply.text;
      thread.lastMessageAt = autoReply.sentAt;
    }

    return updated;
  }

  async getAccountProfile(): Promise<AccountProfile> {
    await delay(200);
    return accountProfile;
  }
}
