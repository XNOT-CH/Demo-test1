import { useRef } from 'react'
import './MenuSearch.css'

export default function MenuSearch({ value, onChange }) {
  const inputRef = useRef(null)

  function clear() {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <form className="menu-search" role="search" onSubmit={(event) => event.preventDefault()}>
      <input
        ref={inputRef}
        type="search"
        className="menu-search__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && onChange('')}
        placeholder="ค้นหาเมนู เช่น ลาเต้, ชาไทย"
        aria-label="ค้นหาเมนู"
        enterKeyHint="search"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          className="menu-search__clear"
          onClick={clear}
          aria-label="ล้างคำค้นหา"
        >
          ✕
        </button>
      ) : (
        <svg className="menu-search__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      )}
    </form>
  )
}
