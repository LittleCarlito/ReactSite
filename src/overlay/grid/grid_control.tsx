import { useState, useEffect } from 'react';
import GridContainer from './grid_container';
import { PanelContainerCoordinate, PanelCoordinate, ActiveData } from '../../types';
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
    const [active_container_coordinate, set_active_container_coordinates] = useState<PanelContainerCoordinate>({
        container_column: -1,
        tile_column: -1,
        container_row: -1,
        tile_row: -1
    });
    // TODO OOOOO
    // TODO Get primary coordinates rendering before moving to manipulating secondary
    const [primary_coordinates, set_primary_coorindates] = useState<PanelContainerCoordinate[]>([])
    const [secondary_coordinates, set_secondary_coorindates] = useState<PanelContainerCoordinate[]>([])
    const [tertiary_coordinates, set_tertiary_coorindates] = useState<PanelContainerCoordinate[]>([])

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
        // Determine active column
        let active_container_column: number = Math.trunc(x_position / container_width);
        const active_panel_column = Math.trunc((x_position % container_width) / tile_size_property);
        // Determine active row
        let active_container_row: number = Math.trunc(y_position / container_height);
        const active_panel_row = Math.trunc((y_position % container_height) / tile_size_property);
        // Create default primary Coordinate objects
        let upper_primary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        };
        let lower_primary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row - 1
        };
        let right_primary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row
        };
        let left_primary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row
        };
        // Create default secondary Coordinate objects
        let upper_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row + 2
        }
        let lower_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column,
            container_row: active_container_row,
            tile_row: active_panel_row - 2
        }
        let right_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 2,
            container_row: active_container_row,
            tile_row: active_panel_row
        }
        let left_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 2,
            container_row: active_container_row,
            tile_row: active_panel_row
        }
        let upper_right_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        }
        let upper_left_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row + 1
        }
        let lower_right_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column + 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 1 
        }
        let lower_left_secondary: PanelContainerCoordinate = {
            container_column: active_container_column,
            tile_column: active_panel_column - 1,
            container_row: active_container_row,
            tile_row: active_panel_row - 1 
        }
        // Check if active column or row is on border of container
        const is_tile_direct_border = (active_panel_row == 0 || active_container_row == (row_count_property - 1)) 
                                || (active_panel_column == 0 || active_container_column == (column_count_property - 1));
        const is_border_one_away = ((active_panel_row == 1 || active_panel_row == (row_count_property - 2)) 
                                || (active_panel_column == 1 || active_panel_column == (column_count_property - 2)))
        // TODO Add adjusting for secondary Coordinates to here
        // Adjust primary coordinates if on border
        if(is_tile_direct_border) {
            // Top border adjustments
            if(active_panel_row == 0) {
                // Primary adjustments
                upper_primary.container_row =- 1
                upper_primary.tile_row = row_count_property
                // // Secondary adjustments
                // upper_right_secondary.container_row =- 1
                // upper_right_secondary.panel_row = row_count_property
                // upper_left_secondary.container_row =- 1
                // upper_left_secondary.panel_row = row_count_property
            }
            // Bottom border adjustments
            if(active_panel_row == row_count_property) {
                lower_primary.container_row =+ 1
                lower_primary.tile_row = 0
            }
            // Left border adjustments
            if(active_panel_column == 0) {
                left_primary.container_column =- 1
                left_primary.tile_column = column_count_property
            }
            // Right border adjustments
            if(active_panel_column == column_count_property) {
                left_primary.container_column =+ 1
                left_primary.tile_column = 0
            }
        }
        if(is_border_one_away) {
            // TODO Handle secondary coordiante adjustments
        }
        set_primary_coorindates([upper_primary, lower_primary, left_primary, right_primary])
        // TODO Determine secondary tiles
        // TODO Create default secondary Coordinate objects
        //          Do this above where the other ones are created
        // TODO Check if active column or row is on border of container
        //          Do this above where the other border thing is checked
        //          This should then be an elif statement off the is_panel_direct_border conditional
        // TODO Determine tertiary tiles
        // Set active coordinates for rendering
        set_active_container_coordinates({ container_column: active_container_column, tile_column: active_panel_column, 
            container_row: active_container_row, tile_row: active_panel_row })
        // TODO Set primary coordinates for rendering
        // TODO Set secondary coordinates for rendering
        // TODO Set tertiary coordinates for rendering
    }, [x_position, y_position])

    // TODO Add in grid container to see if col_index and row_index match coordinates, if they do pass in x and y remainders
    return (
        <div className='grid_control'>
            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => {
                        let additional_props = {}
                        if (row_index === active_container_coordinate.container_row 
                            && col_index === active_container_coordinate.container_column){
                                const current_tile: PanelCoordinate = {
                                    active_column: active_container_coordinate.tile_column,
                                    active_row: active_container_coordinate.tile_row
                                }
                                const current_data: ActiveData = {
                                    active_tile: current_tile,
                                    primary_tiles: [],
                                    secondary_tiles: [],
                                    tertiary_tiles: []
                                }
                                additional_props = {active_data: current_data}
                            }
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