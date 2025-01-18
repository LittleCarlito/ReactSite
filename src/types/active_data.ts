import { TileCoordinate } from "./coordinates"

export type ActiveData = {
    mouse_tile?: TileCoordinate;
    activated_tiles?: Array<TileCoordinate>;
    primary_tiles?: Array<TileCoordinate>;
    secondary_tiles?: Array<TileCoordinate>;
    tertiary_tiles?: Array<TileCoordinate>;
}