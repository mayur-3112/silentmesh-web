import { useEffect } from "react";
import gsap from "gsap";

export default function RuntimeCustomCursor() {
  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.style.position = 'fixed'
    cursor.style.width = '18px'
    cursor.style.height = '18px'
    cursor.style.borderRadius = '9999px'
    cursor.style.background = 'rgba(0,201,167,0.7)'
    cursor.style.pointerEvents = 'none'
    cursor.style.zIndex = '10000'
    cursor.style.mixBlendMode = 'screen'
    cursor.style.backdropFilter = 'blur(10px)'

    document.body.appendChild(cursor)

    const move = (e) => {
      gsap.to(cursor, {
        x: e.clientX - 9,
        y: e.clientY - 9,
        duration: 0.25,
        ease: 'power3.out',
      })
    }

    window.addEventListener('mousemove', move)

    return () => {
      window.removeEventListener('mousemove', move)
      if(document.body.contains(cursor)) {
        cursor.remove()
      }
    }
  }, [])

  return null
}
