export default interface FilterInterface {
  mask:number;
  getId:() => number;
  getTokens:() => Uint32Array[];
  isCaseSensitive:boolean|undefined;

}
