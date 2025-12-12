import { mapKey } from "../const/local-storage";
import stringToReader from "../lib/string-to-reader";
import { retrieveMapFromLocalStorage } from "./local-storage";

const isCachedRequest = true;

export async function getStream(promptSearchParams: string): Promise<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> {
  const cachedRequest = retrieveMapFromLocalStorage(mapKey);
  const isCached = isCachedRequest && cachedRequest.has(promptSearchParams);
  if(cachedRequest.has(promptSearchParams)){
    const cachePromise = Promise.resolve(cachedRequest.get(promptSearchParams)).then(res => {
      if(!res){
        throw new Error("No cached response");
      }
      return stringToReader(res);
    });
    if (isCached) return cachePromise;
  }

  const fetchPromise = fetch(`${import.meta.env.VITE_CLOUDFLARE_WORKER_ENDPOINT}${promptSearchParams}`).then((res)=>{
    if(!res || !res.body){
      throw new Error("No response body");
    }
    return res.body.getReader();
  })

  return fetchPromise;
}