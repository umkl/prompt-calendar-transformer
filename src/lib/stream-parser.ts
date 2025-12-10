export async function parseJsonNdStream(
  stream: ReadableStreamDefaultReader<Uint8Array>,
  cb: (obj: object) => void,
  finalResultCb?: (results: string[]) => void
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = "";

  const allItems: string[] = [];

  if (!stream) return;

  const cleanChunk = (str: string) => {
    return str.replace(/\r?\n/g, "");
  };

  let multiPush = false;

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



    if(results.length > 1){
      multiPush = true;

    }

    const tempAcc = [];

    // Remove parsed JSON from buffer in reverse order
    for (let i = results.length - 1; i >= 0; i--) {
      const { jsonStr, startIndex, endIndex } = results[i];
      try {
        const parsed = JSON.parse(jsonStr);
        if(!multiPush){
          allItems.push(jsonStr);
          cb(parsed);
        }else {
          tempAcc.push(jsonStr);
        }
        buffer = buffer.slice(0, startIndex) + buffer.slice(endIndex);
      } catch (err) {
        // Incomplete JSON, leave it in place
        console.warn("Failed to parse JSON:", err);
        console.warn("Incomplete JSON string:", jsonStr);
      }
    }

    if(multiPush && tempAcc.length > 0){
      tempAcc.reverse().forEach(item => {
        const parsed = JSON.parse(item);
        allItems.push(item);
        cb(parsed);
      });
      multiPush = false;
    }
  };

  while (true) {
    const { value, done } = await stream.read();
    if (done) break;
    buffer += cleanChunk(decoder.decode(value, { stream: true }));
    extractJsonObjects();
  }
  extractJsonObjects();

  finalResultCb?.(allItems);
}
