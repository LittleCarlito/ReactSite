import { PanelCoordinate } from "./coordinates"

export type ActiveData = {
    active_tile: PanelCoordinate;
    primary_tiles: Array<PanelCoordinate>[];
    secondary_tiles: Array<PanelCoordinate>[];
    tertiary_tiles: Array<PanelCoordinate>[];
}