import {
  useFloating,
  FloatingPortal,
  arrow,
  offset,
  shift,
  type Placement
} from '@floating-ui/react'
import { useState, useRef, useId, type ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children?: React.ReactNode
  renderPopover: React.ReactNode
  className: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}

const Popover = ({
  children,
  className,
  renderPopover,
  as: Element = 'div',
  initialOpen,
  placement = 'bottom-end'
}: Props) => {
  const [open, setOpen] = useState(initialOpen || false)
  const arrowRef = useRef(null)
  const { x, y, strategy, refs, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement
  })
  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }

  const id = useId()

  return (
    <Element
      className={className}
      ref={refs.setReference}
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-t-transparent border-b-white'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}

export default Popover
