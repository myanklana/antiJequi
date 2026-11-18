import type {NetworkFilter} from "./network-filters.ts";

export interface DnrRule {
    id: number;
    priority: number;
    action: { type: "block" | "allow" };
    condition: Record<string, unknown>;
}

export function toDnrRule(f:NetworkFilter, id:number): DnrRule | null {
    const condition:Record<string, unknown> = {};

    if(f.pattern && f.pattern !== "*") condition.urlFilter = f.pattern;
    // O DNR não aceita resourceTypes e excludedResourceTypes na mesma regra.
    if(f.resourceTypes.length > 0) condition.resourceTypes = f.resourceTypes;
    else if(f.excludedResourceTypes.length > 0) condition.excludedResourceTypes = f.excludedResourceTypes;
    if(f.domainType) condition.domainType = f.domainType;
    if(f.initiatorDomains.length > 0) condition.initiatorDomains = f.initiatorDomains;
    if(f.excludedInitiatorDomains.length > 0) condition.excludedInitiatorDomains = f.excludedInitiatorDomains;
    if(f.matchCase) condition.isUrlFilterCaseSensitive = true;

    // Segurança: uma regra sem URL e sem domínio bloquearia TUDO.
    if(!condition.urlFilter && !condition.initiatorDomains) return null;

    return{
        id,
        priority:(f.isException ? 2 : 1) + (f.important ? 10 : 0),
        action : {type: f.isException ? "allow" : "block"},
        condition
    }
}
