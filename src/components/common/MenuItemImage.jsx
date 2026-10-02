/**
 * A menu item's photo, or its emoji when it has none (e.g. staff-added items without one).
 * Decorative: the item name is always shown next to it.
 */
export default function MenuItemImage({ image, emoji, className, emojiClassName }) {
  if (image) {
    return (
      <img
        className={className}
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    )
  }
  return (
    <span className={emojiClassName} aria-hidden="true">
      {emoji}
    </span>
  )
}
