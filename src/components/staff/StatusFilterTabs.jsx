import './StatusFilterTabs.css'

/**
 * @param {Object} props
 * @param {{ id: string, label: string }[]} props.tabs
 * @param {Record<string, number>} props.counts
 */
export default function StatusFilterTabs({ tabs, counts, activeId, onChange }) {
  return (
    <nav className="status-tabs" aria-label="กรองตามสถานะ">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            className={`status-tabs__tab ${isActive ? 'status-tabs__tab--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            <span className="status-tabs__count">{counts[tab.id] ?? 0}</span>
          </button>
        )
      })}
    </nav>
  )
}
