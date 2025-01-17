export function resolove_id(col_index: number, row_index: number, col_count: number): number {
    return (row_index * col_count) + col_index;
}

export function resolve_container_id(container_column: number, container_row: number, container_column_count: number): string {
    return `${resolove_id(container_column, container_row, container_column_count)}-${container_column}${container_row}`;
}