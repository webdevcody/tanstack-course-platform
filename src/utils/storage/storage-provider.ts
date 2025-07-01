export interface IStorageProvider {
  upload(key: string, data: Buffer): Promise<void>;
  delete(key: string): Promise<void>;
  getStream(key: string, range?: StreamFileRange): Promise<StreamFileResponse>;
  combineChunks(finalKey: string, partKeys: string[]): Promise<void>;
}

export type StreamFileRange = Partial<{
  start: number;
  end: number;
}>;

type StreamFileResponse = {
  stream: ReadableStream;
  contentLength: number;
  contentType: string;
  contentRange?: string;
};
