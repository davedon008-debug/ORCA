import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';

// @desc    Get messages by room
// @route   GET /api/chat/:room
// @access  Private
const getMessagesByRoom = asyncHandler(async (req, res) => {
  const messages = await Message.find({ room: req.params.room })
    .populate('sender', 'name email isAdmin')
    .sort({ createdAt: 1 });
  
  res.json(messages);
});

export { getMessagesByRoom };
