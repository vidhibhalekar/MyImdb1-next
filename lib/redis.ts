export const redis = {
    async get(_: string) {
      return null;
    },
  
    async set(_: string, __: string, ___?: number) {
      return null;
    },
  
    async incr(_: string) {
      return 1; // fallback counter
    },
  
    async expire(_: string, __: number) {
      return null;
    },
  
    async publish(_: string, __: string) {
      return null;
    },
  
    async subscribe(_: string) {
      return null;
    },
  
    on(_: string, __: any) {
      return null;
    },
  };