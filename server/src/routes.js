const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const router = express.Router();
const prisma = new PrismaClient();

// ========================
// ADMIN ROUTES
// ========================

// Login (Mock - in prod use JWT)
router.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin' || password === 'admin123') {
    return res.json({ success: true, token: 'mock-admin-token' });
  }
  return res.status(401).json({ error: 'Senha incorreta' });
});

// Create Client
router.post('/admin/clients', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Default initial data structure
    const initialData = {
        restaurant: { name, category: 'Gastronomia' },
        user: { name: 'Acesso Cliente', role: 'Gerente' },
        operational: { fichas: [], insumos: [] }
    };

    const client = await prisma.client.create({
      data: {
        name,
        hash,
        data: JSON.stringify(initialData)
      }
    });

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// List Clients
router.get('/admin/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      select: { id: true, name: true, hash: true, createdAt: true }
    });
    res.json(clients);
  } catch {
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

// Delete Client
router.delete('/admin/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.client.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

// ========================
// CLIENT AUTH ROUTES
// ========================

// Register (at end of onboarding)
router.post('/client/register', async (req, res) => {
  try {
    const { hash, email, password } = req.body;
    if (!hash || !email || !password) {
      return res.status(400).json({ error: 'Hash, email e senha são obrigatórios' });
    }

    const existing = await prisma.client.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Este email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.client.update({
      where: { hash },
      data: { email, password: hashedPassword }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar credenciais' });
  }
});

// Client Login
router.post('/client/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client || !client.password) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const valid = await bcrypt.compare(password, client.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    res.json({ success: true, hash: client.hash, name: client.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ========================
// CLIENT ROUTES
// ========================

// Load Data
router.get('/client/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const client = await prisma.client.findUnique({
      where: { hash }
    });

    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });

    res.json(JSON.parse(client.data));
  } catch {
    res.status(500).json({ error: 'Erro ao carregar dados' });
  }
});

// Sync Data (Save)
router.post('/client/:hash/sync', async (req, res) => {
  try {
    const { hash } = req.params;
    const newData = req.body;

    const client = await prisma.client.findUnique({ where: { hash } });
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });

    // Merge logic could be here, but for now we trust the client's latest state (Last Writer Wins)
    // In a real app we'd fetch first, merge, then save.
    
    // Simplification: Update the data blob
    await prisma.client.update({
      where: { hash },
      data: {
        data: JSON.stringify(newData)
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao sincronizar dados' });
  }
});


// ========================
// MENU ENGINEERING ROUTES
// ========================
const multer = require('multer');
const { parseMenuExcel } = require('./services/excelService');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/menu/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const insumos = parseMenuExcel(req.file.buffer, req.file.originalname);
    res.json(insumos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar arquivo' });
  }
});

module.exports = router;

