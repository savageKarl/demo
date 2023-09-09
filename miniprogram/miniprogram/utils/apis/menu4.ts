import request from '../https';


interface getSalesResportParams {
  utype: number | string,
  uid: number | string
}

interface getSalesReportResult {
  isSalesRedTotal: number,
  projectName: string,
  psId: number,
  storeName: string,
  workDateReports: {
    isSalesRed: number,
    reportStatus: number,
    workDate: string
  }[]
}

export const d1 = (params: getSalesResportParams) => {
  return request<getSalesReportResult>('1244644546', params, 'GET', false);
}

export const d2 = (params: getSalesResportParams) => {
  return request<getSalesReportResult>('1244644546', params, 'GET', false);
}
