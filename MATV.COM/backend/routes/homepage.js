import express from 'express'
import Homepage from '../models/Homepage.js'
const router = express.Router()

// GET: Fetch homepage content
router.get('/', async (req, res) => {
  const content = await Homepage.findOne()
  res.json(content)
})

// POST: Create or Update homepage content
router.post('/', async (req, res) => {
  const { headline, mainImage, trendingTopics } = req.body

  let content = await Homepage.findOne()
  if (content) {
    content.headline = headline
    content.mainImage = mainImage
    content.trendingTopics = trendingTopics
    await content.save()
  } else {
    content = await Homepage.create({ headline, mainImage, trendingTopics })
  }

  res.json({ message: 'Homepage content updated', content })
})

export default router
