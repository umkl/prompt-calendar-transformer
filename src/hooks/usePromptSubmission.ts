import { useState } from "react";

export default function usePromptSubmission(
  newEventCb: (events: pct.Event) => void
) {
  const [loading, setLoading] = useState(false);

  return {
    submit(event: React.FormEvent) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const input = form.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const prompt = input.value;
      console.log("Prompt submitted:", prompt);
      input.value = "";
      setLoading(true);
      const promptSearchParams = prompt
        ? `?prompt=${encodeURIComponent(prompt)}`
        : "";
      fetch(
        `${
          import.meta.env.VITE_CLOUDFLARE_WORKER_ENDPOINT
        }${promptSearchParams}`
      )
        .then((res) => {
          if (res.body) {
            return res.body.getReader();
          }
          throw new Error("No response body");
        })
        .catch((err) => {
          console.error("Error generating event:", err);
        })
        .then(async (data: void | ReadableStreamDefaultReader<Uint8Array>) => {
          const decoder = new TextDecoder();
          let buffer = "";

          if (!data) return;

          const cleanChunk = (str: string) => {
            return str.replace(/\r?\n/g, "");
          };

          const extractJsonObjects = () => {
            const results = [];
            let braceDepth = 0;
            let inString = false;
            let escape = false;
            let startIndex = -1;

            for (let i = 0; i < buffer.length; i++) {
              const char = buffer[i];

              if (escape) {
                escape = false;
                continue;
              }

              if (char === "\\") {
                escape = true;
                continue;
              }

              if (char === '"' && !escape) {
                inString = !inString;
                continue;
              }

              if (!inString) {
                if (char === "{") {
                  if (braceDepth === 0) {
                    startIndex = i;
                  }
                  braceDepth++;
                } else if (char === "}") {
                  braceDepth--;
                  if (braceDepth === 0 && startIndex !== -1) {
                    const jsonStr = buffer.slice(startIndex, i + 1);
                    results.push({ jsonStr, startIndex, endIndex: i + 1 });
                    startIndex = -1;
                  }
                }
              }
            }

            // Remove parsed JSON from buffer in reverse order
            for (let i = results.length - 1; i >= 0; i--) {
              const { jsonStr, startIndex, endIndex } = results[i];
              try {
                const parsed = JSON.parse(jsonStr);
                newEventCb(parsed);
                buffer = buffer.slice(0, startIndex) + buffer.slice(endIndex);
              } catch (err) {
                // Incomplete JSON, leave it in place
              }
            }
          };

          // Read loop
          while (true) {
            const { value, done } = await data.read();
            if (done) break;
            buffer += cleanChunk(decoder.decode(value, { stream: true }));
            extractJsonObjects();
          }
          extractJsonObjects();

          if (buffer.trim().length > 0) {
            console.error("Unparsed leftover JSON:", buffer);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    loading,
  };
}
