import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Vite plugin to auto-persist all data directly into separate physical files on your local PC
function localFileStoragePlugin() {
  return {
    name: 'local-file-storage-plugin',
    configureServer(server) {
      const dataDir = path.resolve(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      server.middlewares.use((req, res, next) => {
        // Load data directly from local physical files
        if (req.url === '/api/load-local-files' && req.method === 'GET') {
          try {
            const tradesPath = path.join(dataDir, 'trades.json')
            const journalsPath = path.join(dataDir, 'journals.json')
            const profilePath = path.join(dataDir, 'profile.json')

            const trades = fs.existsSync(tradesPath) ? JSON.parse(fs.readFileSync(tradesPath, 'utf-8')) : null
            const journals = fs.existsSync(journalsPath) ? JSON.parse(fs.readFileSync(journalsPath, 'utf-8')) : null
            const profile = fs.existsSync(profilePath) ? JSON.parse(fs.readFileSync(profilePath, 'utf-8')) : null

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ 
              success: true, 
              trades, 
              journals, 
              profile, 
              dataDir: dataDir.replace(/\\/g, '/') 
            }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
          return
        }

        // Save data directly into local physical files on PC
        if (req.url === '/api/save-local-files' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              if (data.trades) {
                fs.writeFileSync(path.join(dataDir, 'trades.json'), JSON.stringify(data.trades, null, 2), 'utf-8')
              }
              if (data.journals) {
                fs.writeFileSync(path.join(dataDir, 'journals.json'), JSON.stringify(data.journals, null, 2), 'utf-8')
              }
              if (data.profile) {
                fs.writeFileSync(path.join(dataDir, 'profile.json'), JSON.stringify(data.profile, null, 2), 'utf-8')
              }
              // Also update complete backup file
              fs.writeFileSync(path.join(dataDir, 'sta_full_backup.json'), JSON.stringify(data, null, 2), 'utf-8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ 
                success: true, 
                message: 'Successfully saved to local physical files', 
                dataDir: dataDir.replace(/\\/g, '/'),
                timestamp: new Date().toISOString()
              }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), localFileStoragePlugin()],
  server: {
    port: 5173,
    open: false
  }
})
