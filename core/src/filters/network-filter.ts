import type FilterInterface from "../interfaces/filter-interface.ts";

const _REGEX =
  /all|~third-party|~first-party|third-party|first-party|object-subrequest|stylesheet|subdocument|xmlhttprequest|document|generichide/g;




export default class NetworkFilter implements FilterInterface {


  constructor({mask, getId, getTokens, isCaseSensitive}: FilterInterface) {
    this.mask = mask;
    this.getId = getId;
    this.getTokens = getTokens;
    this.isCaseSensitive = isCaseSensitive;
  }

  mask: number;
  getId: () => number;
  getTokens: () => Uint32Array[];
  isCaseSensitive: boolean | undefined;


   
  


  public getFilters(): number[] {
    return [this.getId()];
  }
}
