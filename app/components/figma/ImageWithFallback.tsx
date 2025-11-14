"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageWithFallback({ src, fallback = "/next.svg", ...props }: any) {
  const [error, setError] = useState(false);
  return (
    <Image
      src={error ? fallback : src}
      {...props}
      onError={() => setError(true)}
    />
  );
}