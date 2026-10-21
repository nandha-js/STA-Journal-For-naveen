// STA Journal Local Storage Service & Initial Data

export const STORAGE_KEYS = {
  JOURNALS: 'sta_journals',
  TRADES: 'sta_trades',
  PROFILE: 'sta_user_profile',
  SETTINGS: 'sta_settings'
};

// Initial Seed Data matching the user's screenshots
export const INITIAL_PROFILE = {
  name: 'Naveen Kumar',
  role: 'Trader',
  avatar: 'NK',
  email: 'naveen.trader@example.com',
  currency: '$',
  portalUrl: 'https://scalpertradingacademy.com'
};

export const INITIAL_JOURNALS = [
  {
    id: 'journal-test1',
    name: 'test1',
    description: 'Scalping tests & live setups',
    color: '#06b6d4', // cyan
    createdAt: '2024-09-15'
  },
  {
    id: 'journal-demo',
    name: 'demo',
    description: 'Main demo journal for scalping',
    color: '#6366f1', // indigo
    createdAt: '2024-10-01'
  }
];

export const INITIAL_TRADES = [
  {
    id: 'trade-demo-1',
    journalId: 'journal-demo',
    date: '2024-10-01',
    time: '10:04',
    pair: 'xAU',
    direction: 'Buy',
    result: 'Win',
    timeframe: '15m',
    session: 'London',
    pnl: 453.00,
    rr: '1:1.1',
    entryType: 'Breakout',
    tradingPlan: 'No Plan',
    emotion: 'Confident',
    notes: 'Clean London session breakout on Gold (XAUUSD) after liquidity sweep of Asian highs. Quick impulse move to TP.',
    chartImage1: '',
    chartUrl2: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    chartUrl3: '',
    exitChart: '',
    createdAt: new Date('2024-10-01T10:04:00').toISOString()
  }
];

// Helper to load or initialize
export const getStoredJournals = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(INITIAL_JOURNALS));
      return INITIAL_JOURNALS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading journals from localStorage:', e);
    return INITIAL_JOURNALS;
  }
};

export const saveStoredJournals = (journals) => {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    syncToLocalFiles({ journals, trades: getStoredTrades(), profile: getStoredProfile() });
  } catch (e) {
    console.error('Error saving journals to localStorage:', e);
  }
};

export const getStoredTrades = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRADES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(INITIAL_TRADES));
      return INITIAL_TRADES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading trades from localStorage:', e);
    return INITIAL_TRADES;
  }
};

export const saveStoredTrades = (trades) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    syncToLocalFiles({ trades, journals: getStoredJournals(), profile: getStoredProfile() });
  } catch (e) {
    console.error('Error saving trades to localStorage:', e);
  }
};

export const getStoredProfile = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading profile from localStorage:', e);
    return INITIAL_PROFILE;
  }
};

export const saveStoredProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    syncToLocalFiles({ profile, trades: getStoredTrades(), journals: getStoredJournals() });
  } catch (e) {
    console.error('Error saving profile to localStorage:', e);
  }
};

// Sync to local physical files on PC (data/trades.json, data/journals.json, data/profile.json)
export const syncToLocalFiles = async (data = null) => {
  try {
    const payload = data || {
      trades: getStoredTrades(),
      journals: getStoredJournals(),
      profile: getStoredProfile()
    };
    const res = await fetch('/api/save-local-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const result = await res.json();
      return result;
    }
  } catch (err) {
    console.warn('Local file server sync notice:', err.message);
  }
  return null;
};

// Load data directly from local physical files
export const loadFromLocalFiles = async () => {
  try {
    const res = await fetch('/api/load-local-files');
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        if (result.trades) localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(result.trades));
        if (result.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(result.journals));
        if (result.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(result.profile));
        return result;
      }
    }
  } catch (err) {
    console.warn('Could not read from local file server:', err.message);
  }
  return null;
};

// Export individual separate files for trades, journals, or profile
export const downloadSeparateFile = (filename, data) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Save directly to custom file on user's PC using Native File System Access API
export const pickAndSaveCustomFile = async (data) => {
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'sta_trading_journal.json',
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      return { success: true, fileName: handle.name };
    } catch (err) {
      if (err.name !== 'AbortError') {
        throw err;
      }
      return { aborted: true };
    }
  } else {
    downloadSeparateFile('sta_trading_journal.json', data);
    return { success: true, fileName: 'sta_trading_journal.json (Downloaded)' };
  }
};

// Analytics Calculations
export const computeStats = (trades = []) => {
  const totalTrades = trades.length;
  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      breakevens: 0,
      winRate: 0,
      lossRate: 0,
      beRate: 0,
      totalPnL: 0,
      avgRR: '1:1.0',
      pairStats: {},
      sessionStats: {},
      planStats: {},
      emotionStats: {}
    };
  }

  let wins = 0;
  let losses = 0;
  let breakevens = 0;
  let totalPnL = 0;

  const pairStats = {};
  const sessionStats = {};
  const planStats = {};
  const emotionStats = {};

  trades.forEach(t => {
    const pnlVal = parseFloat(t.pnl) || 0;
    totalPnL += pnlVal;

    const res = (t.result || '').toLowerCase();
    if (res === 'win') wins++;
    else if (res === 'loss') losses++;
    else breakevens++;

    // Pair
    const pair = (t.pair || 'Other').toUpperCase();
    if (!pairStats[pair]) pairStats[pair] = { count: 0, wins: 0, pnl: 0 };
    pairStats[pair].count++;
    if (res === 'win') pairStats[pair].wins++;
    pairStats[pair].pnl += pnlVal;

    // Session
    const session = t.session || 'Unspecified';
    if (!sessionStats[session]) sessionStats[session] = { count: 0, wins: 0, pnl: 0 };
    sessionStats[session].count++;
    if (res === 'win') sessionStats[session].wins++;
    sessionStats[session].pnl += pnlVal;

    // Plan
    const plan = t.tradingPlan || 'No Plan';
    if (!planStats[plan]) planStats[plan] = { count: 0, wins: 0, pnl: 0 };
    planStats[plan].count++;
    if (res === 'win') planStats[plan].wins++;
    planStats[plan].pnl += pnlVal;

    // Emotion
    const emotion = t.emotion || 'Neutral';
    if (!emotionStats[emotion]) emotionStats[emotion] = { count: 0, wins: 0, pnl: 0 };
    emotionStats[emotion].count++;
    if (res === 'win') emotionStats[emotion].wins++;
    emotionStats[emotion].pnl += pnlVal;
  });

  const winRate = Math.round((wins / totalTrades) * 100);
  const lossRate = Math.round((losses / totalTrades) * 100);
  const beRate = 100 - winRate - lossRate;

  // Format Avg RR from trades if available
  const rrList = trades.map(t => {
    if (!t.rr) return 1.5;
    const parts = String(t.rr).split(':');
    const val = parseFloat(parts[1] || parts[0]);
    return isNaN(val) ? 1.5 : val;
  });
  const avgRRVal = (rrList.reduce((a, b) => a + b, 0) / rrList.length).toFixed(1);

  return {
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate,
    lossRate,
    beRate,
    totalPnL,
    avgRR: `1:${avgRRVal}`,
    pairStats,
    sessionStats,
    planStats,
    emotionStats
  };
};

export const resetAllData = () => {
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(INITIAL_JOURNALS));
  localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(INITIAL_TRADES));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
};

export const exportAllData = () => {
  const exportObj = {
    journals: getStoredJournals(),
    trades: getStoredTrades(),
    profile: getStoredProfile(),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  return JSON.stringify(exportObj, null, 2);
};

export const importAllData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.journals && Array.isArray(data.journals)) {
      saveStoredJournals(data.journals);
    }
    if (data.trades && Array.isArray(data.trades)) {
      saveStoredTrades(data.trades);
    }
    if (data.profile) {
      saveStoredProfile(data.profile);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Calculate exact LocalStorage usage in bytes, KB, and MB
export const getLocalStorageUsage = () => {
  let totalBytes = 0;
  const breakdown = {};
  for (let key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      const itemSize = (localStorage[key].length + key.length) * 2; // UTF-16 string size
      totalBytes += itemSize;
      if (key.startsWith('sta_')) {
        breakdown[key] = (itemSize / 1024).toFixed(1) + ' KB';
      }
    }
  }
  const totalKB = (totalBytes / 1024).toFixed(1);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  const percentage = Math.min(100, ((totalBytes / (5 * 1024 * 1024)) * 100).toFixed(1));
  return { totalBytes, totalKB, totalMB, percentage, breakdown };
};

// Smart client-side image compression so large chart screenshots fit easily in localStorage
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve('');
  });
};

