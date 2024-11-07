import http, { Agent } from "http";
import path from "path";
import fetch, { RequestInit, RequestInfo } from "node-fetch";

export function getProxiedAgent(proxy?: string) {
  if (proxy !== undefined && !proxy.startsWith("http://") && !proxy.startsWith("https://")) {
    let socketPath = proxy;
    if (socketPath.startsWith("unix://")) {
      socketPath = proxy.slice("unix://".length);
    }
    if (socketPath.startsWith("~/") && process.env.HOME !== undefined) {
      socketPath = path.join(process.env.HOME, socketPath.slice(2));
    }
    return new Agent({ socketPath } as unknown as http.AgentOptions);
  }
  return http.globalAgent;
}

export function getProxiedFetch(proxy?: string): typeof fetch {
  const agent = getProxiedAgent(proxy);
  return (info: URL | RequestInfo, init?: RequestInit) => {
    return fetch(info, { ...init, agent } as RequestInit);
  };
}
