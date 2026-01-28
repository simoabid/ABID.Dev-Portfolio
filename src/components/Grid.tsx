import { type ReactNode } from 'react';

/**
 * Valid column counts for the grid system (1-12)
 */
type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Valid span values for grid items
 */
type SpanValue = ColumnCount | 'full';

/**
 * Gap size options (maps to Tailwind gap utilities)
 */
type GapSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

/**
 * Props for the Grid component
 */
interface GridProps {
  /** Default number of columns */
  cols?: ColumnCount;
  /** Columns at md breakpoint (768px+) */
  colsMd?: ColumnCount;
  /** Columns at lg breakpoint (1024px+) */
  colsLg?: ColumnCount;
  /** Gap between grid items */
  gap?: GapSize;
  /** Horizontal gap (overrides gap) */
  gapX?: GapSize;
  /** Vertical gap (overrides gap) */
  gapY?: GapSize;
  /** Additional CSS classes */
  className?: string;
  /** Grid content */
  children: ReactNode;
}

/**
 * Props for the GridItem component
 */
interface GridItemProps {
  /** Default column span */
  span?: SpanValue;
  /** Column span at md breakpoint */
  spanMd?: SpanValue;
  /** Column span at lg breakpoint */
  spanLg?: SpanValue;
  /** Additional CSS classes */
  className?: string;
  /** Item content */
  children: ReactNode;
}

/**
 * Generate grid-cols class based on column count
 */
const getColsClass = (cols: ColumnCount, prefix = ''): string => {
  const colsMap: Record<ColumnCount, string> = {
    1: `${prefix}grid-cols-1`,
    2: `${prefix}grid-cols-2`,
    3: `${prefix}grid-cols-3`,
    4: `${prefix}grid-cols-4`,
    5: `${prefix}grid-cols-5`,
    6: `${prefix}grid-cols-6`,
    7: `${prefix}grid-cols-7`,
    8: `${prefix}grid-cols-8`,
    9: `${prefix}grid-cols-9`,
    10: `${prefix}grid-cols-10`,
    11: `${prefix}grid-cols-11`,
    12: `${prefix}grid-cols-12`,
  };
  return colsMap[cols];
};

/**
 * Generate gap class based on size
 */
const getGapClass = (gap: GapSize, axis?: 'x' | 'y'): string => {
  const prefix = axis ? `gap-${axis}-` : 'gap-';
  return `${prefix}${gap}`;
};

/**
 * Generate span class based on value
 */
const getSpanClass = (span: SpanValue, prefix = ''): string => {
  if (span === 'full') {
    return `${prefix}col-span-full`;
  }
  const spanMap: Record<ColumnCount, string> = {
    1: `${prefix}col-span-1`,
    2: `${prefix}col-span-2`,
    3: `${prefix}col-span-3`,
    4: `${prefix}col-span-4`,
    5: `${prefix}col-span-5`,
    6: `${prefix}col-span-6`,
    7: `${prefix}col-span-7`,
    8: `${prefix}col-span-8`,
    9: `${prefix}col-span-9`,
    10: `${prefix}col-span-10`,
    11: `${prefix}col-span-11`,
    12: `${prefix}col-span-12`,
  };
  return spanMap[span];
};

/**
 * Responsive CSS Grid component with configurable columns and gaps.
 *
 * @example
 * ```tsx
 * <Grid cols={1} colsMd={2} colsLg={3} gap={6}>
 *   <GridItem>Item 1</GridItem>
 *   <GridItem>Item 2</GridItem>
 *   <GridItem spanLg={2}>Wide Item</GridItem>
 * </Grid>
 * ```
 */
export function Grid({
  cols = 1,
  colsMd,
  colsLg,
  gap = 6,
  gapX,
  gapY,
  className = '',
  children,
}: GridProps) {
  const classes = [
    'grid',
    getColsClass(cols),
    colsMd && getColsClass(colsMd, 'md:'),
    colsLg && getColsClass(colsLg, 'lg:'),
    gapX !== undefined ? getGapClass(gapX, 'x') : undefined,
    gapY !== undefined ? getGapClass(gapY, 'y') : undefined,
    gapX === undefined && gapY === undefined ? getGapClass(gap) : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

/**
 * Grid item with configurable column span at different breakpoints.
 *
 * @example
 * ```tsx
 * <GridItem span={1} spanMd={2} spanLg={3}>
 *   Responsive span content
 * </GridItem>
 * ```
 */
export function GridItem({
  span,
  spanMd,
  spanLg,
  className = '',
  children,
}: GridItemProps) {
  const classes = [
    span && getSpanClass(span),
    spanMd && getSpanClass(spanMd, 'md:'),
    spanLg && getSpanClass(spanLg, 'lg:'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes || undefined}>{children}</div>;
}

export default Grid;
