export default function stringToReader(text:string): ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>> {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(text);

  const stream = new ReadableStream<Uint8Array<ArrayBuffer>>({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  });

  return stream.getReader();
}