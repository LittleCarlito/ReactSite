import { useState, useEffect } from 'react';
import GridContainer from './grid_container';
import { TileContainerCoordinate, TileCoordinate, ActiveData } from '../../types';
import './grid.css'

type GridControlProps = {
    x_position: number;
    y_position: number;
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
    // Activated variables
    const [active_container_coordinate, set_active_container_coordinates] = useState<TileContainerCoordinate>({
        container_column: -1,
        tile_column: -1,
        container_row: -1,
        tile_row: -1
    });
    // TODO OOOOO
    // TODO Get primary coordinates rendering before moving to manipulating secondary
    const [primary_coordinates, set_primary_coorindates] = useState<TileContainerCoordinate[]>([])
    const [secondary_coordinates, set_secondary_coorindates] = useState<TileContainerCoordinate[]>([])
    const [tertiary_coordinates, set_tertiary_coorindates] = useState<TileContainerCoordinate[]>([])

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
        let upper_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row + 2
        }
        let lower_secondary: TileContainerCoordinate = {
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
        let upper_right_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        }
        let upper_left_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        }
        let lower_right_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 1 
        }
        let lower_left_secondary: TileContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 1 
        }
        // Check if active column or row is on border of container
        const is_tile_direct_border = (active_panel_row == 0 || active_panel_row == (row_count_property - 1)) 
                                || (active_panel_column == 0 || active_panel_column == (column_count_property - 1));
        const is_border_one_away = ((active_panel_row == 1 || active_panel_row == (row_count_property - 2)) 
                                || (active_panel_column == 1 || active_panel_column == (column_count_property - 2)))
        // TODO Add adjusting for secondary Coordinates to here
        // Adjust primary coordinates if on border
        if(is_tile_direct_border) {
            // Top border adjustments
            if(active_panel_row == 0) {
                // Primary adjustments
                upper_primary.container_row -= 1;
                upper_primary.tile_row = row_count_property - 1;
                // Secondary adjustments
                // upper_right_secondary.container_row =- 1
                // upper_right_secondary.panel_row = row_count_property
                // upper_left_secondary.container_row =- 1
                // upper_left_secondary.panel_row = row_count_property
            }
            // Bottom border adjustments
            if(active_panel_row == row_count_property - 1) {
                lower_primary.container_row += 1;
                lower_primary.tile_row = 0;
            }
            // Left border adjustments
            if(active_panel_column == 0) {
                left_primary.container_column -= 1;
                left_primary.tile_column = column_count_property - 1;
            }
            // Right border adjustments
            if(active_panel_column == column_count_property - 1) {
                right_primary.container_column += 1;
                right_primary.tile_column = 0;
            }
        }
        if(is_border_one_away) {
            // TODO Handle secondary coordiante adjustments
        }
        set_primary_coorindates([lower_primary, upper_primary, left_primary, right_primary]);
        // TODO Determine secondary tiles
        // TODO Create default secondary Coordinate objects
        //          Do this above where the other ones are created
        // TODO Check if active column or row is on border of container
        //          Do this above where the other border thing is checked
        //          This should then be an elif statement off the is_panel_direct_border conditional
        // TODO Determine tertiary tiles
        // Set active coordinates for rendering
        set_active_container_coordinates({ container_column: active_container_column, tile_column: active_panel_column, 
            container_row: active_container_row, tile_row: active_panel_row });
        // TODO Set primary coordinates for rendering
        // TODO Set secondary coordinates for rendering
        // TODO Set tertiary coordinates for rendering

        const debug_var: Array<[number, number]> = []
        primary_coordinates.forEach(coord => {
            const tuple: [number, number] = [coord.container_column, coord.container_row];
            // Check if the tuple already exists in debug_var
            const exists = debug_var.some(([col, row]) => col === tuple[0] && row === tuple[1]);
            if (!exists) {
                debug_var.push(tuple);
            }
        });
        console.log("Updated debug_var count:", debug_var.length);

    }, [x_position, y_position]);
    // Debug logging
    // console.log(`Active tile: ${active_container_coordinate.tile_column}, ${active_container_coordinate.tile_row}`);
    // primary_coordinates.map(pc => (
    //     console.log(`Primary coordinates: ${pc.tile_column}, ${pc.tile_row}`)    
    // ));
    // TODO Add in grid container to see if col_index and row_index match coordinates, if they do pass in x and y remainders
    return (
        <div className='grid_control'>
            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => {
                        let additional_props = {}
                        let current_data: ActiveData = {}
                        // TODO Need to add/update logic so that conatiners who appear in primary data have their additional props set as well
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
                        // TODO Consider changing this to map so this is less intensive
                        // Get primary data for just this container
                        const primary_container_subset: Array<TileContainerCoordinate> = primary_coordinates
                        .filter(pc => pc.container_row == row_index && pc.container_column == col_index);
                        const primary_tile_subset: Array<TileCoordinate> = primary_container_subset.map(tile => (
                            {tile_column: tile.tile_column, tile_row: tile.tile_row}
                        ));
                        console.log('primary subset has this many items: ' + primary_tile_subset.length)
                        current_data = {
                            ...current_data,
                            primary_tiles: primary_tile_subset
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