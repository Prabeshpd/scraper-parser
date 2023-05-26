import Tag, { TagPayload } from '../models/Tags';

export async function insertTags(tag: TagPayload) {
  return Tag.insertData(tag);
}
