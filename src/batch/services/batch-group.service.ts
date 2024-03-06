import { Injectable } from '@nestjs/common';
import { BatchUnit } from '../dto/batch-unit.dto';
import { isEventGrouped } from '../batch-events.helpers';

@Injectable()
export class BatchGroupService {
  constructor() {}

  groupChanges(batchChanges: BatchUnit[]): BatchUnit[] {
    const groupedChanges: BatchUnit[] = [];

    batchChanges.forEach((change) => {
      const { event, data } = change;

      if (!isEventGrouped(event)) {
        groupedChanges.push(change);
        return;
      }

      const index = groupedChanges.findIndex((item) => item.event === event);

      if (index === -1) {
        groupedChanges.push({
          event: event,
          data: data,
          timeStamp: change.timeStamp,
        });
      } else {
        groupedChanges[index].data = { ...groupedChanges[index].data, ...data };
      }
    });

    return groupedChanges;
  }
}
