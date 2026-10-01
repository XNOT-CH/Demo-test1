import './CategoryTabs.css'

export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <nav className="category-tabs" aria-label="หมวดหมู่เมนู">
      {categories.map((category) => {
        const isActive = category.id === activeId
        return (
          <button
            key={category.id}
            type="button"
            className={`category-tabs__tab ${isActive ? 'category-tabs__tab--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(category.id)}
          >
            <span aria-hidden="true">{category.icon}</span> {category.label}
          </button>
        )
      })}
    </nav>
  )
}
