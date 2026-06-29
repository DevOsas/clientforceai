export const omitDeep = (omit, omitKey) => {
  const keys = Object.keys(omit)
  const omitted = {}

  keys.forEach((key) => {
    if (key !== omitKey) {
      const value = omit[key]

      const skip = [Date, File]
      const isObject =
        typeof value === 'object' && !skip.some((o) => value instanceof o)

      if (Array.isArray(value)) {
        omitted[key] = omitDeepArrayWalk(value, omitKey)
      } else if (isObject && value !== null) {
        omitted[key] = omitDeep(value, omitKey)
      } else {
        omitted[key] = value
      }
    }
  })

  return omitted
}

function omitDeepArrayWalk(arr, key) {
  return arr.map((value) => {
    if (Array.isArray(value)) {
      return omitDeepArrayWalk(value, key)
    } else if (typeof value === 'object') {
      return omitDeep(value, key)
    }

    return value
  })
}

export const stripTags = (text) => {
  const div = document.createElement('div')
  div.innerHTML = text
  return div.textContent || ''
}

export const nl2br = (text) => {
  const result = text.split('\n').reduce((accumulator, string) => {
    if (!Array.isArray(accumulator)) {
      return [accumulator, '<br />', string]
    }
    return accumulator.concat(['<br />', string])
  })

  return Array.isArray(result) ? result.join('') : result
}

export function highlightColor(rgb) {
  if (!rgb.startsWith('rgb')) {
    return rgb
  }

  const splits = rgb.split(',')
  const r = parseInt(splits[0].split('(')[1], 10)
  const g = parseInt(splits[1], 10)
  const b = parseInt(splits[2].split(')')[0], 10)
  const sum = r + g + b
  let color = '#000000'
  if (sum < 180 * 3) {
    color = '#ffffff'
  }

  return color
}
