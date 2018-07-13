import nodeXlsx from "node-xlsx";
import xlsx from "xlsx";

export const transformXlsxHeader = (headersData = []) => {
  const data = headersData
    .map((v, i) => {
      return { ...v, position: `${String.fromCharCode(65 + i)}1` };
    })
    .reduce((obj, next) => {
      return { ...obj, [next["position"]]: { v: next["v"] } };
    }, {});
  return data;
};

export const transformXlsxBody = (bodyData = [], headerData = []) => {
  const data = bodyData
    .map((v, i) => {
      return headerData.map((k, j) => {
        return Object.assign(
          {},
          { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) }
        );
      });
    })
    .reduce((prev, next) => prev.concat(next))
    .reduce((obj, next) => {
      return { ...obj, [next["position"]]: { v: next["v"] } };
    }, {});
  return data;
};

export const transformData = (bodyData = [], headerData = []) => {
  const headers = transformXlsxHeader(headerData);
  const body = transformXlsxHeader(bodyData, headerData);

  const output = Object.assign({}, headers, body);
  const length = Object.keys(output);
  //范围
  const ref = `${length[0]} : ${length[length.length - 1]}`;
  return {
    output,
    ref
  };
};

export const transformExcelHead = (data = []) => {
  return data.length >= 1 ? Object.keys(data[0]) : [];
};

export const transformExcelBody = (data = []) => {
  return data.map(v => Object.values(v));
};

export const buildXlsxFile = (options = {}) => {
  const { filePath, sheetName = Date.now(), body = [], header = [] } = options;
  return new Promise((res, rej) => {
    if (!filePath) {
      rej("filePath can not empty!");
    } else {
      const { output, ref } = this.transformData(body, header);
      const workBook = {
        SheetNames: [sheetName],
        Sheets: {
          [sheetName]: Object.assign({}, output, { "!ref": ref })
        }
      };
      xlsx.writeFile(workBook, filePath);
      res(true);
    }
  });
};

export const buildNodeXlsxFile = ({
  sheetName = Date.now(),
  data = []
} = {}) => {
  return new Promise((res, rej) => {
    const head = this.transformExcelHead(data);
    const result = this.transformExcelBody(data);
    result.unshift(head);
    const buffer = nodeXlsx.build([{ name: sheetName, data: result }]);
    res(buffer);
  });
};
