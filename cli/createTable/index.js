const fs = require('fs'),
    path = require('path'),
    db = require('../oracleDB'),
    template = require('./template');

const dbType1 = {
    2003: `{ type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' }`,
    2002: `{ type: 'number' }`,
    2001: `{ type: 'string' }`
}

const dbType2 = {
    2003: 'Date',
    2002: 'number',
    2001: 'string'
}

function formatTableDefine(metaData, type) {
    const middle = Object.create(null);
    if (Array.isArray(metaData)) {
        metaData.forEach(m => {
            if (type === 1) {
                middle[m.name] = dbType1[m.fetchType] ? dbType1[m.fetchType] : dbType1[2001];
            } else {
                middle[m.name] = dbType2[m.fetchType] ? dbType2[m.fetchType] : dbType2[2001];
            }
        })
    }
    let tableDefine = ``;
    for (let prop in middle) {
        tableDefine = tableDefine ? tableDefine + (type === 1 ? ',' : ';') + '\r\n' : tableDefine;
        let pre = tableDefine ? '    ' : '';
        tableDefine += `${pre}${prop}: ${middle[prop]}`;
    }
    return tableDefine + (type === 1 ? ',' : ';');
}

function prpareTemplate(template, tableName, tableEntity, tableInterface, filePath) {
    filePath = filePath ? filePath : '';
    let tpl = template;
    const preName = tableName.toLowerCase().split('_').filter(s => s !== 'mhub').map((str) => str.substring(0, 1).toUpperCase() + str.substring(1)).join('');
    if (filePath) {
        const relatePath = path.relative(filePath, './src/class/entity-object.class').replace(/\\/g, '/');
        tpl = template.replace(/\{\{\s*entityPath\s*\}\}/, relatePath);
    }
    return tpl.replace(/\{\{\s*tableName\s*\}\}/g, tableName)
        .replace(/\{\{\s*tableEntity\s*\}\}/g, tableEntity).
    replace(/\{\{\s*tableInterface\s*\}\}/g, tableInterface).replace(/\{\{\s*preName\s*\}\}/g, preName);
}

function getFilePath(subPath) {
    const prePath = `./src/${subPath}`;
    return prePath;
}

module.exports = (cli) => {
    const defaultCommand = cli.command('createTable', {
        desc: '新建table模板'
    }, (input, flags) => {
        if (flags.name) {
            let tableName = flags.name || '';
            tableName = tableName.toUpperCase();
            console.log('connect with the db');
            db.execute(`select * from ${tableName} where rownum = 1`).then((res) => {
                console.log('getting db result');
                let metaData = res.metaData;
                let out = Object.create(null);
                let tableEntity = formatTableDefine(metaData, 1);
                let tableInterface = formatTableDefine(metaData, 2);
                const subPath = flags.subPath ? flags.subPath : '';
                const filePath = getFilePath(subPath);
                let tpl = prpareTemplate(template, tableName, tableEntity, tableInterface, filePath);
                const inFilePath = path.join(filePath, `${'./'+(tableName.toLowerCase().split('_').filter(s => s!=='mhub').join('-')) + '.dto.ts'}`);
                fs.exists(inFilePath, function (e) {
                    if (!e) {
                        console.log('begin to write file');
                        fs.writeFile(inFilePath, tpl, (err) => {
                            if (err) {
                                console.error('command failed:', err);
                            } else {
                                console.log('Finished:', filePath);
                            }
                        })
                    } else {
                        console.error('command failed:', 'the file has existed');
                    }
                })

            }).catch(err => {
                console.error('command failed:', err)
            });

        }
    });

    defaultCommand.option('name', {
        desc: 'tell me the table name'
    });

    defaultCommand.option('subPath', {
        desc: 'tell me what sub-path you want to put the file'
    });

}