import { selectByFilter, selectSQL, selectSQLOne } from './query';
import { get,getOne } from './consult';
import { connect, disconnect } from '../dbs';
describe('querys',()=>{
    test('Select general', async ()=>{
        const sql = selectSQL({},'conceptos');
        expect(sql).toBeDefined();
        expect(sql).toEqual(expect.any(String));
    });
    test('Select by other', async ()=>{
        const sql = selectByFilter({},'conceptos','subgrupos','1');
        expect(sql).toBeDefined();
        expect(sql).toEqual(expect.any(String));
    });
    test('Select one', async ()=>{
        const sql = selectSQLOne('1',{},'conceptos');
        expect(sql).toBeDefined();
        expect(sql).toEqual(expect.any(String));
    });
});

describe('consults',()=>{
    beforeAll(()=>{
        connect();
    })
    test('Get', async ()=>{
        const data = await get('conceptos',{});
        expect(data).toBeDefined();
    });
    test('Get one', async ()=>{
        const data = await getOne('conceptos',1,{});
        expect(data.id).toBe(1);
    });
    afterAll(async()=>{
        await disconnect();
    });
});