const categoryPreviewImageRequire = require.context('./', false, /\.\/.*\.png$/)

export function getCategoryPreviewImage(category: string): string | null {
  try {
    return categoryPreviewImageRequire(`./${category}.png`).default.src
  } catch {
    return null
  }
}
