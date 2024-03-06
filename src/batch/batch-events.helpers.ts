import { ConflictException } from '@nestjs/common';

export const getEventData = (event: string): ParsedEvent => {
  try {
    const clearEvent = event.split('_')[0];

    const handler = BATCH_EVENT_INFO[clearEvent].handler;

    if (!handler) {
      throw new ConflictException('Invalid batch event type:' + event);
    }

    return handler(event);
  } catch (error) {
    throw new ConflictException(
      'Invalid batch event type declaration:' + event + ' ~ ' + error.message,
    );
  }
};

export const isEventGrouped = (event: string): boolean => {
  return BATCH_EVENT_INFO[event]?.isGrouping ?? false;
};

export enum BATCH_EVENTS {
  NOTE_INFO_UPDATED_BATCH = 'noteInfo-Batch-Updated',
  NOTE_BLOCK_CREATED_BATCH = 'noteBlock-Batch-Created',
  NOTE_BLOCK_UPDATED_BATCH = 'noteBlock-Batch-Updated',
  NOTE_BLOCK_DELETED_BATCH = 'noteBlock-Batch-Deleted',
}

type EventParser = (event: string) => ParsedEvent;

export const BATCH_EVENT_INFO: Record<
  string,
  { handler: EventParser; isGrouping?: boolean }
> = {
  [BATCH_EVENTS.NOTE_INFO_UPDATED_BATCH]: {
    handler: simpleParser,
    isGrouping: true,
  },
  [BATCH_EVENTS.NOTE_BLOCK_CREATED_BATCH]: {
    handler: simpleParser,
  },
  [BATCH_EVENTS.NOTE_BLOCK_UPDATED_BATCH]: {
    handler: parseBlockId,
    isGrouping: true,
  },
  [BATCH_EVENTS.NOTE_BLOCK_DELETED_BATCH]: {
    handler: parseBlockId,
    isGrouping: true,
  },
};

export interface ParsedEvent {
  event: string;
  additionalEventInfo?: any;
}

function simpleParser(event: string): ParsedEvent {
  return { event, additionalEventInfo: null };
}

function parseBlockId(event: string): ParsedEvent {
  const [eventType, blockId] = event.split('_');

  if (!blockId) {
    throw new Error('Block ID is missing in the ' + event + ' event type');
  }

  return { event: eventType, additionalEventInfo: { blockId } };
}
