/**
 * @typedef {Object} OptionChoice
 * @property {string} label
 * @property {number} price  Extra price added to the base price.
 * @property {string} [icon]
 *
 * @typedef {Object} OptionGroup
 * @property {string} label
 * @property {number} defaultIndex
 * @property {OptionChoice[]} choices
 *
 * @typedef {Object} MenuItem
 * @property {string} id
 * @property {string} categoryId
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} emoji
 * @property {string} color  Background tint for the item artwork.
 * @property {keyof typeof BADGES} [badge]
 * @property {(keyof typeof OPTION_GROUPS)[]} optionGroups
 */

/** @type {Record<string, OptionGroup>} */
export const OPTION_GROUPS = {
  temperature: {
    label: 'แบบ',
    defaultIndex: 1,
    choices: [
      { label: 'ร้อน', price: 0, icon: '♨️' },
      { label: 'เย็น', price: 5, icon: '🧊' },
      { label: 'ปั่น', price: 10, icon: '🌀' },
    ],
  },
  hotOnly: {
    label: 'แบบ',
    defaultIndex: 0,
    choices: [{ label: 'ร้อน', price: 0, icon: '♨️' }],
  },
  sweetness: {
    label: 'ความหวาน',
    defaultIndex: 2,
    choices: [
      { label: 'ไม่หวาน', price: 0 },
      { label: 'หวานน้อย', price: 0 },
      { label: 'หวานปกติ', price: 0 },
      { label: 'หวานมาก', price: 0 },
    ],
  },
  milk: {
    label: 'นม',
    defaultIndex: 0,
    choices: [
      { label: 'นมวัว', price: 0 },
      { label: 'นมโอ๊ต', price: 15 },
    ],
  },
  extraShot: {
    label: 'ช็อตกาแฟ',
    defaultIndex: 0,
    choices: [
      { label: 'ปกติ', price: 0 },
      { label: 'เพิ่มช็อต', price: 15 },
    ],
  },
  warmUp: {
    label: 'อุ่นร้อน',
    defaultIndex: 1,
    choices: [
      { label: 'ไม่อุ่น', price: 0 },
      { label: 'อุ่นให้หน่อย', price: 0 },
    ],
  },
}

export const BADGES = {
  new: { label: 'ใหม่' },
  bestseller: { label: 'ขายดี' },
}

export const ALL_CATEGORY_ID = 'all'

export const CATEGORIES = [
  { id: ALL_CATEGORY_ID, label: 'ทั้งหมด', icon: '🐾' },
  { id: 'coffee', label: 'กาแฟ', icon: '☕' },
  { id: 'tea', label: 'ชา', icon: '🍵' },
  { id: 'milk', label: 'นม & โกโก้', icon: '🥛' },
  { id: 'bakery', label: 'เบเกอรี่', icon: '🥐' },
]

const COFFEE_OPTIONS = ['temperature', 'sweetness', 'milk', 'extraShot']

/** Options and artwork tint given to items staff add, per category. */
export const CATEGORY_DEFAULTS = {
  coffee: { optionGroups: COFFEE_OPTIONS, color: '#E8D3BE' },
  tea: { optionGroups: ['temperature', 'sweetness'], color: '#D9E6C8' },
  milk: { optionGroups: ['temperature', 'sweetness', 'milk'], color: '#F3E2CC' },
  bakery: { optionGroups: ['warmUp'], color: '#F4DDB8' },
}

/** @type {MenuItem[]} */
export const MENU_ITEMS = [
  // Coffee
  {
    id: 'orange-cat-latte',
    categoryId: 'coffee',
    name: 'ลาเต้แมวส้ม',
    description: 'ฟองนมรูปอุ้งเท้า หอมคาราเมลส้ม',
    price: 65,
    emoji: '🐱',
    color: '#F9D9B8',
    badge: 'new',
    optionGroups: COFFEE_OPTIONS,
  },
  {
    id: 'americano',
    categoryId: 'coffee',
    name: 'อเมริกาโน่',
    description: 'เข้ม ชัด ตื่นเต็มตา',
    price: 50,
    emoji: '☕',
    color: '#E8D3BE',
    optionGroups: ['temperature', 'sweetness', 'extraShot'],
  },
  {
    id: 'cappuccino',
    categoryId: 'coffee',
    name: 'คาปูชิโน่',
    description: 'ฟองนมนุ่มฟู โรยผงซินนามอน',
    price: 60,
    emoji: '☁️',
    color: '#F2E4D4',
    optionGroups: COFFEE_OPTIONS,
  },
  {
    id: 'mocha',
    categoryId: 'coffee',
    name: 'มอคค่าหนวดแมว',
    description: 'ช็อกโกแลตเข้ม ๆ กับเอสเพรสโซ่',
    price: 65,
    emoji: '🍫',
    color: '#E3C9B5',
    badge: 'bestseller',
    optionGroups: COFFEE_OPTIONS,
  },
  {
    id: 'caramel-macchiato',
    categoryId: 'coffee',
    name: 'คาราเมลมัคคิอาโต้',
    description: 'หวานละมุน ราดซอสคาราเมล',
    price: 70,
    emoji: '🍯',
    color: '#F6DDB7',
    optionGroups: COFFEE_OPTIONS,
  },
  {
    id: 'espresso',
    categoryId: 'coffee',
    name: 'เอสเพรสโซ่',
    description: 'ช็อตเดียวจบ สำหรับสายเข้ม',
    price: 45,
    emoji: '⚡',
    color: '#DCC3AE',
    optionGroups: ['hotOnly', 'extraShot'],
  },

  // Tea
  {
    id: 'thai-tea',
    categoryId: 'tea',
    name: 'ชาไทยแมวส้ม',
    description: 'สีส้มเหมือนน้องแมว หอมมัน',
    price: 50,
    emoji: '🧡',
    color: '#FAD3B0',
    badge: 'bestseller',
    optionGroups: ['temperature', 'sweetness', 'milk'],
  },
  {
    id: 'matcha-latte',
    categoryId: 'tea',
    name: 'มัทฉะลาเต้',
    description: 'มัทฉะเกรดพิธี เข้มข้น',
    price: 65,
    emoji: '🍵',
    color: '#D9E6C8',
    optionGroups: ['temperature', 'sweetness', 'milk'],
  },
  {
    id: 'peach-tea',
    categoryId: 'tea',
    name: 'ชาพีชซ่า',
    description: 'สดชื่น มีเนื้อพีชชิ้น ๆ',
    price: 55,
    emoji: '🍑',
    color: '#FBD5CF',
    optionGroups: ['temperature', 'sweetness'],
  },
  {
    id: 'lemon-tea',
    categoryId: 'tea',
    name: 'ชามะนาว',
    description: 'เปรี้ยวหวาน ดับร้อน',
    price: 45,
    emoji: '🍋',
    color: '#F6EBB8',
    optionGroups: ['temperature', 'sweetness'],
  },

  // Milk & cocoa
  {
    id: 'cocoa',
    categoryId: 'milk',
    name: 'โกโก้ขนนุ่ม',
    description: 'โกโก้เข้ม ท็อปมาร์ชเมลโล่',
    price: 55,
    emoji: '🧸',
    color: '#E1C6B4',
    optionGroups: ['temperature', 'sweetness', 'milk'],
  },
  {
    id: 'pink-milk',
    categoryId: 'milk',
    name: 'นมชมพูอุ้งเท้า',
    description: 'นมเย็นสีชมพู หวานเด็ก ๆ',
    price: 45,
    emoji: '🌸',
    color: '#F8D3DB',
    badge: 'new',
    optionGroups: ['temperature', 'sweetness'],
  },
  {
    id: 'caramel-milk',
    categoryId: 'milk',
    name: 'นมสดคาราเมล',
    description: 'นมสดหอม ๆ ผสมคาราเมลเค็ม',
    price: 55,
    emoji: '🥛',
    color: '#F3E2CC',
    optionGroups: ['temperature', 'sweetness', 'milk'],
  },

  // Bakery
  {
    id: 'croissant',
    categoryId: 'bakery',
    name: 'ครัวซองต์เนยสด',
    description: 'กรอบนอก นุ่มใน',
    price: 55,
    emoji: '🥐',
    color: '#F4DDB8',
    optionGroups: ['warmUp'],
  },
  {
    id: 'brownie',
    categoryId: 'bakery',
    name: 'บราวนี่หน้าฟิล์ม',
    description: 'หนึบ ช็อกโกแลตแน่น ๆ',
    price: 60,
    emoji: '🟫',
    color: '#DFC4B2',
    optionGroups: ['warmUp'],
  },
  {
    id: 'paw-cookie',
    categoryId: 'bakery',
    name: 'คุกกี้อุ้งเท้าแมว',
    description: 'คุกกี้เนยรูปอุ้งเท้า 3 ชิ้น',
    price: 35,
    emoji: '🐾',
    color: '#F8DDE2',
    badge: 'new',
    optionGroups: [],
  },
  {
    id: 'cheesecake',
    categoryId: 'bakery',
    name: 'บาสก์ชีสเค้ก',
    description: 'หน้าไหม้ เนื้อเนียนละลาย',
    price: 75,
    emoji: '🍰',
    color: '#F6E6C9',
    optionGroups: [],
  },
]
