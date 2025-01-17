import { useState, useEffect } from "react";

interface GridTIleProps {
  is_active?: boolean;
  is_primary?: boolean;
  is_secondary?: boolean;
  is_tertiary?: boolean;
}

export default function GridTile({ is_active, is_primary, is_secondary, is_tertiary }: GridTIleProps) {
  const [background_color, set_background_color] = useState<string>('transparent');
  const [item_opacity, set_opactiy] = useState<number>(1);

  useEffect(() => {
    if(is_active || is_primary || is_secondary || is_tertiary) {
      const valid_colors: Array<string> = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'pink'];
      const rand_index = Math.floor(Math.random() * valid_colors.length);
      set_background_color(valid_colors[rand_index]);
      // FIXME Set to below for debugging
      if(is_primary){
        set_opactiy(1);
        // set_opactiy(.65);
      } else if(is_secondary) {
        set_opactiy(1);
        // set_opactiy(.4);
      } else if(is_tertiary) {
        set_opactiy(1);
        // set_opactiy(.05)
      } else {
        set_opactiy(1);
      }
    }
    else {
      set_background_color('transparent');
      set_opactiy(1);
    }
  }, [is_active, is_primary, is_secondary, is_tertiary]);


  return (
    <>
      <div className="tile" style = {{backgroundColor: `${background_color}`, opacity: `${item_opacity}`}}>
      </div>
    </>
  )
}
