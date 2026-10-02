import { useState } from 'react'
import ConfirmButton from '@/components/common/ConfirmButton'
import MenuItemImage from '@/components/common/MenuItemImage'
import { ALL_CATEGORY_ID, BADGES, CATEGORIES, CATEGORY_DEFAULTS } from '@/data/menu'
import { formatPrice } from '@/utils/format'
import { toMenuPhoto } from '@/utils/image'
import './AddMenuItemForm.css'

const ITEM_CATEGORIES = CATEGORIES.filter((category) => category.id !== ALL_CATEGORY_ID)

const NO_BADGE = ''
const BADGE_CHOICES = [
  { id: NO_BADGE, label: 'ไม่มี' },
  ...Object.entries(BADGES).map(([id, badge]) => ({ id, label: badge.label })),
]

function getCategory(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)
}

/** Content of the staff "add menu" sheet: new item form + items added so far. */
export default function AddMenuItemForm({ customItems, onAdd, onRemove }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState(ITEM_CATEGORIES[0].id)
  const [emoji, setEmoji] = useState('')
  const [badge, setBadge] = useState('new')
  const [photo, setPhoto] = useState('')
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const category = getCategory(categoryId)
  const canSubmit = name.trim() !== '' && Number(price) > 0 && !isProcessingPhoto

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    // Reset so picking the same file again still fires a change event.
    event.target.value = ''
    if (!file) return

    setPhotoError('')
    setIsProcessingPhoto(true)
    try {
      setPhoto(await toMenuPhoto(file))
    } catch {
      setPhotoError('เปิดไฟล์นี้เป็นรูปไม่ได้ ลองเลือกรูปอื่นนะ')
    } finally {
      setIsProcessingPhoto(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit) return
    onAdd({
      name,
      description,
      price: Number(price),
      categoryId,
      emoji,
      image: photo || undefined,
      badge: badge || undefined,
    })
  }

  return (
    <div className="add-menu">
      <form className="add-menu__form" onSubmit={handleSubmit}>
        <h2 className="add-menu__title">เพิ่มเมนูใหม่</h2>

        <label className="form-field">
          <span>ชื่อเมนู *</span>
          <input
            className="form-field__input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="เช่น ลาเต้ขนแมว"
            maxLength={40}
            required
          />
        </label>

        <label className="form-field">
          <span>คำอธิบาย</span>
          <input
            className="form-field__input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="เช่น ฟองนมนุ่ม หอมวานิลลา"
            maxLength={60}
          />
        </label>

        <div className="form-field">
          <span>รูปเมนู</span>
          <div className="add-menu__photo-field">
            <label
              className="add-menu__photo-picker"
              style={{ '--item-color': CATEGORY_DEFAULTS[categoryId].color }}
            >
              {photo ? (
                <img className="add-menu__photo-preview" src={photo} alt="" />
              ) : (
                <span className="add-menu__photo-placeholder">
                  <span aria-hidden="true">📷</span>
                  {isProcessingPhoto ? 'กำลังย่อรูป…' : 'แตะเพื่อเลือกรูป'}
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="add-menu__photo-input"
                onChange={handlePhotoChange}
                aria-label={photo ? 'เปลี่ยนรูปเมนู' : 'เลือกรูปเมนู'}
              />
            </label>
            {photo && (
              <div className="add-menu__photo-actions">
                <small className="text-muted">แตะรูปเพื่อเปลี่ยน</small>
                <button
                  type="button"
                  className="link-btn link-btn--danger"
                  onClick={() => setPhoto('')}
                >
                  ลบรูป
                </button>
              </div>
            )}
          </div>
          {photoError && (
            <small className="add-menu__photo-error" role="alert">
              {photoError}
            </small>
          )}
        </div>

        <div className="add-menu__row">
          <label className="form-field">
            <span>ราคา (บาท) *</span>
            <input
              className="form-field__input"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="เช่น 55"
              required
            />
          </label>

          <label className="form-field">
            <span>อีโมจิ (ใช้แทนตอนไม่มีรูป)</span>
            <span className="add-menu__emoji-field">
              <span
                className="add-menu__thumb"
                style={{ '--item-color': CATEGORY_DEFAULTS[categoryId].color }}
                aria-hidden="true"
              >
                {emoji.trim() || category.icon}
              </span>
              <input
                className="form-field__input"
                value={emoji}
                onChange={(event) => setEmoji(event.target.value)}
                placeholder={category.icon}
                maxLength={8}
              />
            </span>
          </label>
        </div>

        <fieldset className="add-menu__group">
          <legend className="add-menu__legend">หมวดหมู่</legend>
          <div className="add-menu__choices">
            {ITEM_CATEGORIES.map((choice) => {
              const isSelected = choice.id === categoryId
              return (
                <button
                  key={choice.id}
                  type="button"
                  className={`chip ${isSelected ? 'chip--selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => setCategoryId(choice.id)}
                >
                  <span aria-hidden="true">{choice.icon}</span>
                  {choice.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="add-menu__group">
          <legend className="add-menu__legend">ป้าย</legend>
          <div className="add-menu__choices">
            {BADGE_CHOICES.map((choice) => {
              const isSelected = choice.id === badge
              return (
                <button
                  key={choice.id}
                  type="button"
                  className={`chip ${isSelected ? 'chip--selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => setBadge(choice.id)}
                >
                  {choice.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <button type="submit" className="btn btn--primary btn--block" disabled={!canSubmit}>
          เพิ่มเมนู 🐾
        </button>
      </form>

      {customItems.length > 0 && (
        <section className="add-menu__added">
          <h3 className="add-menu__subtitle">เมนูที่เพิ่มไว้ ({customItems.length})</h3>
          <ul className="add-menu__list">
            {customItems.map((item) => (
              <li key={item.id} className="add-menu__item">
                <span
                  className="add-menu__thumb"
                  style={{ '--item-color': item.color }}
                  aria-hidden="true"
                >
                  <MenuItemImage
                    image={item.image}
                    emoji={item.emoji}
                    className="add-menu__thumb-photo"
                  />
                </span>
                <span className="add-menu__item-info">
                  <strong className="add-menu__item-name">{item.name}</strong>
                  <small className="text-muted">
                    {getCategory(item.categoryId)?.label} · {formatPrice(item.price)}
                    {item.badge && ` · ${BADGES[item.badge].label}`}
                  </small>
                </span>
                <ConfirmButton onConfirm={() => onRemove(item.id)} confirmLabel="ยืนยันลบ?">
                  ลบ
                </ConfirmButton>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
