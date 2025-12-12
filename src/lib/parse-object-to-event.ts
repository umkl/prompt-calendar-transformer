export default function parseObjectToEvent(obj: unknown): pct.Event | null {
  if (!obj || typeof obj !== 'object') return null;
  
  const { id, title, start, end} = obj as { id: unknown; title: unknown; start: unknown; end: unknown };
  if (typeof id !== 'string' || typeof title !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
    return null;
  }
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return null;
  }

  return {
    id,
    title,
    start: startDate,
    end: endDate,
  };

}