const express = require('express');
const router = express.Router();
const moment = require('moment'); 
const { body, validationResult } = require('express-validator');
const { Op, Sequelize } = require('sequelize');

const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const Leads = require('../models/leads');
const validator = require('validator');
const dns = require('dns').promises;
const { Parser } = require('json2csv');

const upload = multer({ dest: 'uploads/' });

const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

async function checkDomainActive(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, ""); 
  return phone.startsWith("+1") && cleaned.length >= 10 && cleaned.length <= 15;
}

async function processLead(lead, existingEmails, seenEmails) {
  let score = 0;
  let is_email_valid = 0;
  let is_phone_valid = 0;
  let is_duplicate = 0;

  if (validator.isEmail(lead.email)) {
    is_email_valid = 1;
    const domain = lead.email.split("@")[1].toLowerCase();

    if (freeDomains.includes(domain)) {
      score += 30;
    } else {
      score += 50;
      if (await checkDomainActive(domain)) {
        score += 20;
      }
    }
  } else {
    score += 0;
  }

  // Phone
  if (validatePhone(lead.phone)) {
    score += 20;
    is_phone_valid = 1;
  }

  // Name
  const words = lead.name.trim().split(/\s+/);
  if (words.length > 2 || lead.name.length >= 7) {
    score += 10;
  }

  // Duplicate email
  if (existingEmails.has(lead.email) || seenEmails.has(lead.email)) {
    is_duplicate = 1;
  }
  seenEmails.add(lead.email);

  return {
    ...lead,
    score,
    is_email_valid,
    is_phone_valid,
    is_duplicate,
    created_at: new Date()
  };
}

// POST /leads/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push({
          name: row.name || '',
          email: row.email || '',
          phone: row.phone || '',
          company: row.company || '',
          source: row.source || ''
        });
      })
      .on('end', async () => {
        try {
        
          const dbLeads = await Leads.findAll({ attributes: ['email'] });
          const existingEmails = new Set(dbLeads.map(l => l.email));
          const seenEmails = new Set();
          
          const processed = [];
          for (let r of results) {
            const lead = await processLead(r, existingEmails, seenEmails);
            processed.push(lead);
          }
        
          await Leads.bulkCreate(processed);

          fs.unlinkSync(filePath);

          res.json({ message: 'CSV uploaded & processed', count: processed.length });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Error processing leads', error: err.message });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /leads
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { source: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows, count } = await Leads.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    const leads = await Leads.findAll();
    const totalLeads = leads.length;
    const totalScore = leads.reduce((acc, lead) => acc + (lead.score || 0), 0);
    const avgScore = totalLeads > 0 ? Math.round(totalScore / totalLeads) : 0;
    const validEmails = leads.filter(l => l.is_email_valid == 1).length;
    const validPhone = leads.filter(l => l.is_phone_valid == 1).length;

    res.json({
      totalLeads,
      avgScore,
      validEmails,
      validPhone,
      data: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leads', error: err.message });
  }
});

router.get('/export', async (req, res) => {
  try {
    const leads = await Leads.findAll();
    const fields = ['lead_id', 'name', 'email', 'phone', 'company', 'score'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

module.exports = router;
