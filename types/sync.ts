export type QueueItem = {
  id: string;
  type: "ADD" | "REMOVE";
  payload: any;
};