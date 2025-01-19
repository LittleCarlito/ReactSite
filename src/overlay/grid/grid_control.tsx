import { useState, useEffect } from 'react';
import GridContainer from './grid_container';
import { TileContainerCoordinate, TileCoordinate, ActiveData } from '../../types';
import './grid.css'
import { resolve_container_id } from '../../util';
import GridDiamond from './diamond/grid_diamond';
import { DiamondCord, UNKNOWN_CORD } from './diamond/diamond_properties';

type GridControlProps = {
    x_position: number;
    y_position: number;
}

enum TYPE  {
    MOUSE,
    ACTIVE,
    DISABLED,
    PRIAMRY,
    SECONDARY,
    TERTIARY,
    QUEUED
}

// TODO OOOOOO
// TODO Need to add override property to disable all coloring except those in the activated category
// TODO Need to create active group storage
//          Stores coordiantes of tiles that have been activeated that aren't to be affected by clicks, or grid diamond movement
// TODO Need to detect click down and click up events
// TODO Click down makes all tiles in diamond deactivated (unless in the active group)
//          Need to store coordinates of current grid diamond for on release event
//              Better yet make it a lambda that is passed and just called on release
// TODO Click release makes all tiles in diamond that were clicked, and not in active group, active
//          All these tiles should then be added to the active group

export default function GridControl( {x_position, y_position}: GridControlProps ) {
    // Get the value of a CSS variables
    const root = document.documentElement;
    const tile_size_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_tile_size'));
    const column_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_column_container_count'));
    const row_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_row_container_count'));
    // Sizing variables
    const container_width: number = tile_size_property * column_count_property
    const container_height: number = tile_size_property * row_count_property
    const grid_diamond: GridDiamond = new GridDiamond(container_width, container_height, tile_size_property, row_count_property, column_count_property);
    const [width_container_count, set_width_count] = useState((window.innerWidth / container_width) + 1)
    const [height_container_count, set_height_count] = useState((window.innerHeight / container_height) + 1)
    // Activated variables
    const [is_mouse_down, set_mouse_down] = useState<boolean>(false);
    const [active_coordinates, set_active_coordinates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [disabled_coordinates, set_disabled_coordinates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [primary_coordinates, set_primary_coorindates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [secondary_coordinates, set_secondary_coorindates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [tertiary_coordinates, set_tertiary_coorindates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [queued_coordinates, set_queued_coordinates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [mouse_tile, set_mouse_tile] = useState<TileContainerCoordinate>({
        tile_column: -1,
        tile_row: -1,
        container_column: -1,
        container_row: -1
    });

    const update_coordinate = (incoming_type: TYPE, incoming_data: TileContainerCoordinate[]) => {
        let active_update_map = new Map<string, TileCoordinate[]>();
        let disabled_update_map = new Map<string, TileCoordinate[]>();
        let primary_update_map = new Map<string, TileCoordinate[]>();
        let secondary_update_map = new Map<string, TileCoordinate[]>();
        let tertiary_update_map = new Map<string, TileCoordinate[]>();
        let queue_update_map = new Map<string, TileCoordinate[]>();
        incoming_data.forEach(tc => {
            const container_id: string = resolve_container_id(tc.container_column, tc.container_row, column_count_property);
            const new_cord: TileCoordinate = {tile_column: tc.tile_column, tile_row: tc.tile_row};
            switch(incoming_type) {
                case TYPE.MOUSE:
                    set_mouse_tile(tc);
                    break;
                case TYPE.ACTIVE:
                    const existing_active_data: TileCoordinate[] = active_update_map.get(container_id)??[];
                    active_update_map.set(container_id, [...existing_active_data, new_cord]);
                    break;
                case TYPE.DISABLED:
                    const existing_disabled_data: TileCoordinate[] = disabled_update_map.get(container_id)??[];
                    disabled_update_map.set(container_id, [...existing_disabled_data, new_cord]);
                    break;
                case TYPE.PRIAMRY:
                    const existing_primary_data: TileCoordinate[] = primary_update_map.get(container_id)??[];
                    primary_update_map.set(container_id, [...existing_primary_data, new_cord]);
                    break;
                case TYPE.SECONDARY:
                    const existing_secondary_data: TileCoordinate[] = secondary_update_map.get(container_id)??[];
                    secondary_update_map.set(container_id, [...existing_secondary_data, new_cord]);
                    break;
                case TYPE.TERTIARY:
                    const existing_tertiary_data: TileCoordinate[] = tertiary_update_map.get(container_id)??[];
                    tertiary_update_map.set(container_id, [...existing_tertiary_data, new_cord]);
                    break;
                case TYPE.QUEUED:
                    const existing_queued_data: TileCoordinate[] = queue_update_map.get(container_id)??[];
                    queue_update_map.set(container_id, [...existing_queued_data, new_cord]);
                    break;
                default:
                    console.error(`Provided type ${incoming_type} is not supported for Map updates`);
            }
        });
        switch(incoming_type) {
            case TYPE.ACTIVE:
                // TODO Here is where we would need to add handling to keep activated coordiantes set between states
                set_active_coordinates(active_update_map);
                break;
            case TYPE.DISABLED:
                set_disabled_coordinates(disabled_update_map);
                break;
            case TYPE.PRIAMRY:
                set_primary_coorindates(primary_update_map);
                break;
            case TYPE.SECONDARY:
                set_secondary_coorindates(secondary_update_map);
                break;
            case TYPE.TERTIARY:
                set_tertiary_coorindates(tertiary_update_map);
                break;
            case TYPE.QUEUED:
                set_queued_coordinates(queue_update_map);
                break;
        }
    }

    // TODO Create onMouseDown handler method
    const handle_mouse_down = () => {
        set_mouse_down(true);
        const current_diamond: Map<string, TileContainerCoordinate> = grid_diamond.calculate_coordinates(x_position, y_position);
        let diamond_cords: TileContainerCoordinate[] = [];
        current_diamond.forEach(tce => {
            diamond_cords = [...diamond_cords, tce]
        });
        update_coordinate(TYPE.QUEUED, diamond_cords);
        // TODO Need to convert TileContainerCoordinate to TileCoordinate and store them in intermediate map storage
        //          Held in intermediate storage until handle_mouse_up is processed
        //              The coordinates are then added to the activated list
        // TODO Need to store and set disabled state for the coordinates until ahndle_mouse_up is handled
        //          Disabled needs to keep full grayscale unless the tile is activated
    };

    // TODO Create onMouseUp hanlder method
    const handle_mouse_up = () => {
        set_mouse_down(false);
        // TODO For now just check the intermediate map storage for waiting to be activated tile coordinates
        //          Add these coordinates to the activated coordinates map so they are lit up
        //              Ensure this map stays persistent so activated tiles stay activated
        // TODO Clear intermediate map storage when done handling everything in there
    };

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
        // Determine diamond grid and update containers
        const diamond_coordinates: Map<string, TileContainerCoordinate> = grid_diamond.calculate_coordinates(x_position, y_position);
        // Set coordinates for rendering
        update_coordinate(TYPE.MOUSE, [diamond_coordinates.get(DiamondCord.ACTIVE)??UNKNOWN_CORD]);
        update_coordinate(TYPE.PRIAMRY, [
            diamond_coordinates.get(DiamondCord.LOWER_PRIMARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.UPPER_PRIMARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LEFT_PRIMARY)??UNKNOWN_CORD, 
            diamond_coordinates.get(DiamondCord.RIGHT_PRIMARY)??UNKNOWN_CORD
        ]);
        // Set secondary coordinates for rendering
        update_coordinate(TYPE.SECONDARY, [
            diamond_coordinates.get(DiamondCord.LOWER_SECONDARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.UPPER_SECONDARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LEFT_SECONDARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.RIGHT_SECONDARY)??UNKNOWN_CORD, 
            diamond_coordinates.get(DiamondCord.UPPER_LEFT_SECONDARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.UPPER_RIGHT_SECONDARY)??UNKNOWN_CORD, 
            diamond_coordinates.get(DiamondCord.LOWER_LEFT_SECONDARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LOWER_RIGHT_SECONDARY)??UNKNOWN_CORD,
        ]);
        // Set tertiary coordinates for rendering
        update_coordinate(TYPE.TERTIARY, [
            diamond_coordinates.get(DiamondCord.UPPER_RIGHT_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.UPPER_LEFT_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.RIGHT_UPPER_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LEFT_UPPER_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LOWER_RIGHT_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LOWER_LEFT_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.RIGHT_LOWER_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LEFT_LOWER_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.UPPER_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LOWER_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.LEFT_TERTIARY)??UNKNOWN_CORD,
            diamond_coordinates.get(DiamondCord.RIGHT_TERTIARY)??UNKNOWN_CORD,
        ]);
    }, [x_position, y_position]);

    return (
        // TODO Add onMouseDown and onMouseUp hadnling methods to grid_control div
        <div className='grid_control'>
            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => {
                        let additional_props = {}
                        const container_id: string = resolve_container_id(col_index, row_index, column_count_property);
                        let current_data: ActiveData = {};
                        // Determine if mouse container
                        if(mouse_tile.container_column == col_index && mouse_tile.container_row == row_index) {
                            current_data = {
                                mouse_tile: mouse_tile
                            }
                        };
                        // Get tile coordinates
                        const active_tile_subset: TileCoordinate[] = active_coordinates.get(container_id)??[];
                        const primary_tile_subset: TileCoordinate[] = primary_coordinates.get(container_id)??[];
                        const secondary_tile_subset: TileCoordinate[] = secondary_coordinates.get(container_id)??[];
                        const tertiary_tile_subset: TileCoordinate[] = tertiary_coordinates.get(container_id)??[];
                        current_data = {
                            ...current_data,
                            activated_tiles: active_tile_subset,
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