export const SET_CCN = Symbol('SET_CCN');

export function setCCN({ccn}) {
  return {
    type: SET_CCN,
    ccn: ccn
  }
}
