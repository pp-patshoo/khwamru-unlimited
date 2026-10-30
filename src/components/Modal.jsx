import { useEffect, useRef, useId } from 'react'
import { X } from 'lucide-react'
import { th } from '../i18n/th'
import styles from './Modal.module.css'

/**
 * Accessible Modal Dialog using the HTML5 <dialog> element.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal dialog is displayed
 * @param {() => void} props.onClose - Callback triggered to close the modal
 * @param {string} props.title - Modal title heading
 * @param {import('react').ReactNode} props.children - Modal body content
 * @param {import('react').ReactNode} [props.footer] - Optional footer content (e.g. action buttons)
 * @param {string} [props.className] - Additional CSS class
 * @returns {import('react').JSX.Element | null}
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
}) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialogElement = dialogRef.current
    if (!dialogElement) return

    if (isOpen) {
      if (!dialogElement.open) {
        dialogElement.showModal()
      }
    } else {
      if (dialogElement.open) {
        dialogElement.close()
      }
    }
  }, [isOpen])

  /**
   * Handle the native cancel event (Esc key)
   * @param {import('react').SyntheticEvent} e
   */
  const handleCancel = (e) => {
    e.preventDefault()
    onClose()
  }

  /**
   * Handle light dismiss when clicking the backdrop
   * @param {import('react').MouseEvent<HTMLDialogElement>} e
   */
  const handleClick = (e) => {
    const dialog = dialogRef.current
    if (!dialog) return
    const rect = dialog.getBoundingClientRect()
    const isClickOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom

    if (isClickOutside) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${className}`.trim()}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={th.common.close}
        >
          <X size={20} />
        </button>
      </div>
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </dialog>
  )
}

export default Modal

