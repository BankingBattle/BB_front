declare interface IZodiosError {
  cause?: {
    issues?: {
      path?: string[];
      // code: string;
      message?: string;
    }[];
  };
}

declare type FormError<T extends (...args: any) => any> =
  ReturnType<T> extends Promise<infer U>
    ? U extends Response
      ? never
      : U
    : never;
