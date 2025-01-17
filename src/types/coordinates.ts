export type TileCoordinate = {
    tile_column: number;
    tile_row: number;
}

export type TileContainerCoordinate = TileCoordinate & {
    container_column: number;
    container_row: number;
}
