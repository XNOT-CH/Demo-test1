import { MENU_ITEMS } from '@/data/menu'
import { ORDER_TYPE } from '@/constants/orderType'
import { createCartLine } from '@/utils/cart'
import { getDefaultSelections } from '@/utils/menu'

const SAMPLE_NAMES = ['มิ้นท์', 'ต้นกล้า', 'ส้มโอ', 'บีม', 'แพรว', 'ภูมิ']

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function pickRandom(list) {
  return list[randomInt(0, list.length - 1)]
}

/** Fisher–Yates shuffle, returns a new array. */
function shuffle(list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Builds the input for `createOrder` with random items — used by the staff demo button. */
export function createDemoOrderInput() {
  const items = shuffle(MENU_ITEMS)
    .slice(0, randomInt(1, 3))
    .map((item) => createCartLine(item, getDefaultSelections(item), randomInt(1, 2)))

  return {
    items,
    customerName: pickRandom(SAMPLE_NAMES),
    orderType: pickRandom(Object.values(ORDER_TYPE)),
    note: Math.random() > 0.7 ? 'ไม่ใส่หลอดนะคะ' : '',
    isMine: false,
  }
}
