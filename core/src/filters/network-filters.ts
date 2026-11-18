const TYPE_MAP: Record<string, string> = {
  script: "script", image: "image", stylesheet: "stylesheet", object: "object",
  xmlhttprequest: "xmlhttprequest", subdocument: "sub_frame", ping: "ping",
  media: "media", font: "font", websocket: "websocket", other: "other",
}

export interface NetworkFilter{
    pattern: string;
  isException: boolean;
  resourceTypes: string[];
  excludedResourceTypes: string[];
  domainType?: "firstParty" | "thirdParty";
  initiatorDomains: string[];
  excludedInitiatorDomains: string[];
  matchCase: boolean;
  important: boolean;

}

export function parseNetworkFilter(line:string):NetworkFilter | null {
    let text = line.trim();
    if (!text || text.startsWith("!") || text.startsWith("[")) return null;
    if (/#[@?$%]?#/.test(text)) return null; // cosmético (##, #@#, #?#, #$#, #%#)
    if (/#[@?$%]?#/.test(text)) return null;
    const f:NetworkFilter = {
        pattern: "",
        isException: false,
        resourceTypes: [],
        excludedResourceTypes: [],
        initiatorDomains: [],
        excludedInitiatorDomains: [],
        matchCase: false,
        important: false,
    };
    if (text.startsWith("@@")) {
        f.isException = true;
        text = text.substring(2);
    }
  const currency = text.lastIndexOf("$");
  const pattern = currency === -1 ? text : text.slice(0, currency);
  const options = currency === -1 ? [] : text.slice(currency + 1).split(",");
    
    if(pattern.length > 1 && pattern.startsWith("/") && pattern.endsWith("/")) return null;
    if (/[^ -~]/.test(pattern)) return null; // DNR só aceita ASCII imprimível no urlFilter
    f.pattern = pattern;

    for (const option of options){

        const not = option.startsWith("~");
        const [key, value = ""] = (not ? option.slice(1) : option).split("=");

        if(key in TYPE_MAP){
            (not ? f.excludedResourceTypes : f.resourceTypes).push(TYPE_MAP[key]);
        }
        else if(key === "third-party" || key === "3p"){
            f.domainType = not ? "firstParty" : "thirdParty";
        }
        else if (key === "first-party" || key === "1p"){
            f.domainType = not ? "thirdParty" : "firstParty";
        }
        else if(key === "domain"){
            for (const d of value.split("|").filter(Boolean)){
                if (d.startsWith("~")) f.excludedInitiatorDomains.push(d.slice(1));
                else f.initiatorDomains.push(d);
            }
        }
        else if(key === "match-case"){
            f.matchCase = true;
        }
        else if (key === "important"){
            f.important = true;
        }
        else{
            return null
        }
    }




    return f;
}