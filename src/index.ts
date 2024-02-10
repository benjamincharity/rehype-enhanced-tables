import type { Root } from "hast";
import { type Plugin } from "unified";
import { visit } from "unist-util-visit";

import { addScopeToTh, addWrapper, injectCaption, injectFooter, mergeOptions } from "./utils.js";

export type RehypeEnhancedTableElementClasses = {
  [key: string]: string | undefined;
  caption: string;
  tfoot: string;
  table: string;
  tbody: string;
  td: string;
  th: string;
  thead: string;
  tr: string;
  wrapper: string;
};

export type RehypeEnhancedTableSettings = {
  disableWrapper: boolean;
  classes: Partial<RehypeEnhancedTableElementClasses>;
};

export type RehypeEnhancedTableSettingsRequired = {
  disableWrapper: boolean;
  classes: RehypeEnhancedTableElementClasses;
};

export const rehypeEnhancedTables: Plugin<[Partial<RehypeEnhancedTableSettings>?], Root> = (options = {}) => {
  const settings = mergeOptions(options);

  return (tree) => {
    addScopeToTh(tree);

    visit(tree, "element", (node, index, parent) => {
      let captionWasFound = false;
      if (node.tagName === "table" && index !== undefined && index !== null && Boolean(parent)) {
        if (parent) {
          captionWasFound = injectCaption(node, index, parent, tree, settings);
        }

        // Add classes to the table
        node.properties = {
          ...node.properties,
          className: settings.classes.table,
        };

        // Add classes to the table's child elements
        visit(node, "element", (childNode, index, parentNode) => {
          if (childNode.tagName) {
            childNode.properties = {
              ...childNode.properties,
              className: settings.classes[childNode.tagName],
            };
          }
        });

        if (parent) {
          injectFooter(node, index, parent, tree, settings);
          addWrapper(node, index, parent, settings, captionWasFound);
        }
      }
    });
  };
};

export default rehypeEnhancedTables;
