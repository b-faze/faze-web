"use client";

import { useState, useEffect, useCallback } from 'react';


type Dimension = {
  width: number;
  height: number;
}
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<Dimension>();

  const onResize = useCallback(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setWindowDimensions({ width, height });
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  return windowDimensions;
}
