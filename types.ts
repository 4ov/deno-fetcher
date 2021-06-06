interface FetchEvent {
  request: Request;
  respondWith(...a: any): any;
}

interface Path {
  regex: RegExp;
  match(path: string): object;
}

type Method = "GET" | "POST";

interface Rule {
  method: Method;
  path: Path;
  callbacks: Callback[];
  extra?: {
    params: string[];
  };
}

type Callback = (event: FetchEvent) => void;


export type{
    FetchEvent,
    Path,
    Method,
    Rule,
    Callback
}