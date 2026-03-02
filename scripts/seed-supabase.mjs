import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const categoryConfig = {
  miTierraQuerida: {
    slug: 'mi-tierra-querida',
    label: 'Mi Tierra Querida',
    heroLocalPath: 'src/assets/miTierraQuerida.jpg',
  },
  beisbol: {
    slug: 'beisbol',
    label: 'Beisbol',
    heroLocalPath: 'src/assets/beisbol.jpg',
  },
  basketball: {
    slug: 'basketball',
    label: 'Basketball',
    heroLocalPath: 'src/assets/basketball.jpg',
  },
  kids: {
    slug: 'kids',
    label: 'Niños',
    heroLocalPath: 'src/assets/kids.png',
  },
  moda: {
    slug: 'moda',
    label: 'Moda',
    heroLocalPath: 'src/assets/images/moda/moda1.webp',
  },
}

function mimeFromExt(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.webp') return 'image/webp'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  return 'application/octet-stream'
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uploadFileToBucket(bucket, localFile, destinationPath) {
  const absPath = path.resolve(ROOT, localFile)
  if (!existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`)
  }

  const buffer = await readFile(absPath)
  const contentType = mimeFromExt(absPath)

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(destinationPath, buffer, {
      upsert: true,
      contentType,
      cacheControl: '31536000',
    })

  if (uploadError) {
    throw new Error(`Upload failed (${bucket}/${destinationPath}): ${uploadError.message}`)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(destinationPath)
  return data.publicUrl
}

async function parseMockProducts() {
  const file = path.resolve(ROOT, 'src/mocks/mockProducts.ts')
  const content = await readFile(file, 'utf8')

  const regex = /\{\s*id:\s*(\d+),\s*imagePath:\s*'([^']+)',\s*category:\s*Categories\.([A-Za-z]+)\s*\}/g
  const products = []
  let match

  while ((match = regex.exec(content)) !== null) {
    products.push({
      legacy_id: Number(match[1]),
      imagePath: match[2],
      categoryKey: match[3],
    })
  }

  return products.sort((a, b) => a.legacy_id - b.legacy_id)
}

async function upsertCategoryImageUrls() {
  for (const [categoryKey, cfg] of Object.entries(categoryConfig)) {
    const ext = path.extname(cfg.heroLocalPath).toLowerCase() || '.webp'
    const destination = `${cfg.slug}/hero${ext}`
    const imageUrl = await uploadFileToBucket('category-images', cfg.heroLocalPath, destination)

    const { error } = await supabase
      .from('categories')
      .update({ image_url: imageUrl })
      .eq('slug', cfg.slug)

    if (error) {
      throw new Error(`Category image update failed (${categoryKey}): ${error.message}`)
    }

    console.log(`✓ Category image: ${cfg.slug}`)
  }
}

async function getCategoryMap() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug')

  if (error) throw new Error(`Cannot load categories: ${error.message}`)

  const map = new Map(data.map((row) => [row.slug, row.id]))
  return map
}

async function upsertProducts() {
  const parsedProducts = await parseMockProducts()
  const categoryIdBySlug = await getCategoryMap()

  for (const product of parsedProducts) {
    const cfg = categoryConfig[product.categoryKey]
    if (!cfg) {
      throw new Error(`Unknown category key in mockProducts: ${product.categoryKey}`)
    }

    const fileName = path.basename(product.imagePath)
    const destination = `${cfg.slug}/${fileName}`
    const localPath = `src/assets/images/${product.imagePath}`
    const imageUrl = await uploadFileToBucket('product-images', localPath, destination)

    const categoryId = categoryIdBySlug.get(cfg.slug)
    if (!categoryId) {
      throw new Error(`Missing category in DB for slug: ${cfg.slug}`)
    }

    const row = {
      legacy_id: product.legacy_id,
      slug: `${cfg.slug}-${product.legacy_id}`,
      name: `${cfg.label} #${product.legacy_id}`,
      category_id: categoryId,
      image_urls: [imageUrl],
      stock: 0,
      is_active: true,
      sort_order: product.legacy_id,
    }

    const { error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'legacy_id' })

    if (error) {
      throw new Error(`Product upsert failed (legacy_id=${product.legacy_id}): ${error.message}`)
    }

    console.log(`✓ Product #${product.legacy_id} (${cfg.slug})`)
  }

  console.log(`\nDone. Seeded/updated ${parsedProducts.length} products.`)
}

async function main() {
  console.log('Seeding Supabase with categories + images + products...\n')

  await upsertCategoryImageUrls()
  await upsertProducts()

  console.log('\nAll done ✅')
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
