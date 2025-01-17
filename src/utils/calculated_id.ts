export const calculate_id = (active_row: number, active_column: number, column_count: number): number => {
    return (active_row * column_count) + active_column;
}