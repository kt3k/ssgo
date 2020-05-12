import { parse } from "https://cdn.pika.dev/html5parser@^1.1.0";

import { buildHtml } from "../build.ts";
import { serialize } from "../ssgo.ts";
import { INode, IContextData } from "../types.ts";

export async function buildHtmlAndSerialize(
  templateStr: string,
  data: IContextData
): Promise<string> {
  const parsed = parse(templateStr).reverse();

  for (const node of parsed) {
    (node as INode).parent = parsed;
    await buildHtml(
      node,
      data,
      [],
      () => {},
      () => {}
    ).catch((e) => {
      throw Error(e);
    });
  }

  return parsed
    .reverse()
    .map((node: INode) => serialize(node).trim())
    .join("");
}
