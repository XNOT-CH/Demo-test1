import { useEffect, useId, useRef } from 'react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import './ConfirmDialog.css'

/**
 * Centered confirmation popup on the native <dialog> element, which gives us
 * focus trapping, Escape-to-close and the backdrop for free.
 * The safe (cancel) button comes first so it receives focus when the dialog opens.
 */
export default function ConfirmDialog({
  isOpen,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = 'ไม่ใช่ตอนนี้',
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useBodyScrollLock(isOpen)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  function handleClick(event) {
    // The dialog element itself is only hit when clicking the backdrop around the content.
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className="confirm-dialog__content">
        {icon && (
          <div className="confirm-dialog__icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <h2 id={titleId} className="confirm-dialog__title">
          {title}
        </h2>
        {message && <p className="confirm-dialog__message">{message}</p>}
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
