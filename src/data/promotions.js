import openingHoursBanner from '@/assets/promotions/banner-opening-hours.jpg'
import cakeIcedLatteBanner from '@/assets/promotions/promo-cake-iced-latte.jpg'

export const PROMOTION_TYPE = Object.freeze({
  /** Text + emoji card built from a menu item. */
  ITEM: 'item',
  /** Full-bleed banner image. */
  IMAGE: 'image',
})

/**
 * Slides for the promo carousel at the top of the menu.
 *
 * @typedef {Object} Promotion
 * @property {string} id
 * @property {'item' | 'image'} type
 * @property {string} [itemId]   Menu item opened when the slide is tapped (required for ITEM,
 *                               optional for IMAGE — without it the banner isn't clickable).
 * @property {string} [label]    ITEM: small pill above the title.
 * @property {string} [color]    ITEM: slide background colour.
 * @property {string} [ctaLabel] ITEM: button text, defaults to "สั่งเลย".
 * @property {string} [image]    IMAGE: imported image URL. Recommended 1200 × 480 px, < 200 KB.
 * @property {string} [alt]      IMAGE: describes the banner for screen readers.
 * @property {number} [width]    IMAGE: intrinsic size, prevents layout shift while loading.
 * @property {number} [height]
 */

/** @type {Promotion[]} */
export const PROMOTIONS = [
  {
    id: 'banner-cake-iced-latte',
    type: PROMOTION_TYPE.IMAGE,
    image: cakeIcedLatteBanner,
    alt: 'โปรโมชัน เค้กช็อกโกแลตมาร์ชเมลโล่ 89 บาท และลาเต้เย็น 75 บาท',
    width: 1200,
    height: 482,
  },
  {
    id: 'banner-opening-hours',
    type: PROMOTION_TYPE.IMAGE,
    image: openingHoursBanner,
    alt: 'เปิดบริการทุกวัน 09:00 ถึง 23:00 น. กาแฟ เค้ก เครื่องดื่ม ยินดีต้อนรับทุกท่าน',
    width: 1200,
    height: 482,
  },
  {
    id: 'new-orange-cat-latte',
    type: PROMOTION_TYPE.ITEM,
    itemId: 'orange-cat-latte',
    label: 'เมนูแนะนำ',
    color: '#F5E6D3',
  },
  {
    id: 'bestseller-thai-tea',
    type: PROMOTION_TYPE.ITEM,
    itemId: 'thai-tea',
    label: 'ขายดีอันดับ 1',
    color: '#FADBC0',
    ctaLabel: 'ลองเลย',
  },
  {
    id: 'new-pink-milk',
    type: PROMOTION_TYPE.ITEM,
    itemId: 'pink-milk',
    label: 'น่ารักต้องลอง',
    color: '#F9DEE4',
  },
  {
    id: 'paw-cookie',
    type: PROMOTION_TYPE.ITEM,
    itemId: 'paw-cookie',
    label: 'ของหวานคู่กาแฟ',
    color: '#EFE3D2',
    ctaLabel: 'เพิ่มเลย',
  },
]
