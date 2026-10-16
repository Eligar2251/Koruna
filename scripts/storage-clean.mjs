const REMOVE_BATCH = 100

export function isFolder(item) {
  return item?.id == null
}

export async function collectObjectPaths(listPage, { pageSize = 100, maxObjects = 100_000 } = {}) {
  const paths = []
  const seen = new Set()

  async function walk(prefix) {
    if (seen.has(prefix)) return
    seen.add(prefix)
    let offset = 0
    for (;;) {
      const page = await listPage(prefix, { limit: pageSize, offset })
      if (!page?.length) return
      for (const item of page) {
        const name = item?.name
        if (!name || name === '.' || name === '..') continue
        const objectPath = prefix ? `${prefix}/${name}` : name
        if (isFolder(item)) {
          await walk(objectPath)
          continue
        }
        paths.push(objectPath)
        if (paths.length > maxObjects) {
          throw new Error(
            `В бакете больше ${maxObjects} объектов. Для таких бакетов см. README: aws s3 sync --delete.`,
          )
        }
      }
      if (page.length < pageSize) return
      offset += page.length
    }
  }

  await walk('')
  return paths
}

async function removeByListing(storage, bucketId) {
  const paths = await collectObjectPaths((prefix, page) => listPage(storage, bucketId, prefix, page))
  for (let index = 0; index < paths.length; index += REMOVE_BATCH) {
    const chunk = paths.slice(index, index + REMOVE_BATCH)
    const { error } = await storage.from(bucketId).remove(chunk)
    if (error) throw new Error(error.message || `Не удалось удалить объекты бакета ${bucketId}`)
  }
  return paths.length
}

async function listPage(storage, bucketId, prefix, { limit, offset }) {
  const { data, error } = await storage.from(bucketId).list(prefix, {
    limit,
    offset,
    sortBy: { column: 'name', order: 'asc' },
  })
  if (error) throw new Error(error.message || `Не удалось прочитать бакет ${bucketId}`)
  return data ?? []
}

async function emptyAndDelete(storage, bucketId) {
  let emptyError = null
  if (typeof storage.emptyBucket === 'function') {
    const emptied = await storage.emptyBucket(bucketId)
    if (!emptied?.error) {
      const deleted = await storage.deleteBucket(bucketId)
      if (!deleted?.error) return { method: 'emptyBucket' }
      const again = await storage.emptyBucket(bucketId)
      if (again?.error) {
        throw new Error(again.error.message || `Не удалось повторно очистить бакет ${bucketId}`)
      }
      const deletedAgain = await storage.deleteBucket(bucketId)
      if (deletedAgain?.error) {
        throw new Error(deletedAgain.error.message || `Не удалось удалить бакет ${bucketId}`)
      }
      return { method: 'emptyBucket' }
    }
    emptyError = emptied.error
  }

  try {
    const removed = await removeByListing(storage, bucketId)
    const deleted = await storage.deleteBucket(bucketId)
    if (deleted?.error) throw new Error(deleted.error.message || `Не удалось удалить бакет ${bucketId}`)
    return { method: 'list', removed }
  } catch (err) {
    const first = emptyError?.message ? `emptyBucket: ${emptyError.message}; ` : ''
    throw new Error(`${first}${err.message}`)
  }
}

export async function cleanBuckets(storage, { buckets = [], all = false, dryRun = false } = {}) {
  const listed = await storage.listBuckets()
  if (listed?.error) throw new Error(listed.error.message || 'Не удалось получить список бакетов')

  const existing = listed.data ?? []
  const targets = all
    ? existing
    : existing.filter((bucket) => buckets.includes(bucket.id) || buckets.includes(bucket.name))
  const missing = all
    ? []
    : buckets.filter((name) => !existing.some((bucket) => bucket.id === name || bucket.name === name))

  const report = []
  for (const bucket of targets) {
    if (dryRun) {
      report.push({ bucket: bucket.name || bucket.id, action: 'would-empty' })
      continue
    }
    const result = await emptyAndDelete(storage, bucket.id)
    report.push({ bucket: bucket.name || bucket.id, action: 'deleted', method: result.method })
  }

  return { report, missing }
}
