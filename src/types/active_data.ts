import { TileCoordinate } from "./coordinates"

export type ActiveData = {
    active_tile?: TileCoordinate;
    primary_tiles?: Array<TileCoordinate>;
    secondary_tiles?: Array<TileCoordinate>;
    tertiary_tiles?: Array<TileCoordinate>;
}