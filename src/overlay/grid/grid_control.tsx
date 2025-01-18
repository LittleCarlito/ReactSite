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
    ACTIVE,
    PRIAMRY,
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
    const grid_diamond: GridDiamond = new GridDiamond(container_width, container_height, tile_size_property, row_count_property, column_count_property);
    const [width_container_count, set_width_count] = useState((window.innerWidth / container_width) + 1)
    const [height_container_count, set_height_count] = useState((window.innerHeight / container_height) + 1)
    // Activated coordinates
    const [active_container_coordinate, set_active_coordinates] = useState<TileContainerCoordinate>({
        container_column: -1,
        tile_column: -1,
        container_row: -1,
        tile_row: -1
    });
    // Primary, secondary, and tertiary activated coordinates
    const [primary_coordinates, set_primary_coorindates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [secondary_coordinates, set_secondary_coorindates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());
    const [tertiary_coordinates, set_tertiary_coorindates] = useState<Map<string, TileCoordinate[]>>(new Map<string, TileCoordinate[]>());

    const update_coordinate = (incoming_type: TYPE, incoming_data: TileContainerCoordinate[]) => {
        let primary_update_map = new Map<string, TileCoordinate[]>();
        let secondary_update_map = new Map<string, TileCoordinate[]>();
        let tertiary_update_map = new Map<string, TileCoordinate[]>();
        incoming_data.forEach(tc => {
            const container_id: string = resolve_container_id(tc.container_column, tc.container_row, column_count_property);
            switch(incoming_type) {
                case TYPE.ACTIVE:
                    set_active_coordinates(tc);
                    break;
                case TYPE.PRIAMRY:
                    const new_primary_coord: TileCoordinate = {tile_column: tc.tile_column, tile_row: tc.tile_row};
                    const existing_primary_data: TileCoordinate[] = primary_update_map.get(container_id) ?? [];
                    primary_update_map.set(container_id, [...existing_primary_data, new_primary_coord]);
                    break;
                case TYPE.SECONDARY:
                    const new_secondary_coord: TileCoordinate = {tile_column: tc.tile_column, tile_row: tc.tile_row};
                    const existing_secondary_data: TileCoordinate[] = secondary_update_map.get(container_id) ?? [];
                    secondary_update_map.set(container_id, [...existing_secondary_data, new_secondary_coord]);
                    break;
                case TYPE.TERTIARY:
                    const new_tertiary_coord: TileCoordinate = {tile_column: tc.tile_column, tile_row: tc.tile_row};
                    const existing_tertiary_data: TileCoordinate[] = tertiary_update_map.get(container_id) ?? [];
                    tertiary_update_map.set(container_id, [...existing_tertiary_data, new_tertiary_coord]);
                    break;
                default:
                    console.error(`Provided type ${incoming_type} is not supported for Map updates`);
            }
        });
        switch(incoming_type) {
            case TYPE.PRIAMRY:
                set_primary_coorindates(primary_update_map);
                break;
            case TYPE.SECONDARY:
                set_secondary_coorindates(secondary_update_map);
                break;
            case TYPE.TERTIARY:
                set_tertiary_coorindates(tertiary_update_map);
                break;
        }
    }

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
        update_coordinate(TYPE.ACTIVE, [diamond_coordinates.get(DiamondCord.ACTIVE)??UNKNOWN_CORD]);
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
        <div className='grid_control'>
            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => {
                        let additional_props = {}
                        let current_data: ActiveData = {}
                        // Get active data for container
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
                        const container_id: string = resolve_container_id(col_index, row_index, column_count_property);
                        // Get other data for container
                        const primary_tile_subset: Array<TileCoordinate> = primary_coordinates.get(container_id)??[];
                        const secondary_tile_subset: Array<TileCoordinate> = secondary_coordinates.get(container_id)??[];
                        const tertiary_tile_subset: Array<TileCoordinate> = tertiary_coordinates.get(container_id)??[];
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