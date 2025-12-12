import { useState } from "react";
import { getStream } from "../repo/cloud-function";
import { parseJsonNdStream } from "../lib/stream-parser";
import { pushItemToMapInLocalStorage } from "../repo/local-storage";
import { mapKey } from "../const/local-storage";


export default function usePromptSubmission(
  newEventCb: (events: pct.Event) => void,
  date: Date
) {
  const [loading, setLoading] = useState(false);

  return {
    submit(event: React.FormEvent) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const input = form.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      if(input.value === ''){
        return;
      }
      const prompt = input.value;
      input.value = "";
      setLoading(true);

      const promptSearchParams = prompt
        ? `?prompt=${encodeURIComponent(prompt)}`
        : "";

      getStream(promptSearchParams)
        .then((data: ReadableStreamDefaultReader<Uint8Array>) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return parseJsonNdStream(data, (obj: any) => {
            if (obj) {
                const newEvent ={
                id: obj.id,
                title: obj.title,
                start: new Date(new Date(date).toDateString() + ' ' + new Date(obj.start).toTimeString()),
                end: new Date(new Date(date).toDateString() + ' ' + new Date(obj.end).toTimeString()),
                }

                console.log(newEvent);
              newEventCb(newEvent);
            }
         }, (allItems: string[]) => {
          if(allItems.length > 0){
            pushItemToMapInLocalStorage(mapKey, promptSearchParams, `[${allItems.join(",")}]`);    
          }
          } );
        })
        .catch((err) => {
          console.error("Error resolving stream:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    loading,
  };
}

