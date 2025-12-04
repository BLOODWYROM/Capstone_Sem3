import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// GET all activities with pagination, sorting, searching, and filtering
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'date',
      sortOrder = 'desc',
      search = '',
      type = '',
      startDate = '',
      endDate = ''
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const where: any = {
      userId: req.user.userId
    };

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get activities with pagination
    const activities = await prisma.activity.findMany({
      where,
      orderBy,
      skip,
      take: limitNum
    });

    // Get total count for pagination
    const total = await prisma.activity.count({ where });

    res.json({
      activities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET single activity by ID
router.get('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const activity = await prisma.activity.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// POST create new activity
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    const { type, name, description, amount, unit, carbonCO2, date } = req.body;

    if (!type || !name || !amount || !unit || carbonCO2 === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const activity = await prisma.activity.create({
      data: {
        userId: req.user.userId,
        type,
        name,
        description: description || '',
        amount: parseFloat(amount),
        unit,
        carbonCO2: parseFloat(carbonCO2),
        date: date ? new Date(date) : new Date()
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// PUT update activity
router.put('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { type, name, description, amount, unit, carbonCO2, date } = req.body;

    // Check if activity exists and belongs to user
    const existing = await prisma.activity.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: {
        type: type || existing.type,
        name: name || existing.name,
        description: description !== undefined ? description : existing.description,
        amount: amount ? parseFloat(amount) : existing.amount,
        unit: unit || existing.unit,
        carbonCO2: carbonCO2 !== undefined ? parseFloat(carbonCO2) : existing.carbonCO2,
        date: date ? new Date(date) : existing.date
      }
    });

    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// DELETE activity
router.delete('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    // Check if activity exists and belongs to user
    const existing = await prisma.activity.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    await prisma.activity.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;
