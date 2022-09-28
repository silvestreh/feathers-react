declare module 'feathers-react' {
  import React from 'react';

  export interface PaginationProps {
    className?: string;
    current?: number;
    defaultCurrent?: number;
    defaultPageSize?: number;
    disabled?: boolean;
    hideOnSinglePage?: boolean;
    itemRender?: (page: number, type: 'page'|'prev'|'next'|'jump-prev'|'jump-next', originalElement: React.ReactNode) => React.ReactNode;
    jumpNextIcon?: React.ReactNode | ((props:PaginationProps) => React.ReactNode);
    jumpPrevIcon?: React.ReactNode | ((props:PaginationProps) => React.ReactNode);
    nextIcon?: React.ReactNode | ((props:PaginationProps) => React.ReactNode);
    onChange?: (current: number, pageSize?: number) => void;
    onShowSizeChange?: (current: number, size: number) => void;
    pageSize?: number;
    pageSizeOptions?: string[];
    prevIcon?: React.ReactNode | ((props:PaginationProps) => React.ReactNode);
    showLessItems?: boolean;
    showPrevNextJumpers?: boolean;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
    showTitle?: boolean;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
    simple?: object|null;
    style?: React.CSSProperties;
    total?: number;
    totalBoundaryShowSizeChanger?: number;
  }

  export interface ColumnProps {
    dataSource?: string;
    render?: (value: any, record: any) => React.ReactNode;
    title?: string;
    width?: number|string;
  }

  export interface TableProps {
    children?: React.ReactNode;
    countTemplate?: string;
    keyProp?: string;
    language?: 'en_US' | 'fr_FR' | 'es_ES';
    onDataChange?: (data: any) => void;
    onRowClick?: (record: any, index: number) => void;
    paginationProps?: PaginationProps;
    query?: object;
    service: any;
    sortable?: boolean;
    usePagination?: boolean;
  }

  export interface ContainerProps extends Omit<TableProps, 'onRowClick' | 'onDataChange'> {
    emptyState?: React.ReactNode;
    renderItem?: (item: any, index: number) => React.ReactNode;
    itemsWrapper?: React.ReactNode;
    separator?: (item: any) => React.ReactNode;
    hidePaginationOnSinglePage?: boolean;
  }

  export class Column extends React.Component<ColumnProps> {}
  export class Table extends React.Component<TableProps> {}
  export class Container extends React.Component<ContainerProps> {}
}
