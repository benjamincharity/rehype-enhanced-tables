# rehype-enhanced-tables

![test workflow](https://github.com/benjamincharity/rehype-enhanced-tables/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/benjamincharity/rehype-enhanced-tables/branch/main/graph/badge.svg?token=T3Z18P56LV)](https://codecov.io/gh/benjamincharity/rehype-enhanced-tables)
![NPM Version](https://img.shields.io/npm/v/@benjc/rehype-enhanced-tables)

A Rehype plugin that modifies HTML tables, with support for caption, footer, custom classes, scroll-wrappers, and scopes.

## Install

```
npm i -D @benjc/rehype-enhanced-tables
```

## Usage

```typescript
import rehypeEnhancedTables from "@benjc/rehype-enhanced-tables";
import rehype from "rehype";
import rehypeParse from "rehype-parse";
import { unified } from "unified";

const tableStruct = `
| heading | b  |  c |  d  |
| -: | -: | -: | :-: |
| cell 1 | cell 2 | 3 | 4 |
`;

unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeEnhancedTables)
  .process(tableStruct);

// Or with options:
unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeEnhancedTables, {
    disableWrapper: true,
    classes: {
      table: "custom-class",
      cell: "custom-cell",
      ...
    },
  })
  .process(tableStruct);
```

### Input

```html
<table>
  <thead>
    <tr>
      <th>One</th>
      <th>Two</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </tr>
    <tr>
      <td>Cell 3</td>
      <td>Cell 4</td>
    </tr>
  </tbody>
</table>
```

### Output

```html
<div class="ret-table-wrapper">
  <table class="ret-table">
    <thead class="ret-table-thead">
      <tr class="ret-table-row">
        <th scope="col" class="ret-table-th">One</th>
        <th scope="col" class="ret-table-th">Two</th>
      </tr>
    </thead>
    <tbody class="ret-table-body">
      <tr class="ret-table-row">
        <td class="ret-table-cell">Cell 1</td>
        <td class="ret-table-cell">Cell 2</td>
      </tr>
      <tr class="ret-table-row">
        <td class="ret-table-cell">Cell 3</td>
        <td class="ret-table-cell">Cell 4</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Options

The `rehype-enhanced-tables` plugin accepts an `options` object with the following properties:

| Option           | Type                                         | Description                                                                                                                                                          |
| ---------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disableWrapper` | `boolean`                                    | If set to `true`, the plugin will not wrap the table with a div.                                                                                                     |
| `classes`        | `Partial<RehypeEnhancedTableElementClasses>` | An object that maps element types to class names. The keys can be any of the following: `caption`, `footer`, `table`, `tbody`, `td`, `th`, `thead`, `tr`, `wrapper`. |

These options can be passed to the `rehype-enhanced-tables` plugin as part of the `options` object. For example:

```typescript
import rehypeEnhancedTables from "./index";

rehypeEnhancedTables({
  disableWrapper: true,
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
```

## License

[MIT][license] © [benjamincharity][author]

[license]: license
[author]: https://www.benjamincharity.com
