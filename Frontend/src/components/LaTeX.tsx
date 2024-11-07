'use client'

import React, { useRef, useEffect } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface LaTeXProps {
  children: string
}

const LaTeX: React.FC<LaTeXProps> = ({ children }) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        throwOnError: false
      })
    }
  }, [children])

  return <span ref={ref} />
}

export default LaTeX