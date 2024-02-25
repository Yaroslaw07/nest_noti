export const NOTE_SOCKET_EVENTS = {
  JOIN_NOTE_ROOM: 'joinNoteRoom',
  LEAVE_NOTE_ROOM: 'leaveNoteRoom',

  UPDATED_BATCH_NOTE: 'note-Batch-Updated',
  TO_BATCH_UPDATE_NOTE: 'toUpdateNote',
};

export enum NOTE_BATCH_EVENTS {
  NOTE_INFO_UPDATED_BATCH = 'noteInfo-Batch-Updated',
  NOTE_BLOCK_CREATED_BATCH = 'noteBlock-Batch-Created',
  NOTE_BLOCK_UPDATED_BATCH = 'noteBlock-Batch-Updated',
  NOTE_BLOCK_DELETED_BATCH = 'noteBlock-Batch-Deleted',
}

export const NOTE_INFOS_SOCKET_EVENTS = {
  NOTE_INFOS_UPDATED: 'noteInfos-Updated',
  NOTE_CREATED: 'noteInfos-Created',
  NOTE_DELETED: 'noteInfos-Deleted',
};
