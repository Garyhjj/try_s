const t = `import { EntityObject } from '{{entityPath}}';
export const {{ preName }}Object: EntityObject = {
  tableName: '{{ tableName }}',
  primaryKeyId: 'ID',
  seqName: '{{ tableName }}_SEQ',
};

export const {{ preName }}Entity = {
    {{ tableEntity }}
};

export class {{ preName }} {
    {{ tableInterface }}
}
`

module.exports = t;