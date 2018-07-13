/*eslint-disable */
import assert from 'power-assert';
import { buildNodeXlsxFile,buildXlsxFile,transformExcelHead, transformExcelBody } from '../src';

const testData = [
  { id: 1, name: 'xx', age: 18 },
  { id: 1, name: 'xx', age: 18 },
  { id: 1, name: 'xx', age: 18 }
];

describe('node-xlsx-easy', () => {
  describe('#transformExcelHead()', () => {
    it('should build header', () => {
      const head = transformExcelHead(testData);
      assert.deepEqual(head, ['id', 'name', 'age']);
    });
  });
  describe('#transformExcelBody()', () => {
    it('should build Body', () => {
      const body = transformExcelBody(testData);
      console.log(body)
      assert.deepEqual(body, [["1",'xx',"18"]["1",'xx',"18"]["1",'xx',"18"]]);
    });
  });
});
