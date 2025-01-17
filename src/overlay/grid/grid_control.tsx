import { useState, useEffect } from 'react';
import GridContainer from './grid_container';
import { TileContainerCoordinate, TileCoordinate, ActiveData } from '../../types';
import './grid.css'
import { calculate_id } from '../../utils';

type GridControlProps = {
    x_position: number;
    y_position: number;
}

enum LEVEL {
    ACTIVE,
    PRIMARY,
    SECONDARY,
    TERTIARY
}

export default function GridControl( {x_position, y_position}: GridControlProps ) {
    // Get the value of a CSS variables
    const root = document.documentElement;
    const tile_size_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_tile_size'));
    const column_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_column_container_count'));
    const row_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_row_container_count'));
    // Sizing variables
    const container_width: number = tile_size_property * column_count_property
    const container_height: number = tile_size_property * row_count_property
    const [width_container_count, set_width_count] = useState((window.innerWidth / container_width) + 1)
    const [height_container_count, set_height_count] = useState((window.innerHeight / container_height) + 1)
    // Activated coordinates
    const [active_container_coordinate, set_active_coordinates] = useState<TileContainerCoordinate>({
        container_column: -1,
        tile_column: -1,
        container_row: -1,
        tile_row: -1
    });
    // TODO Convert these to TileCoordinates instead of TileContainerCoordinates
    // Primary, secondary, and tertiary activated coordinates
    const [primary_coordinates, set_primary_coordinates] = useState<Map<number, TileCoordinate[]>>(new Map<number, TileCoordinate[]>())
    const [secondary_coordinates, set_secondary_coordinates] = useState<Map<number,TileCoordinate[]>>(new Map<number, TileCoordinate[]>())
    const [tertiary_coordinates, set_tertiary_coordinates] = useState<Map<number, TileCoordinate[]>>(new Map<number, TileCoordinate[]>())

    useEffect(() => {
        const handle_resize = () => {
            set_width_count((window.innerWidth / container_width) + 1);
            set_height_count((window.innerHeight / container_height) + 1);
        };
        window.addEventListener('resize', handle_resize);
        return () => window.removeEventListener('resize', handle_resize);
    }, [])

    // Based off given x and y params calculate which GridContainer in the matrix contains the active tile
    useEffect(() => {
        // Determine active column/row
        let active_container_column: number = Math.trunc(x_position / container_width);
        const active_panel_column = Math.trunc((x_position % container_width) / tile_size_property);
        let active_container_row: number = Math.trunc(y_position / container_height);
        const active_panel_row = Math.trunc((y_position % container_height) / tile_size_property);
        // Create default primary Coordinate objects
        let lower_primary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        };
        let upper_primary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row - 1
        };
        let right_primary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row
        };
        let left_primary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row
        };
        // Create default secondary Coordinate objects
        let lower_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row + 2
        }
        let upper_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row - 2
        }
        let right_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 2,
            container_row: active_container_row,
            tile_row: active_panel_row
        }
        let left_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 2,
            container_row: active_container_row,
            tile_row: active_panel_row
        }
        let lower_right_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 1 
        }
        let lower_left_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 1 
        }
        let upper_right_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 1
        }
        let upper_left_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 1
        }
        // Create default tertiary Coordinate objects
        let upper_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row - 3
        }
        let lower_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row + 3
        }
        let right_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 3,
            container_row: active_container_row,
            tile_row: active_panel_row
        }
        let left_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 3,
            container_row: active_container_row,
            tile_row: active_panel_row
        }
        let upper_right_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 2
        }
        let upper_left_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 2
        }
        let left_upper_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 2,
            container_row: active_container_row,
            tile_row: active_panel_row - 1
        }
        let right_upper_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 2,
            container_row: active_container_row,
            tile_row: active_panel_row - 1
        }
        let right_lower_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 2,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        }
        let left_lower_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 2,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        }
        let lower_right_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 2
        }
        let lower_left_tertiary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 2
        }
        // Check if active column or row is on border of container
        const is_tile_direct_border = (active_panel_row == 0 || active_panel_row == (row_count_property - 1)) 
                                || (active_panel_column == 0 || active_panel_column == (column_count_property - 1));

        const is_border_one_away = ((active_panel_row == 1 || active_panel_row == (row_count_property - 2)) 
                                || (active_panel_column == 1 || active_panel_column == (column_count_property - 2)))

        const is_border_two_away = ((active_panel_row == 2 || active_panel_row == (row_count_property - 3)) 
                                || (active_panel_column == 2 || active_panel_column == (column_count_property - 3)))

        // Adjust primary coordinates if on border
        if(is_tile_direct_border) {
            // Top border adjustments
            if(active_panel_row == 0) {
                // Primary adjustments
                upper_primary.container_row -= 1;
                upper_primary.tile_row = row_count_property - 1;
                // Secondary adjustments
                upper_left_secondary.container_row -= 1;
                upper_left_secondary.tile_row = row_count_property - 1;
                upper_right_secondary.container_row -= 1;
                upper_right_secondary.tile_row = row_count_property - 1;
                upper_secondary.container_row -= 1;
                upper_secondary.tile_row = row_count_property - 2;
                // Tertiary adjustments
                left_upper_tertiary.container_row -= 1;
                left_upper_tertiary.tile_row = row_count_property - 1;
                right_upper_tertiary.container_row -= 1;
                right_upper_tertiary.tile_row = row_count_property - 1;
                upper_left_tertiary.container_row -= 1;
                upper_left_tertiary.tile_row = row_count_property - 2;
                upper_right_tertiary.container_row -= 1;
                upper_right_tertiary.tile_row = row_count_property - 2;
                upper_tertiary.container_row -= 1;
                upper_tertiary.tile_row = row_count_property - 3;
            }
            // Bottom border adjustments
            if(active_panel_row == row_count_property - 1) {
                lower_primary.container_row += 1;
                lower_primary.tile_row = 0;
                // Secondary adjustments
                lower_left_secondary.container_row += 1;
                lower_left_secondary.tile_row = 0;
                lower_right_secondary.container_row += 1;
                lower_right_secondary.tile_row = 0;
                lower_secondary.container_row += 1;
                lower_secondary.tile_row = 1;
                // Tertiary adjustments
                left_lower_tertiary.container_row += 1;
                left_lower_tertiary.tile_row = 0;
                right_lower_tertiary.container_row += 1;
                right_lower_tertiary.tile_row = 0;
                lower_left_tertiary.container_row += 1;
                lower_left_tertiary.tile_row = 1;
                lower_right_tertiary.container_row += 1;
                lower_right_tertiary.tile_row = 1;
                lower_tertiary.container_row += 1;
                lower_tertiary.tile_row = 2;
            }
            // Left border adjustments
            if(active_panel_column == 0) {
                left_primary.container_column -= 1;
                left_primary.tile_column = column_count_property - 1;
                // Secondary adjustments
                upper_left_secondary.container_column -= 1;
                upper_left_secondary.tile_column = column_count_property - 1;
                lower_left_secondary.container_column -= 1;
                lower_left_secondary.tile_column = column_count_property - 1;
                left_secondary.container_column -= 1;
                left_secondary.tile_column = column_count_property - 2;
                // Tertiary adjustments
                lower_left_tertiary.container_column -= 1;
                lower_left_tertiary.tile_column = column_count_property - 1;
                upper_left_tertiary.container_column -= 1;
                upper_left_tertiary.tile_column = column_count_property - 1;
                left_upper_tertiary.container_column -= 1;
                left_upper_tertiary.tile_column = column_count_property - 2;
                left_lower_tertiary.container_column -= 1;
                left_lower_tertiary.tile_column = column_count_property - 2;
                left_tertiary.container_column -= 1;
                left_tertiary.tile_column = column_count_property - 3;
            }
            // Right border adjustments
            if(active_panel_column == column_count_property - 1) {
                right_primary.container_column += 1;
                right_primary.tile_column = 0;
                // Secondary adjustments
                upper_right_secondary.container_column += 1;
                upper_right_secondary.tile_column = 0;
                lower_right_secondary.container_column += 1;
                lower_right_secondary.tile_column = 0;
                right_secondary.container_column += 1;
                right_secondary.tile_column = 1;
                // Tertiary adjustments
                lower_right_tertiary.container_column += 1;
                lower_right_tertiary.tile_column = 0;
                upper_right_tertiary.container_column += 1;
                upper_right_tertiary.tile_column = 0;
                right_upper_tertiary.container_column += 1;
                right_upper_tertiary.tile_column = 1;
                right_lower_tertiary.container_column += 1;
                right_lower_tertiary.tile_column = 1;
                right_tertiary.container_column += 1;
                right_tertiary.tile_column = 2;
            }
        }
        if(is_border_one_away) {
            // Top border adjustments
            if(active_panel_row == 1) {
                // Secondary adjustments
                upper_secondary.container_row -= 1;
                upper_secondary.tile_row = row_count_property - 1;
                // Tertiary adjustments
                upper_left_tertiary.container_row -= 1;
                upper_left_tertiary.tile_row = row_count_property - 1;
                upper_right_tertiary.container_row -= 1;
                upper_right_tertiary.tile_row = row_count_property - 1;
                upper_tertiary.container_row -= 1;
                upper_tertiary.tile_row = row_count_property - 2;
            }
            // Bottom border adjustments
            if(active_panel_row == row_count_property - 2) {
                // Secondary adjustments
                lower_secondary.container_row += 1;
                lower_secondary.tile_row = 0;
                // Tertiary adjustments
                lower_left_tertiary.container_row += 1;
                lower_left_tertiary.tile_row = 0;
                lower_right_tertiary.container_row += 1;
                lower_right_tertiary.tile_row = 0;
                lower_tertiary.container_row += 1;
                lower_tertiary.tile_row = 1;
            }
            // Left border adjustments
            if(active_panel_column == 1) {
                // Secondary adjustments
                left_secondary.container_column -= 1;
                left_secondary.tile_column = column_count_property - 1;
                // Tertiary adjustments
                left_upper_tertiary.container_column -= 1;
                left_upper_tertiary.tile_column = column_count_property - 1;
                left_lower_tertiary.container_column -= 1;
                left_lower_tertiary.tile_column = column_count_property - 1;
                left_tertiary.container_column -= 1;
                left_tertiary.tile_column = column_count_property - 2;
            }
            // Right border adjustments
            if(active_panel_column == column_count_property - 2) {
                // Secondary adjustments
                right_secondary.container_column += 1;
                right_secondary.tile_column = 0;
                // Tertiary adjustments
                right_upper_tertiary.container_column += 1;
                right_upper_tertiary.tile_column = 0;
                right_lower_tertiary.container_column += 1;
                right_lower_tertiary.tile_column = 0;
                right_tertiary.container_column += 1;
                right_tertiary.tile_column = 1;
            }
        }
        if(is_border_two_away) {
            // Top border adjustments
            if(active_panel_row == 2) {
                // Tertiary adjustments
                upper_tertiary.container_row -= 1;
                upper_tertiary.tile_row = row_count_property - 1;
            }
            // Bottom border adjustments
            if(active_panel_row == row_count_property - 3) {
                // Tertiary adjustments
                lower_tertiary.container_row += 1;
                lower_tertiary.tile_row = 0;
            }
            // Left border adjustments
            if(active_panel_column == 2) {
                // Tertiary adjustments
                left_tertiary.container_column -= 1;
                left_tertiary.tile_column = column_count_property - 1;
            }
            // Right border adjustments
            if(active_panel_column == column_count_property - 3) {
                // Tertiary adjustments
                right_tertiary.container_column += 1;
                right_tertiary.tile_column = 0;
            }
        }

        const update_coordinates = (coordinate_level: LEVEL, coordinate_data: TileContainerCoordinate[]) => {
            let update_map: Map<number, TileCoordinate[]> = new Map<number, TileCoordinate[]>();
            coordinate_data.forEach(c =>{
                const coordinate_id: number = calculate_id(c.container_row, c.container_column, column_count_property);
                const existing_values: TileCoordinate[] = update_map.get(coordinate_id) ?? [];
                update_map.set(coordinate_id, [...existing_values, c])
            });
            switch(coordinate_level) {
                case LEVEL.ACTIVE:
                    set_active_coordinates(coordinate_data[0]);
                    break;
                case LEVEL.PRIMARY:
                    set_primary_coordinates(update_map);
                    break;
                case LEVEL.SECONDARY:
                    set_secondary_coordinates(update_map);
                    break;
                case LEVEL.TERTIARY:
                    set_tertiary_coordinates(update_map);
                    break;
                default:
                    console.error(`Provided coordinate level ${coordinate_level} is not supported for Map updates`);
            }
        };
        // Set coordinates for rendering
        update_coordinates(LEVEL.ACTIVE, [{ container_column: active_container_column, tile_column: active_panel_column, 
            container_row: active_container_row, tile_row: active_panel_row }]);
        update_coordinates(LEVEL.PRIMARY, [lower_primary, upper_primary, left_primary, right_primary]);
        update_coordinates(LEVEL.SECONDARY, [lower_secondary, upper_secondary, left_secondary, right_secondary, 
            upper_left_secondary, upper_right_secondary, lower_left_secondary, lower_right_secondary]);
        update_coordinates(LEVEL.TERTIARY, [upper_right_tertiary, upper_left_tertiary, right_upper_tertiary, left_upper_tertiary,
            lower_right_tertiary, lower_left_tertiary, right_lower_tertiary, left_lower_tertiary,
            upper_tertiary, lower_tertiary, left_tertiary, right_tertiary]);
    }, [x_position, y_position]);
    return (
        <div className='grid_control'>
            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => {
                        let additional_props = {}
                        let current_data: ActiveData = {}
                        if (row_index === active_container_coordinate.container_row 
                            && col_index === active_container_coordinate.container_column){
                            const current_tile: TileCoordinate = {
                                tile_column: active_container_coordinate.tile_column,
                                tile_row: active_container_coordinate.tile_row
                            }
                            current_data = {
                                ...current_data,
                                active_tile: current_tile
                            }
                        }
                        // Get primary data for just this container
                        const conatiner_id: number = calculate_id(row_index, col_index, column_count_property);
                        const primary_tile_subset: Array<TileCoordinate> = primary_coordinates.get(conatiner_id) ?? [];
                        // Get secondary data for just this container
                        const secondary_tile_subset: Array<TileCoordinate> = secondary_coordinates.get(conatiner_id) ?? [];
                        // Get tertiary data for just this container
                        const tertiary_tile_subset: Array<TileCoordinate> = tertiary_coordinates.get(conatiner_id) ?? [];
                        current_data = {
                            ...current_data,
                            primary_tiles: primary_tile_subset,
                            secondary_tiles: secondary_tile_subset,
                            tertiary_tiles: tertiary_tile_subset
                        };
                        additional_props = {active_data: current_data}
                    return(
                        <GridContainer 
                            key={col_index} 
                            column_count={column_count_property} 
                            row_count={row_count_property} 
                            {... additional_props}
                        />
                    );
                    })}
                </div>
            ))}
        </div>
    );
}