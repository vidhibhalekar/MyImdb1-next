export {};

declare global {
  interface SyncManager {
    register(tag: string): Promise<void>;
  }

  interface ServiceWorkerRegistration {
    sync?: SyncManager;
  }
}