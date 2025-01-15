import { useState, useEffect } from "react";

interface GridTIleProps {
  is_active?: boolean;
  is_primary?: boolean;
}

export default function GridTile({ is_active, is_primary }: GridTIleProps) {
  const [background_color, set_background_color] = useState<string>('transparent');
  const [item_opacity, set_opactiy] = useState<number>(1);

  useEffect(() => {
    if(is_active || is_primary) {
      const valid_colors: Array<string> = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'pink'];
      const rand_index = Math.floor(Math.random() * valid_colors.length);
      set_background_color(valid_colors[rand_index]);
      if(is_primary){
        set_opactiy(.75)
      } else {
        set_opactiy(1)
      }
    }
    else {
      set_background_color('transparent')
      set_opactiy(1)
    }
  }, [is_active, is_primary]);


  return (
    <>
      <div className="tile" style = {{backgroundColor: `${background_color}`, opacity: `${item_opacity}`}}>
      </div>
    </>
  )
}
