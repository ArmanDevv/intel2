const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

console.log('Loaded YouTube API Key:', YOUTUBE_API_KEY);

router.post('/search', async (req, res) => {
  let { topics, maxResults = 5 } = req.body;
  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'topics array is required' });
  }

  const branch = "BTech";
  const results = [];

  for (const topic of topics) {
    let foundVideo = null;
    const params = {
      part: 'snippet',
      q: `${topic} ${branch}`,
      type: 'video',
      maxResults,
      order: 'viewCount',
      key: YOUTUBE_API_KEY,
    };
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', { params });
      if (response.data.items.length > 0) {
        const item = response.data.items[0];
        foundVideo = {
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.default.url,
          topic,
        };
      }
    } catch (err) {
      console.error('YouTube API error:', err.response ? err.response.data : err.message);
    }
    // If not found, add a placeholder
    if (!foundVideo) {
      foundVideo = { id: null, title: null, channel: null, thumbnail: null, topic };
    }
    results.push(foundVideo);
  }

  res.json({ videos: results });
});

// Save playlist for a user
router.post('/save-playlist', async (req, res) => {
  const { userId, playlist } = req.body;
  if (!userId || !playlist) return res.status(400).json({ error: 'userId and playlist required' });

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.playlists.push(playlist);
    await user.save();

    res.json({ success: true, playlists: user.playlists });
  } catch (err) {
    console.error('Save playlist error:', err);
    res.status(500).json({ error: 'Failed to save playlist' });
  }
});

module.exports = router;