import './pointer.css'

type MovingDotProps = {
  x_position: number;
  y_position: number;
}

export default function MovingDot( {x_position, y_position}: MovingDotProps ) {
  return (
    <>
      <div className='moving_dot'
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${x_position}px, ${y_position}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}>
      </div>
    </>
  );
}