import type { Element } from "hast";
import { toHtml } from "hast-util-to-html";
import { rehype } from "rehype";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import { readSync } from "to-vfile";
import { expect, test } from "vitest";

import { type RehypeEnhancedTableSettings, rehypeEnhancedTables } from "../src/index.js";

const planeProcessor = rehype().data("settings", { fragment: true }).use(rehypeMinifyWhitespace);

const run = (name: string, options: boolean | Partial<RehypeEnhancedTableSettings> = true) => {
  const processor = rehype()
    .data("settings", { fragment: true })
    .use(rehypeEnhancedTables, options)
    .use(rehypeMinifyWhitespace);

  const inputNode = processor.runSync(planeProcessor.parse(readSync(`./tests/fixtures/${name}/input.html`)));
  const input = toHtml(inputNode as unknown as Element);

  const outputNode = planeProcessor.runSync(planeProcessor.parse(readSync(`./tests/fixtures/${name}/output.html`)));
  const output = toHtml(outputNode as unknown as Element);

  test(name, () => {
    expect(input).toBe(output);
  });
};

run("basic");
run("custom-classes", {
  classes: {
    caption: "custom-caption",
    table: "custom-table",
    tbody: "custom-tbody",
    td: "custom-td",
    tfoot: "custom-tfoot",
    th: "custom-th",
    thead: "custom-thead",
    tr: "custom-tr",
    wrapper: "custom-wrapper",
  },
});
run("footer");
run("caption");
run("extra-content");
