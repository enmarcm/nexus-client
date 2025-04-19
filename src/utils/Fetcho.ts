type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchoParams {
  url: string;
  method?: HttpMethod;
  body?: Record<string, unknown>;
  isCors?: boolean;
  token?: string;
  credentials?: boolean;
  headers?: Record<string, string>;
}

const fetcho = async ({
  url,
  method = "GET",
  body,
  isCors = false,
  credentials = false,
  headers = {},
}: FetchoParams): Promise<Record<string, unknown> | false> => {
  try {
    const configToUse: any = {
      method,
      credentials: credentials ? "include" : "same-origin",
      cors: isCors ? "cors" : "no-cors",
      headers: {
        ...headers,
        "Content-Type": "application/json",

      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      configToUse.body = JSON.stringify(body);
    }

    const response = await fetch(url, configToUse);

    if (response.status === 500) {
      console.log(response);
      throw new Error(
        `La respuesta no es correcta, el status es ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error(
      `Ocurrió un error realizando un fetch, donde la url era ${url} y el error fue ${error.message}`
    );
    return false;
  }
};

export default fetcho;
