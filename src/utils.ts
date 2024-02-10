import { type Element, type Root } from "hast";
import { selectAll } from "hast-util-select";
import { remove } from "unist-util-remove";

import { type RehypeEnhancedTableSettings, type RehypeEnhancedTableSettingsRequired } from "./index.js";

const defaultOptions: RehypeEnhancedTableSettingsRequired = {
  disableWrapper: false,
  classes: {
    caption: "ret-table-caption",
    tfoot: "ret-table-tfoot",
    table: "ret-table",
    tbody: "ret-table-body",
    td: "ret-table-cell",
    th: "ret-table-th",
    thead: "ret-table-thead",
    tr: "ret-table-row",
    wrapper: "ret-table-wrapper",
  },
};

export function mergeOptions(
  userOptions: Partial<RehypeEnhancedTableSettings> = {}
): RehypeEnhancedTableSettingsRequired {
  return {
    ...defaultOptions,
    ...userOptions,
    classes: {
      ...defaultOptions.classes,
      ...userOptions.classes,
    },
  };
}

export function injectCaption(
  node: Element,
  index: number,
  parent: Element | Root,
  tree: Root,
  settings: RehypeEnhancedTableSettingsRequired
): boolean {
  // Caption
  let captionWasFound = false;
  let captionIndex = index - 1;
  let previousNode = parent.children[captionIndex];
  while (previousNode && previousNode.type === "text" && previousNode.value === "\n") {
    captionIndex--;
    previousNode = parent.children[captionIndex];
  }

  if (previousNode && previousNode.type === "comment") {
    const match = /^caption:\s*(.*)$/.exec(previousNode.value.trim());
    if (match) {
      captionWasFound = true;
      const caption: Element = {
        type: "element",
        tagName: "caption",
        properties: {
          className: settings.classes.caption,
        },
        children: [{ type: "text", value: match[1] }],
      };

      // Prepend the caption to the table
      node.children.unshift(caption);

      // Remove the original caption comment from the DOM
      remove(tree, previousNode);
      return true;
    }
  }

  return false;
}

export function injectFooter(
  node: Element,
  index: number,
  parent: Element | Root,
  tree: Root,
  settings: RehypeEnhancedTableSettingsRequired
): void {
  let footerIndex = index + 1;
  let nextNode = parent.children[footerIndex];
  // Skip over newline nodes
  while (nextNode && nextNode.type === "text" && nextNode.value === "\n") {
    footerIndex++;
    nextNode = parent.children[footerIndex];
  }

  if (nextNode && nextNode.type === "comment") {
    const match = /^footer:\s*(.*)$/.exec(nextNode.value.trim());
    if (match) {
      const footerTexts = match[1].split("|");
      const footerCells: Element[] = footerTexts.map((text) => {
        const trimmedText = text.trim();
        const cellValue = trimmedText === "_" ? "" : trimmedText;
        return {
          type: "element",
          tagName: "td",
          properties: {
            className: settings.classes.td,
          },
          children: [{ type: "text", value: cellValue }],
        };
      });

      const footerRow: Element = {
        type: "element",
        tagName: "tr",
        properties: {
          className: settings.classes.tr,
        },
        children: footerCells,
      };

      const footer: Element = {
        type: "element",
        tagName: "tfoot",
        properties: {
          className: settings.classes.tfoot,
        },
        children: [footerRow],
      };

      // Append the footer to the table
      node.children.push(footer);
      remove(tree, nextNode);
    }
  }
}

export function addWrapper(
  node: Element,
  index: number,
  parent: Element | Root,
  settings: RehypeEnhancedTableSettingsRequired,
  captionWasFound: boolean
): void {
  if (!settings.disableWrapper) {
    const wrapper: Element = {
      type: "element",
      tagName: "div",
      properties: {
        className: settings.classes.wrapper,
      },
      children: [node],
    };

    const indexToReplace = captionWasFound ? index - 1 : index;
    parent.children[indexToReplace] = wrapper;
  }
}

export function addScopeToTh(tree: Root) {
  const allTh = selectAll("thead tr th", tree);
  allTh.map((th) => {
    th.properties = {
      scope: "col",
      ...th.properties,
    };
    return th;
  });
}
