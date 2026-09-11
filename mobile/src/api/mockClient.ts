import type {
  CompletionConfirmationInput,
  DashboardData,
  DecisionMemo,
  IntakeMessage,
  IntakeSession,
  JobStatus,
} from '../types/domain';
import {
  MOCK_JOB_ID,
  MOCK_REQUEST_ID,
  dashboardData,
  decisionMemo,
  jobStatus,
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

export class MockHomeConciergeApi implements HomeConciergeApi {
  async getDashboard(): Promise<DashboardData> {
    await delay(250);
    return dashboardData;
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
    return jobStatus;
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    await delay(300);
    if (jobId !== MOCK_JOB_ID) {
      throw new Error(`No job status for job ${jobId}`);
    }
    return jobStatus;
  }

  async confirmJobCompletion(
    jobId: string,
    confirmation: CompletionConfirmationInput,
  ): Promise<JobStatus> {
    await delay(400);
    if (!confirmation.completed) {
      return jobStatus;
    }
    return {
      ...jobStatus,
      awaitingCompletionConfirmation: false,
      completionConfirmedAt: new Date().toISOString(),
      timeline: jobStatus.timeline.map((event) =>
        event.id === 't3'
          ? { ...event, status: 'done', meta: 'Confirmed by you just now' }
          : event,
      ),
    };
  }
}
