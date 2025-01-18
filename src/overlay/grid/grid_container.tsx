import { useState, useEffect } from 'react';
import GridTile from './grid_tile'
import { ActiveData } from '../../types';
import { resolove_id } from '../../util';

type GridContainerProps = {
    active_data?: ActiveData;
    column_count: number;
    row_count: number;
}

export default function GridContainer({active_data, column_count, row_count}: GridContainerProps) {
    const [mouse_id, set_mouse_id] = useState<number>(-1);
    const [activated_ids, set_activated_ids] = useState<number[]>([]);
    const [primary_ids, set_primary_ids] = useState<number[]>([]);
    const [secondary_ids, set_secondary_ids] = useState<number[]>([]);
    const [tertiary_ids, set_tertiary_ids] = useState<number[]>([]);

    useEffect(() => {
        // Check mouse tile data
        if(active_data?.mouse_tile) {
            const calculated_mouse_id: number = resolove_id(active_data?.mouse_tile.tile_column, active_data?.mouse_tile.tile_row, column_count);
            console.log(`Setting ${calculated_mouse_id} as mouse tile as a result of ${active_data?.mouse_tile.tile_row} and ${active_data?.mouse_tile.tile_column} coordinates`)
            set_mouse_id(calculated_mouse_id);
        }
        else {
            set_mouse_id(-1);
        }
        // Check active data for activated tiles
        if(active_data?.activated_tiles) {
            const new_activated_ids: number[] = active_data.activated_tiles
            .map(tc => {
                const activated_id: number = resolove_id(tc.tile_column, tc.tile_row, column_count);
                console.log(`Setting ${activated_id} as actived as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return activated_id;
            });
            set_activated_ids([...activated_ids, ...new_activated_ids]);
        }
        else {
            set_activated_ids([]);
        }
        // Check active data for primary tiles
        if(active_data?.primary_tiles) {
            const new_primary_ids: number[] = active_data.primary_tiles
            .map(tc => {
                const primary_id: number = resolove_id(tc.tile_column, tc.tile_row, column_count);
                // console.log(`Setting ${primary_id} as primary as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return primary_id;
            });
            set_primary_ids(new_primary_ids);
        } 
        else {
            set_primary_ids([]);
        }
        // Check active data for secondary tiles
        if(active_data?.secondary_tiles) {
            const new_secondary_ids: Array<number> = active_data.secondary_tiles
            .map(tc => {
                const secondary_id: number = resolove_id(tc.tile_column, tc.tile_row, column_count);
                // console.log(`Setting ${secondary_id} as secondary as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return secondary_id;
            });
            set_secondary_ids(new_secondary_ids);
        } else {
            set_secondary_ids([]);
        }
        // Check active data for tertiary tiles
        if(active_data?.tertiary_tiles) {
            const new_tertiary_ids: Array<number> = active_data.tertiary_tiles
            .map(tc => {
                const tertiary_id: number = resolove_id(tc.tile_column, tc.tile_row, column_count);
                // console.log(`Setting ${tertiary_id} as tertiary as a result of ${tc.tile_row} and ${tc.tile_column} coordinates`)
                return tertiary_id;
            });
            set_tertiary_ids(new_tertiary_ids);
        } else {
            set_tertiary_ids([]);
        }
    }, [active_data])

    return (
        <div className="grid_container">
            {Array.from({ length: column_count * row_count }).map((_, tile_index) => {
                const is_mouse: boolean = mouse_id == tile_index;
                const is_active: boolean = activated_ids.includes(tile_index);
                const is_primary: boolean = primary_ids.includes(tile_index);
                const is_secondary: boolean = secondary_ids.includes(tile_index);
                const is_tertiary: boolean = tertiary_ids.includes(tile_index);
                return(
                    <GridTile 
                        key={tile_index} 
                        is_mouse={is_mouse}
                        is_active={is_active} 
                        is_primary={is_primary}
                        is_secondary={is_secondary}
                        is_tertiary={is_tertiary}
                    />);
            })}
        </div>
    )
}
