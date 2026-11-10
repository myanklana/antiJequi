import type FilterInterface from "../interfaces/filter-interface";

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