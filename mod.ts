
import type { Callback, FetchEvent, Method, Rule, Path } from './types.ts'

const createReg = (str: string, customReg?: RegExp) => {
  let r = customReg || /{(.*?)}/g;
  let matches = [...str.matchAll(r)];
  let params: string[] = [];
  matches.forEach((m) => {
    str = str.replace(m[0], "(.*)");
    params.push(m[1]);
  });

  let reg = new RegExp(`^${str}$`);

  const matcher = (path: string) => {
    let m = reg.exec(path)?.slice(1);
    let result: any = {};
    m?.forEach((match, index) => {
      result[params[index]] = match;
    });
    return result;
  };

  return {
    regex: reg,
    match: matcher,
  };
};


class Fetcher {
  rules: Rule[] = [];

  private makeRule(
    method: Method,
    path: Path,
    callbacks: Callback[],
    extra?: any,
  ) {
    this.rules.push({
      method,
      path,
      callbacks,
      extra,
    });
  }

  constructor() {
  }

  get(route: string, ...callbacks: Callback[]) {
    this.rules.push({
      method: "GET",
      path: createReg(route),
      callbacks,
    });
  }

  handle(event: FetchEvent) {
    let matched = false,
        method = event.request.method,
        path = new URL(event.request.url).pathname;
    
    this.rules.forEach((rule) => {
      if (
        method == rule.method
      ) {
        //method matched
        if (rule.path.regex.exec(path) && !matched) {
          rule.callbacks.map((cb) => cb(event));
          matched = true
        }
      }
    });
    if(!matched){
        let res = new Response(`Cannot ${method} ${path}`,{
            status : 404,
        })
        res.headers.append('x-p', 'me')

        event.respondWith(res)
        
    }
  }
}



export default Fetcher