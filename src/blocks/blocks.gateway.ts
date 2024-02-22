import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BlocksService } from './blocks.service';
import { NotesGateway } from 'src/notes/notes.gateway';
import { BLOCK_EVENTS } from './block-events.helper';

@WebSocketGateway({ cors: true })
export class BlocksGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly blockService: BlocksService,
    private readonly notesGateway: NotesGateway,
  ) {}

  async afterInit() {
    console.log('Block socket initialized');
  }

  @SubscribeMessage(BLOCK_EVENTS.TO_CREATE_BLOCK)
  async createBlock(@ConnectedSocket() client, @MessageBody() payload: any) {
    const { order } = payload;
    const { note_id } = client.handshake.headers;

    const createdBlock = await this.blockService.create(note_id, order);
    this.notesGateway.emitEventToNote(note_id, BLOCK_EVENTS.BLOCK_CREATED, {
      createdBlock,
      senderId: client.id,
    });
  }

  @SubscribeMessage(BLOCK_EVENTS.TO_UPDATE_BLOCK_PROPS)
  async updateBlockProps(
    @ConnectedSocket() client,
    @MessageBody() payload: any,
  ) {
    const { blockId, newProps } = payload;
    const { note_id } = client.handshake.headers;

    const updatedBlock = await this.blockService.updateBlocksProps(
      blockId,
      newProps,
    );

    this.notesGateway.emitEventToNote(
      note_id,
      BLOCK_EVENTS.BLOCK_PROPS_UPDATED,
      { blockId: updatedBlock.id, newProps: updatedBlock.props },
    );
  }

  @SubscribeMessage(BLOCK_EVENTS.TO_DELETE_BLOCK)
  async deleteBlock(@ConnectedSocket() client, @MessageBody() payload: any) {
    const { blockId } = payload;
    const { note_id } = client.handshake.headers;

    await this.blockService.deleteBlock(blockId);

    this.notesGateway.emitEventToNote(note_id, BLOCK_EVENTS.BLOCK_DELETED, {
      blockId,
    });
  }
}
