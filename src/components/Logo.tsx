'use client'

import Image from 'next/image'
import { useState } from 'react'

type LogoProps = {
  width?: number
  height?: number
  className?: string
  showText?: boolean
}

const Logo = ({ width = 40, height = 40, className = '', showText = false }: LogoProps) => {
  const [hasError, setHasError] = useState<boolean>(false)

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="rounded-lg overflow-hidden bg-gradient-to-br from-yellow-600 to-yellow-400">
        {hasError ? (
          <div
            className="flex items-center justify-center"
            style={{ width, height }}
            aria-label="Dance Order Logo"
          >
            <span className="text-white" style={{ fontSize: Math.min(width, height) * 0.6 }}>💃</span>
          </div>
        ) : (
          <Image
            src="/dance-order-logo.jpeg"
            alt="Dance Order Logo"
            width={width}
            height={height}
            onError={() => setHasError(true)}
            priority
          />
        )}
      </div>
      {showText && (
        <span className="font-semibold text-gray-900">Dance Order</span>
      )}
    </div>
  )
}

export default Logo


