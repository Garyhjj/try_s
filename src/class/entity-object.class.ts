/**
 * 定义对应哪个table，主键名字和id增长序列名字
 * @param tableName table名字
 * @param primaryKeyId 主键名字
 * @param seqName 增长序列名字
 */
export class EntityObject {
  tableName: string;
  primaryKeyId: string;
  seqName: string;
}
