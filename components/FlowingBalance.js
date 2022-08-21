import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const ANIMATION_MINIMUM_STEP_TIME = 100

export const FlowingBalance = () => {
  const [formattedValue, setFormattedValue] = useState('')
  const balanceWei = 1000000000
  const flowRateWei = 1000000000
  const balanceTimestamp = 10000000
  useEffect(() => {
    const balanceBigNumber = ethers.BigNumber.from(balanceWei)
    const flowRateBigNumber = ethers.BigNumber.from(flowRateWei)
    const balanceTimestampBigNumber =
      ethers.BigNumber.from(balanceTimestamp).mul(1000)

    let stopAnimation = false
    let lastAnimationTimestamp = 0

    const animationStep = (currentAnimationTimestamp) => {
      if (
        currentAnimationTimestamp - lastAnimationTimestamp >
        ANIMATION_MINIMUM_STEP_TIME
      ) {
        if (stopAnimation) {
          return
        }

        const currentTimestampBigNumber = ethers.BigNumber.from(
          new Date().getTime(),
        )

        setFormattedValue(
          format(
            balanceBigNumber
              .add(
                currentTimestampBigNumber
                  .sub(balanceTimestampBigNumber)
                  .mul(flowRateBigNumber)
                  .div(1000),
              )
              .toString(),
          ),
        )

        lastAnimationTimestamp = currentAnimationTimestamp
      }
      window.requestAnimationFrame(animationStep)
    }

    window.requestAnimationFrame(animationStep)

    return () => {
      stopAnimation = true
    }
  }, [balanceTimestamp])
  return <span>{formattedValue}</span>
}
