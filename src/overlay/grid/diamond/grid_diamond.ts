import { TileContainerCoordinate } from "../../../types";
import { DiamondCord, UNKNOWN_CORD } from "./diamond_properties";

export default class GridDiamond {
    private container_width: number;
    private container_height: number;
    private tile_size: number;
    private row_count: number;
    private column_count: number;

    constructor(container_width: number, container_height: number, tile_size: number, row_count: number, column_count: number) {
        this.container_width = container_width;
        this.container_height = container_height;
        this.tile_size = tile_size;
        this.row_count = row_count;
        this.column_count = column_count;
    }

    public calculate_coordinates(x_position: number, y_position: number): Map<string, TileContainerCoordinate> {
        // Determine active location
        const active_container_column = Math.trunc(x_position / this.container_width);
        const active_tile_column = Math.trunc((x_position % this.container_width) / this.tile_size);
        const active_container_row = Math.trunc(y_position / this.container_height);
        const active_tile_row = Math.trunc((y_position % this.container_height) / this.tile_size);
        // Method to create internal coordiantes
        const create_coordinate = (
            container_column_offset: number,
            tile_column_offset: number,
            container_row_offset: number,
            tile_row_offset: number
        ): TileContainerCoordinate => ({
            container_column: active_container_column + container_column_offset,
            tile_column: active_tile_column + tile_column_offset,
            container_row: active_container_row + container_row_offset,
            tile_row: active_tile_row + tile_row_offset,
        });
        // Create internal coordinates
        const coordinates: Map<string, TileContainerCoordinate> = new Map<string, TileContainerCoordinate>([
            [DiamondCord.ACTIVE, create_coordinate(0, 0, 0, 0)],
            [DiamondCord.LOWER_PRIMARY, create_coordinate(0, 0, 0, 1)],
            [DiamondCord.UPPER_PRIMARY, create_coordinate(0, 0, 0, -1)],
            [DiamondCord.RIGHT_PRIMARY, create_coordinate(0, 1, 0, 0)],
            [DiamondCord.LEFT_PRIMARY, create_coordinate(0, -1, 0, 0)],
            [DiamondCord.LOWER_SECONDARY, create_coordinate(0, 0, 0, 2)],
            [DiamondCord.UPPER_SECONDARY, create_coordinate(0, 0, 0, -2)],
            [DiamondCord.RIGHT_SECONDARY, create_coordinate(0, 2, 0, 0)],
            [DiamondCord.LEFT_SECONDARY, create_coordinate(0, -2, 0, 0)],
            [DiamondCord.LOWER_RIGHT_SECONDARY, create_coordinate(0, 1, 0, 1)],
            [DiamondCord.LOWER_LEFT_SECONDARY, create_coordinate(0, -1, 0, 1)],
            [DiamondCord.UPPER_RIGHT_SECONDARY, create_coordinate(0, 1, 0, -1)],
            [DiamondCord.UPPER_LEFT_SECONDARY, create_coordinate(0, -1, 0, -1)],
            [DiamondCord.UPPER_TERTIARY, create_coordinate(0, 0, 0, -3)],
            [DiamondCord.LOWER_TERTIARY, create_coordinate(0, 0, 0, 3)],
            [DiamondCord.RIGHT_TERTIARY, create_coordinate(0, 3, 0, 0)],
            [DiamondCord.LEFT_TERTIARY, create_coordinate(0, -3, 0, 0)],
            [DiamondCord.UPPER_RIGHT_TERTIARY, create_coordinate(0, 1, 0, -2)],
            [DiamondCord.UPPER_LEFT_TERTIARY, create_coordinate(0, -1, 0, -2)],
            [DiamondCord.LEFT_UPPER_TERTIARY, create_coordinate(0, -2, 0, -1)],
            [DiamondCord.RIGHT_UPPER_TERTIARY, create_coordinate(0, 2, 0, -1)],
            [DiamondCord.RIGHT_LOWER_TERTIARY, create_coordinate(0, 2, 0, 1)],
            [DiamondCord.LEFT_LOWER_TERTIARY, create_coordinate(0, -2, 0, 1)],
            [DiamondCord.LOWER_RIGHT_TERTIARY, create_coordinate(0, 1, 0, 2)],
            [DiamondCord.LOWER_LEFT_TERTIARY, create_coordinate(0, -1, 0, 2)]
        ]);
        this.adjust_for_borders(coordinates, active_tile_row, active_tile_column);
        return coordinates;
    }

    private adjust_for_borders(coordinates: Map<string, TileContainerCoordinate>, active_tile_row: number, active_tile_column: number): void {
        // Check border distances
        const is_direct_border =
            active_tile_row === 0 ||
            active_tile_row === this.row_count - 1 ||
            active_tile_column === 0 ||
            active_tile_column === this.column_count - 1;
        const is_border_one_away =
            active_tile_row === 1 ||
            active_tile_row === this.row_count - 2 ||
            active_tile_column === 1 ||
            active_tile_column === this.column_count - 2;
        const is_border_two_away =
            active_tile_row === 2 ||
            active_tile_row === this.row_count - 3 ||
            active_tile_column === 2 ||
            active_tile_column === this.column_count - 3;
        // Adjust for border detection
        if (is_direct_border) {
            this.adjust_direct_border(coordinates, active_tile_row, active_tile_column);
        }
        if (is_border_one_away) {
            this.adjust_border_one_away(coordinates, active_tile_row, active_tile_column);
        }
        if (is_border_two_away) {
            this.adjust_border_two_away(coordinates, active_tile_row, active_tile_column);
        }
    }

    private adjust_direct_border(coordinates: Map<string, TileContainerCoordinate>, active_tile_row: number, active_tile_column: number): void {
        // Top tile adjustments
        if(active_tile_row == 0) {        
            // Primary adjustments
            const upper_primary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_PRIMARY)??UNKNOWN_CORD;
            upper_primary.container_row -= 1;
            upper_primary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.UPPER_PRIMARY, upper_primary);
            // Secondary adjustments
            const upper_left_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_LEFT_SECONDARY)??UNKNOWN_CORD; 
            upper_left_secondary.container_row -= 1;
            upper_left_secondary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.UPPER_LEFT_SECONDARY, upper_left_secondary);
            const upper_right_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_RIGHT_SECONDARY)??UNKNOWN_CORD;
            upper_right_secondary.container_row -= 1;
            upper_right_secondary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.UPPER_RIGHT_SECONDARY, upper_right_secondary);
            const upper_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_SECONDARY)??UNKNOWN_CORD;
            upper_secondary.container_row -= 1;
            upper_secondary.tile_row = this.row_count - 2;
            coordinates.set(DiamondCord.UPPER_SECONDARY, upper_secondary);
            // Tertiary adjustments
            const left_upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_UPPER_TERTIARY)??UNKNOWN_CORD;
            left_upper_tertiary.container_row -= 1;
            left_upper_tertiary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.LEFT_UPPER_TERTIARY, left_upper_tertiary);
            const right_upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_UPPER_TERTIARY)??UNKNOWN_CORD;
            right_upper_tertiary.container_row -= 1;
            right_upper_tertiary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.RIGHT_UPPER_TERTIARY, right_upper_tertiary);
            const upper_left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_LEFT_TERTIARY)??UNKNOWN_CORD;
            upper_left_tertiary.container_row -= 1;
            upper_left_tertiary.tile_row = this.row_count - 2;
            coordinates.set(DiamondCord.UPPER_LEFT_TERTIARY, upper_left_tertiary);
            const upper_right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_RIGHT_TERTIARY)??UNKNOWN_CORD;
            upper_right_tertiary.container_row -= 1;
            upper_right_tertiary.tile_row = this.row_count - 2;
            coordinates.set(DiamondCord.UPPER_RIGHT_TERTIARY, upper_right_tertiary);
            const upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_TERTIARY)??UNKNOWN_CORD;
            upper_tertiary.container_row -= 1;
            upper_tertiary.tile_row = this.row_count - 3;
            coordinates.set(DiamondCord.UPPER_TERTIARY, upper_tertiary);
        }
        // Bottom border adjustments
        if(active_tile_row == this.row_count - 1) {
            const lower_primary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_PRIMARY)??UNKNOWN_CORD;
            lower_primary.container_row += 1;
            lower_primary.tile_row = 0;
            coordinates.set(DiamondCord.LOWER_PRIMARY, lower_primary);
            // Secondary adjustments
            const lower_left_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_LEFT_SECONDARY)??UNKNOWN_CORD;
            lower_left_secondary.container_row += 1;
            lower_left_secondary.tile_row = 0;
            coordinates.set(DiamondCord.LOWER_LEFT_SECONDARY, lower_left_secondary);
            const lower_right_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_RIGHT_SECONDARY)??UNKNOWN_CORD;
            lower_right_secondary.container_row += 1;
            lower_right_secondary.tile_row = 0;
            coordinates.set(DiamondCord.LOWER_RIGHT_SECONDARY, lower_right_secondary);
            const lower_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_SECONDARY)??UNKNOWN_CORD;
            lower_secondary.container_row += 1;
            lower_secondary.tile_row = 1;
            coordinates.set(DiamondCord.LOWER_SECONDARY, lower_secondary);
            // Tertiary adjustments
            const left_lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_LOWER_TERTIARY)??UNKNOWN_CORD;
            left_lower_tertiary.container_row += 1;
            left_lower_tertiary.tile_row = 0;
            coordinates.set(DiamondCord.LEFT_LOWER_TERTIARY, left_lower_tertiary);
            const right_lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_LOWER_TERTIARY)??UNKNOWN_CORD;
            right_lower_tertiary.container_row += 1;
            right_lower_tertiary.tile_row = 0;
            coordinates.set(DiamondCord.RIGHT_LOWER_TERTIARY, right_lower_tertiary);
            const lower_left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_LEFT_TERTIARY)??UNKNOWN_CORD;
            lower_left_tertiary.container_row += 1;
            lower_left_tertiary.tile_row = 1;
            coordinates.set(DiamondCord.LOWER_LEFT_TERTIARY, lower_left_tertiary);
            const lower_right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_RIGHT_TERTIARY)??UNKNOWN_CORD;
            lower_right_tertiary.container_row += 1;
            lower_right_tertiary.tile_row = 1;
            coordinates.set(DiamondCord.LOWER_RIGHT_TERTIARY, lower_right_tertiary);
            const lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_TERTIARY)??UNKNOWN_CORD;
            lower_tertiary.container_row += 1;
            lower_tertiary.tile_row = 2;
            coordinates.set(DiamondCord.LOWER_TERTIARY, lower_tertiary);
        }
        // Left border adjustments
        if(active_tile_column == 0) {
            const left_primary = coordinates.get(DiamondCord.LEFT_PRIMARY)??UNKNOWN_CORD;
            left_primary.container_column -= 1;
            left_primary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.LEFT_PRIMARY, left_primary);
            // Secondary adjustments
            const upper_left_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_LEFT_SECONDARY)??UNKNOWN_CORD;
            upper_left_secondary.container_column -= 1;
            upper_left_secondary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.UPPER_LEFT_SECONDARY, upper_left_secondary);
            const lower_left_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_LEFT_SECONDARY)??UNKNOWN_CORD;
            lower_left_secondary.container_column -= 1;
            lower_left_secondary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.LOWER_LEFT_SECONDARY, lower_left_secondary);
            const left_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_SECONDARY)??UNKNOWN_CORD;
            left_secondary.container_column -= 1;
            left_secondary.tile_column = this.column_count - 2;
            // Tertiary adjustments
            const lower_left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_LEFT_TERTIARY)??UNKNOWN_CORD;
            lower_left_tertiary.container_column -= 1;
            lower_left_tertiary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.LOWER_LEFT_TERTIARY, lower_left_tertiary);
            const upper_left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_LEFT_TERTIARY)??UNKNOWN_CORD;
            upper_left_tertiary.container_column -= 1;
            upper_left_tertiary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.UPPER_LEFT_TERTIARY, upper_left_tertiary);
            const left_upper_tertiary:TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_UPPER_TERTIARY)??UNKNOWN_CORD;
            left_upper_tertiary.container_column -= 1;
            left_upper_tertiary.tile_column = this.column_count - 2;
            coordinates.set(DiamondCord.LEFT_UPPER_TERTIARY, left_upper_tertiary);
            const left_lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_LOWER_TERTIARY)??UNKNOWN_CORD;
            left_lower_tertiary.container_column -= 1;
            left_lower_tertiary.tile_column = this.column_count - 2;
            coordinates.set(DiamondCord.LEFT_LOWER_TERTIARY, left_lower_tertiary);
            const left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_TERTIARY)??UNKNOWN_CORD;
            left_tertiary.container_column -= 1;
            left_tertiary.tile_column = this.column_count - 3;
            coordinates.set(DiamondCord.LEFT_TERTIARY, left_tertiary);
        }
        // Right border adjustments
        if(active_tile_column == this.column_count - 1) {
            const right_primary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_PRIMARY)??UNKNOWN_CORD;
            right_primary.container_column += 1;
            right_primary.tile_column = 0;
            coordinates.set(DiamondCord.RIGHT_PRIMARY, right_primary);
            // Secondary adjustments
            const upper_right_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_RIGHT_SECONDARY)??UNKNOWN_CORD;
            upper_right_secondary.container_column += 1;
            upper_right_secondary.tile_column = 0;
            coordinates.set(DiamondCord.UPPER_RIGHT_SECONDARY, upper_right_secondary);
            const lower_right_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_RIGHT_SECONDARY)??UNKNOWN_CORD;
            lower_right_secondary.container_column += 1;
            lower_right_secondary.tile_column = 0;
            coordinates.set(DiamondCord.LOWER_RIGHT_SECONDARY, lower_right_secondary);
            const right_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_SECONDARY)??UNKNOWN_CORD;
            right_secondary.container_column += 1;
            right_secondary.tile_column = 1;
            coordinates.set(DiamondCord.RIGHT_SECONDARY, right_secondary);
            // Tertiary adjustments
            const lower_right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_RIGHT_TERTIARY)??UNKNOWN_CORD;
            lower_right_tertiary.container_column += 1;
            lower_right_tertiary.tile_column = 0;
            coordinates.set(DiamondCord.LOWER_RIGHT_TERTIARY, lower_right_tertiary);
            const upper_right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_RIGHT_TERTIARY)??UNKNOWN_CORD;
            upper_right_tertiary.container_column += 1;
            upper_right_tertiary.tile_column = 0;
            coordinates.set(DiamondCord.UPPER_RIGHT_TERTIARY, upper_right_tertiary);
            const right_upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_UPPER_TERTIARY)??UNKNOWN_CORD;
            right_upper_tertiary.container_column += 1;
            right_upper_tertiary.tile_column = 1;
            coordinates.set(DiamondCord.RIGHT_UPPER_TERTIARY, right_upper_tertiary);
            const right_lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_LOWER_TERTIARY)??UNKNOWN_CORD;
            right_lower_tertiary.container_column += 1;
            right_lower_tertiary.tile_column = 1;
            coordinates.set(DiamondCord.RIGHT_LOWER_TERTIARY, right_lower_tertiary);
            const right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_TERTIARY)??UNKNOWN_CORD;
            right_tertiary.container_column += 1;
            right_tertiary.tile_column = 2;
            coordinates.set(DiamondCord.RIGHT_TERTIARY, right_tertiary);
        }
    }

    private adjust_border_one_away(coordinates: Map<string, TileContainerCoordinate>, active_tile_row: number, active_tile_column: number): void {
        // Top border adjustments
        if(active_tile_row == 1) {
            // Secondary adjustments
            const upper_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_SECONDARY)??UNKNOWN_CORD;
            upper_secondary.container_row -= 1;
            upper_secondary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.UPPER_SECONDARY, upper_secondary);
            // Tertiary adjustments
            const upper_left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_LEFT_TERTIARY)??UNKNOWN_CORD;
            upper_left_tertiary.container_row -= 1;
            upper_left_tertiary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.UPPER_LEFT_TERTIARY, upper_left_tertiary);
            const upper_right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_RIGHT_TERTIARY)??UNKNOWN_CORD;
            upper_right_tertiary.container_row -= 1;
            upper_right_tertiary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.UPPER_RIGHT_TERTIARY, upper_right_tertiary);
            const upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_TERTIARY)??UNKNOWN_CORD;
            upper_tertiary.container_row -= 1;
            upper_tertiary.tile_row = this.row_count - 2;
            coordinates.set(DiamondCord.UPPER_TERTIARY, upper_tertiary);
        }
        // Bottom border adjustments
        if(active_tile_row == this.row_count - 2) {
            // Secondary adjustments
            const lower_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_SECONDARY)??UNKNOWN_CORD;
            lower_secondary.container_row += 1;
            lower_secondary.tile_row = 0;
            coordinates.set(DiamondCord.LOWER_SECONDARY, lower_secondary);
            // Tertiary adjustments
            const lower_left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_LEFT_TERTIARY)??UNKNOWN_CORD;
            lower_left_tertiary.container_row += 1;
            lower_left_tertiary.tile_row = 0;
            coordinates.set(DiamondCord.LOWER_LEFT_TERTIARY, lower_left_tertiary);
            const lower_right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_RIGHT_TERTIARY)??UNKNOWN_CORD;
            lower_right_tertiary.container_row += 1;
            lower_right_tertiary.tile_row = 0;
            coordinates.set(DiamondCord.LOWER_RIGHT_TERTIARY, lower_right_tertiary);
            const lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_TERTIARY)??UNKNOWN_CORD;
            lower_tertiary.container_row += 1;
            lower_tertiary.tile_row = 1;
            coordinates.set(DiamondCord.LOWER_TERTIARY, lower_tertiary);
        }
        // Left border adjustments
        if(active_tile_column == 1) {
            // Secondary adjustments
            const left_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_SECONDARY)??UNKNOWN_CORD;
            left_secondary.container_column -= 1;
            left_secondary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.LEFT_SECONDARY, left_secondary);
            // Tertiary adjustments
            const left_upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_UPPER_TERTIARY)??UNKNOWN_CORD;
            left_upper_tertiary.container_column -= 1;
            left_upper_tertiary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.LEFT_UPPER_TERTIARY, left_upper_tertiary);
            const left_lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_LOWER_TERTIARY)??UNKNOWN_CORD;
            left_lower_tertiary.container_column -= 1;
            left_lower_tertiary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.LEFT_LOWER_TERTIARY, left_lower_tertiary);
            const left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_TERTIARY)??UNKNOWN_CORD;
            left_tertiary.container_column -= 1;
            left_tertiary.tile_column = this.column_count - 2;
            coordinates.set(DiamondCord.LEFT_TERTIARY, left_tertiary);
        }
        // Right border adjustments
        if(active_tile_column == this.column_count - 2) {
            // Secondary adjustments
            const right_secondary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_SECONDARY)??UNKNOWN_CORD;
            right_secondary.container_column += 1;
            right_secondary.tile_column = 0;
            coordinates.set(DiamondCord.RIGHT_SECONDARY, right_secondary);
            // Tertiary adjustments
            const right_upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_UPPER_TERTIARY)??UNKNOWN_CORD;
            right_upper_tertiary.container_column += 1;
            right_upper_tertiary.tile_column = 0;
            coordinates.set(DiamondCord.RIGHT_UPPER_TERTIARY, right_upper_tertiary);
            const right_lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_LOWER_TERTIARY)??UNKNOWN_CORD;
            right_lower_tertiary.container_column += 1;
            right_lower_tertiary.tile_column = 0;
            coordinates.set(DiamondCord.RIGHT_LOWER_TERTIARY, right_lower_tertiary);
            const right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_TERTIARY)??UNKNOWN_CORD;
            right_tertiary.container_column += 1;
            right_tertiary.tile_column = 1;
            coordinates.set(DiamondCord.RIGHT_TERTIARY, right_tertiary);
        }
    }

    private adjust_border_two_away(coordinates: Map<string, TileContainerCoordinate>, active_tile_row: number, active_tile_column: number): void {
        // Top border adjustments
        if(active_tile_row == 2) {
            // Tertiary adjustments
            const upper_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.UPPER_TERTIARY)??UNKNOWN_CORD;
            upper_tertiary.container_row -= 1;
            upper_tertiary.tile_row = this.row_count - 1;
            coordinates.set(DiamondCord.UPPER_TERTIARY, upper_tertiary);
        }
        // Bottom border adjustments
        if(active_tile_row == this.row_count - 3) {
            // Tertiary adjustments
            const lower_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LOWER_TERTIARY)??UNKNOWN_CORD;
            lower_tertiary.container_row += 1;
            lower_tertiary.tile_row = 0;
            coordinates.set(DiamondCord.LOWER_TERTIARY, lower_tertiary);
        }
        // Left border adjustments
        if(active_tile_column == 2) {
            // Tertiary adjustments
            const left_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.LEFT_TERTIARY)??UNKNOWN_CORD;
            left_tertiary.container_column -= 1;
            left_tertiary.tile_column = this.column_count - 1;
            coordinates.set(DiamondCord.LEFT_TERTIARY, left_tertiary);
        }
        // Right border adjustments
        if(active_tile_column == this.column_count - 3) {
            // Tertiary adjustments
            const right_tertiary: TileContainerCoordinate = coordinates.get(DiamondCord.RIGHT_TERTIARY)??UNKNOWN_CORD;
            right_tertiary.container_column += 1;
            right_tertiary.tile_column = 0;
            coordinates.set(DiamondCord.RIGHT_TERTIARY, right_tertiary);
        }
    }
}
