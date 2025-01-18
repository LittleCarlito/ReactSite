import { useState, useEffect } from "react";

interface GridTIleProps {
  // TODO Get these to a singluar object
  is_active?: boolean;
  is_primary?: boolean;
  is_secondary?: boolean;
  is_tertiary?: boolean;
}

export default function GridTile({ is_active, is_primary, is_secondary, is_tertiary }: GridTIleProps) {
  const [background_color, set_background_color] = useState<string>('transparent');
  const [grayscale_level, set_grayscale] = useState<number>(100);

  useEffect(() => {
    // Determine background color
    const valid_colors: Array<string> = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'pink'];
    const rand_index = Math.floor(Math.random() * valid_colors.length);
    set_background_color(valid_colors[rand_index]);
    // Determine grayscale
    let calced_grayscale: number = 100;
    if (is_active) {
      calced_grayscale = 0;
    } else if(is_primary){
      calced_grayscale = 20;
    } else if(is_secondary) {
      calced_grayscale = 60;
    } else if(is_tertiary) {
      calced_grayscale = 80;
    }
    set_grayscale(calced_grayscale);
  }, [is_active, is_primary, is_secondary, is_tertiary]);


  return (
    <>
      <div className="tile" style = {{backgroundColor: `${background_color}`, filter: `grayscale(${grayscale_level}%)`}}>
      </div>
    </>
  )
}
