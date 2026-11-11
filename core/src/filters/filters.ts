import type FilterInterface from "../interfaces/filter-interface";
import CosmeticFilter from "./cosmetic-filter";
import NetworkFilter from "./network-filter";


const marcadores = ['##','#@','##+','##^','##$','##~','##*','##%','##!','##?','##=','##-','##|','##&','###'];


function defineFilter(text: string): NetworkFilter | CosmeticFilter | string {

  text = text.trim();

  if (text.length === 0) {
    return 'empty';
  }
  if (text.startsWith('!')){
    return 'comment';
  }
  if (text.startsWith('[') && text.endsWith(']')) {
    return 'header';
  }
  if (text.includes(marcadores.find((marcador) => text.includes(marcador))!)) {
    return new CosmeticFilter();
  }
  else{
    return new NetworkFilter({
      mask: 0,
      getId: () => 0,
      getTokens: () => [],
      isCaseSensitive: undefined
    });
  }

  }


export default class Filters<T extends FilterInterface> {
  private filters: T[] = [];

  constructor(filters: T[]) {
    this.filters = filters;
  }
  
  public getFilters(): T[] {
    return this.filters;
  }



  public updateFilters(newFilters:T[], filterToBeRemoved:Set<number|undefined>):void{
    let selected:T[] = [];

    const oldFilters = this.getFilters();

    if(oldFilters.length !==0){
      if(newFilters.length !== 0|| newFilters!== undefined){
        selected = oldFilters;
      }
      else{
        for(const filter of oldFilters){
          if(!filterToBeRemoved.has(filter.getId())){
            selected.push(filter);
          }
        }
      }
    }
  }
}
