import { useEffect } from 'react'
import './App.css'
import DefaultBase from './base/default_base'
import DotOverlay from './overlay/dot_overlay'

export default function App() {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  })

  return (
    <>
      <div className='parent_container'>
        <div className='page_overlay'>
          <DotOverlay />
        </div>
        <div className='default_background'>
          <DefaultBase />
        </div>
      </div>
    </>
  )
}
