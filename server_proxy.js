/* server_proxy.js
   Simple Express server with safe stubs for search and summary.
   - Does NOT include any API keys.
   - Optionally you can set OPENAI_API_KEY in environment to enable /api/chat.
   Usage: npm install express node-fetch jsdom sqlite3 body-parser
   Start: node server_proxy.js
*/

const express = require('express');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY || null;

// Simple in-memory sample index to demonstrate search without external APIs
const sampleIndex = [
  {title: 'Hola - saludo', url: 'https://es.example/hola', snippet: 'Hola es una palabra del idioma español usada como saludo.'},
  {title: 'Hola mundo - programación', url: 'https://es.example/hola-mundo', snippet: 'Ejemplo clásico de programa que imprime Hello world.'},
  {title: 'Chronioñ - about', url: 'https://chronion-search.duckdns.org/', snippet: 'Chronioñ es un motor de búsqueda experimental creado por Anyelo.'}
];

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.status(400).json({error:'missing query parameter q'});
  // Very simple relevance scoring: contains words
  const results = sampleIndex
    .map(item => ({
      title: item.title,
      url: item.url,
      snippet: item.snippet,
      score: (item.title + ' ' + item.snippet).toLowerCase().includes(q) ? 1 : 0
    }))
    .sort((a,b) => b.score - a.score)
    .slice(0, 20);
  res.json({query: q, results});
});

// Summary endpoint: extracts small text from a URL and returns a short excerpt
app.get('/api/summary', async (req,res) => {
  const url = req.query.url;
  if(!url) return res.status(400).json({error:'missing url'});
  try{
    const r = await fetch(url, {headers: {'User-Agent':'ChronionBot/1.0'}});
    const html = await r.text();
    const dom = new JSDOM(html);
    const bodyText = dom.window.document.body.textContent || '';
    const excerpt = bodyText.trim().split('\n').map(s=>s.trim()).filter(Boolean).slice(0,5).join(' ');
    res.json({summary: excerpt.slice(0,200)});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'failed to fetch url'});
  }
});

// AI chat endpoint: only works if OPENAI_KEY is set
app.post('/api/chat', async (req,res) =>{
  if(!OPENAI_KEY) return res.status(500).json({error:'AI key not configured'});
  const prompt = req.body.prompt || '';
  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages:[{role:'user', content: prompt}], max_tokens:200 })
    });
    const j = await r.json();
    const reply = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    res.json({reply});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'ai request failed'});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Chronioñ proxy listening on', port));
