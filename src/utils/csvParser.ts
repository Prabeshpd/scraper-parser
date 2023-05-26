import { createReadStream } from 'node:fs';
import { Transform } from 'node:stream';
import csvtojson from 'csvtojson';
import { pipeline } from 'node:stream/promises';

import * as tagService from '../services/tag'

export interface ParseTagParams {
  filePath: string;
  userId: number;
}

const dataSource = function (userId: number) {
  return new Transform({
    objectMode: true,
    transform(chunk, enc, callback) {
      const data = chunk.toString();
      const payload = {
        userId,
        name: data
      }
      return callback(null, JSON.stringify(payload));
    }
  });
};

export async function storeTagCsv(parseTagParams: ParseTagParams) {
  const { filePath, userId } = parseTagParams;
  await pipeline(
    createReadStream(filePath),
    csvtojson({
      noheader: true,
      output: 'line'
    }),
    dataSource(userId),
    async function* (source) {
      for await (let data of source) {
        const payload = await JSON.parse(data);
        await tagService.insertTags(payload);
      }
    }
  );
}
