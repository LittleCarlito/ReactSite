import { useState, useEffect } from 'react';
import GridContainer from './grid_container';
import './grid.css'

type GridControlProps = {
    x_position: number;
    y_position: number;
}

export default function GridControl( {x_position, y_position}: GridControlProps ) {
    // TODO Add parameters for taking in x and y coordinates
    //          Translate those to what containers are active and pass them the x and y info
    //              Those containers should then let the proper panels know to light up
    //                  Panels shoudl have logic when lit up to select random background color

    // Get the value of a CSS variables
    const root = document.documentElement;
    const tile_size_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_tile_size'));
    const column_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_column_container_count'));
    const row_count_property: number = parseInt(getComputedStyle(root).getPropertyValue('--grid_row_container_count'));


    const container_width: number = tile_size_property * column_count_property
    const container_height: number = tile_size_property * row_count_property

    const [width_container_count, set_width_count] = useState((window.innerWidth / container_width) + 1)
    const [height_container_count, set_height_count] = useState((window.innerHeight / container_height) + 1)

    const control_style = {
        color: 'blue',
    };

    useEffect(() => {
        const handle_resize = () => {
            set_width_count((window.innerWidth / container_width) + 1)
            set_height_count((window.innerHeight / container_height) + 1)
        };
        window.addEventListener('resize', handle_resize);
        return () => window.removeEventListener('resize', handle_resize);
    }, [])

    // TODO Based off given x and y params calculate which GridContainer in the matrix contains the active tile

    return (
        <div className='grid_control' style={control_style}>

            {/* TODO Just keeping below to keep errors about unused params at bay */}
            <p>{x_position} {y_position}</p>

            {Array.from({ length: height_container_count}).map((_, row_index) => (
                <div key={row_index} style={{ display: 'flex' }}>
                    {Array.from({ length: width_container_count }).map((_, col_index) => (
                        <GridContainer key={col_index} />
                    ))}
                </div>
            ))}
        </div>
    );
}