## Purpose

Visualize LLM Prompt-Responses using a designated JSON Calendar Format.

## Usage

This frontend reads from the cloud worker at [round-darkness-ba56.smoov.tools](https://round-darkness-ba56.smoov.tools) which returns a Stream in newline delimited json. Set up your own service worker using your Model of preference and make sure it responds with chunks in the following format:

```
type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};
```

