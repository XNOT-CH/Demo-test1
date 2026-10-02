// Same 4:3 size as the bundled menu photos in assets/menu.
const PHOTO_WIDTH = 720
const PHOTO_HEIGHT = 540
// JPEG rather than WebP: older Safari can't encode WebP from a canvas.
const PHOTO_QUALITY = 0.75

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Not a readable image'))
    }
    img.src = url
  })
}

/**
 * Center-crops a picked photo to 4:3 and shrinks it, so it fits in localStorage.
 * @param {File} file
 * @returns {Promise<string>} JPEG data URL (roughly 30–80 KB)
 */
export async function toMenuPhoto(file) {
  const img = await loadImage(file)
  const scale = Math.max(PHOTO_WIDTH / img.naturalWidth, PHOTO_HEIGHT / img.naturalHeight)
  const cropWidth = PHOTO_WIDTH / scale
  const cropHeight = PHOTO_HEIGHT / scale

  const canvas = document.createElement('canvas')
  canvas.width = PHOTO_WIDTH
  canvas.height = PHOTO_HEIGHT
  const ctx = canvas.getContext('2d')
  // JPEG has no transparency: without a fill, transparent PNG areas would turn black.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, PHOTO_WIDTH, PHOTO_HEIGHT)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    img,
    (img.naturalWidth - cropWidth) / 2,
    (img.naturalHeight - cropHeight) / 2,
    cropWidth,
    cropHeight,
    0,
    0,
    PHOTO_WIDTH,
    PHOTO_HEIGHT,
  )
  return canvas.toDataURL('image/jpeg', PHOTO_QUALITY)
}
