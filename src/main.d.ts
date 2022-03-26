import type { Plugin } from 'postcss';

export function cssDeclarationSorter({ order, keepOverrides }: Options): Plugin;

interface Options {
  /**
  Provide the name of one of the built-in sort orders or a comparison function that is passed to `Array.sort`.

  @default 'alphabetical'
  */
  order?: SortOrder | SortFunction | undefined;

  /**
  To prevent breaking legacy CSS where shorthand declarations override longhand declarations. For example `animation-name: some; animation: greeting;` will be kept in this order.

  @default false
  */
  keepOverrides?: boolean;
}

type SortOrder = 'alphabetical' | 'concentric-css' | 'smacss';

/**
 * This function receives two declaration property names and is expected
 * to return -1, 0 or 1 depending on the wanted order.
 */
type SortFunction = (propertyNameA: string, propertyNameB: string) => -1 | 0 | 1;
