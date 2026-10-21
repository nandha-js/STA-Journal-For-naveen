import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomeView from './views/HomeView';
import JournalsView from './views/JournalsView';
import AnalysisView from './views/AnalysisView';
import CalendarView from './views/CalendarView';
import SettingsView from './views/SettingsView';

import NewEntryModal from './components/NewEntryModal';
import NewJournalModal from './components/NewJournalModal';
import ManageJournalModal from './components/ManageJournalModal';
import TradeDetailModal from './components/TradeDetailModal';
import WeeklyReportModal from './components/WeeklyReportModal';
import FloatingSupport from './components/FloatingSupport';

import { 
  getStoredJournals, 
  saveStoredJournals, 
  getStoredTrades, 
  saveStoredTrades, 
  getStoredProfile, 
  saveStoredProfile,
  computeStats,
  loadFromLocalFiles,
  syncToLocalFiles 
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'journals' | 'analysis' | 'calendar' | 'settings'
  const [journals, setJournals] = useState([]);
  const [trades, setTrades] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedJournalId, setSelectedJournalId] = useState(null);

  // Modals state
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [newEntryJournalId, setNewEntryJournalId] = useState(null);

  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [managingJournal, setManagingJournal] = useState(null);

  const [selectedTradeForDetail, setSelectedTradeForDetail] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load from localStorage on mount & sync with physical local files in data/
  useEffect(() => {
    const loadedJournals = getStoredJournals();
    const loadedTrades = getStoredTrades();
    const loadedProfile = getStoredProfile();

    setJournals(loadedJournals);
    setTrades(loadedTrades);
    setProfile(loadedProfile);

    // Sync with physical files on local PC
    loadFromLocalFiles().then((res) => {
      if (res && res.success) {
        if (res.trades) setTrades(res.trades);
        if (res.journals) setJournals(res.journals);
        if (res.profile) setProfile(res.profile);
      } else {
        syncToLocalFiles({ trades: loadedTrades, journals: loadedJournals, profile: loadedProfile });
      }
    });
  }, []);

  // Compute overall stats
  const overallStats = computeStats(trades);

  // Handlers for Trades
  const handleSaveTrade = (tradeData) => {
    let updatedTrades;
    const exists = trades.some(t => t.id === tradeData.id);

    if (exists) {
      updatedTrades = trades.map(t => t.id === tradeData.id ? tradeData : t);
    } else {
      updatedTrades = [tradeData, ...trades];
    }

    setTrades(updatedTrades);
    saveStoredTrades(updatedTrades);

    // If detail modal is currently showing this trade, update it
    if (selectedTradeForDetail?.id === tradeData.id) {
      setSelectedTradeForDetail(tradeData);
    }
  };

  const handleDeleteTrade = (tradeId) => {
    const updatedTrades = trades.filter(t => t.id !== tradeId);
    setTrades(updatedTrades);
    saveStoredTrades(updatedTrades);

    if (selectedTradeForDetail?.id === tradeId) {
      setSelectedTradeForDetail(null);
    }
  };

  // Handlers for Journals
  const handleCreateJournal = (newJournal) => {
    const updated = [...journals, newJournal];
    setJournals(updated);
    saveStoredJournals(updated);
    setSelectedJournalId(newJournal.id);
    setActiveTab('journals');
  };

  const handleUpdateJournal = (updatedJournal) => {
    const updated = journals.map(j => j.id === updatedJournal.id ? updatedJournal : j);
    setJournals(updated);
    saveStoredJournals(updated);
  };

  const handleDeleteJournal = (journalId) => {
    const updatedJournals = journals.filter(j => j.id !== journalId);
    // Also remove trades belonging to this journal
    const updatedTrades = trades.filter(t => t.journalId !== journalId);

    setJournals(updatedJournals);
    setTrades(updatedTrades);
    saveStoredJournals(updatedJournals);
    saveStoredTrades(updatedTrades);

    setSelectedJournalId(null);
  };

  // Handlers for Profile
  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  const handleDataReload = () => {
    setJournals(getStoredJournals());
    setTrades(getStoredTrades());
    setProfile(getStoredProfile());
  };

  // Active journal name for top bar
  const activeJournal = journals.find(j => j.id === selectedJournalId);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-indigo-600 selection:text-white">
      {/* Desktop & Mobile Responsive Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          profile={profile}
          setSelectedJournalId={setSelectedJournalId}
        />
      </div>

      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <TopNav
          activeTab={activeTab}
          activeJournalName={activeJournal?.name}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenNewEntry={(journalId) => {
            setEditingTrade(null);
            setNewEntryJournalId(journalId || selectedJournalId || journals[0]?.id);
            setIsNewEntryOpen(true);
          }}
          profile={profile}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && (
            <HomeView
              profile={profile}
              journals={journals}
              trades={trades}
              stats={overallStats}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenNewEntry={(journalId) => {
                setEditingTrade(null);
                setNewEntryJournalId(journalId || journals[0]?.id);
                setIsNewEntryOpen(true);
              }}
              onOpenNewJournal={() => setIsNewJournalOpen(true)}
              onSelectJournal={(id) => {
                setSelectedJournalId(id);
                setActiveTab('journals');
              }}
              onSelectTrade={(trade) => setSelectedTradeForDetail(trade)}
              onDeleteTrade={handleDeleteTrade}
              onEditTrade={(trade) => {
                setEditingTrade(trade);
                setIsNewEntryOpen(true);
              }}
            />
          )}

          {activeTab === 'journals' && (
            <JournalsView
              journals={journals}
              trades={trades}
              selectedJournalId={selectedJournalId}
              setSelectedJournalId={setSelectedJournalId}
              onOpenNewEntry={(journalId) => {
                setEditingTrade(null);
                setNewEntryJournalId(journalId || selectedJournalId || journals[0]?.id);
                setIsNewEntryOpen(true);
              }}
              onOpenNewJournal={() => setIsNewJournalOpen(true)}
              onOpenManageJournal={(journal) => setManagingJournal(journal)}
              onSelectTrade={(trade) => setSelectedTradeForDetail(trade)}
              onDeleteTrade={handleDeleteTrade}
              onEditTrade={(trade) => {
                setEditingTrade(trade);
                setIsNewEntryOpen(true);
              }}
            />
          )}

          {activeTab === 'analysis' && (
            <AnalysisView
              journals={journals}
              trades={trades}
              onOpenReport={() => setIsReportOpen(true)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              trades={trades}
              onSelectTrade={(trade) => setSelectedTradeForDetail(trade)}
              onDeleteTrade={handleDeleteTrade}
              onEditTrade={(trade) => {
                setEditingTrade(trade);
                setIsNewEntryOpen(true);
              }}
              onOpenNewEntry={() => {
                setEditingTrade(null);
                setIsNewEntryOpen(true);
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onDataReset={handleDataReload}
              journalsCount={journals.length}
              tradesCount={trades.length}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. New / Edit Entry Modal */}
      <NewEntryModal
        isOpen={isNewEntryOpen}
        onClose={() => {
          setIsNewEntryOpen(false);
          setEditingTrade(null);
        }}
        onSaveTrade={handleSaveTrade}
        journals={journals}
        currentJournalId={newEntryJournalId}
        initialTrade={editingTrade}
      />

      {/* 2. New Journal Modal */}
      <NewJournalModal
        isOpen={isNewJournalOpen}
        onClose={() => setIsNewJournalOpen(false)}
        onCreateJournal={handleCreateJournal}
      />

      {/* 3. Manage / Rename / Delete Journal Modal */}
      <ManageJournalModal
        isOpen={!!managingJournal}
        onClose={() => setManagingJournal(null)}
        journal={managingJournal}
        onUpdateJournal={handleUpdateJournal}
        onDeleteJournal={handleDeleteJournal}
      />

      {/* 4. Trade Full Detail Modal */}
      <TradeDetailModal
        isOpen={!!selectedTradeForDetail}
        trade={selectedTradeForDetail}
        onClose={() => setSelectedTradeForDetail(null)}
        onEdit={(trade) => {
          setEditingTrade(trade);
          setIsNewEntryOpen(true);
        }}
        onDelete={handleDeleteTrade}
        journalName={journals.find(j => j.id === selectedTradeForDetail?.journalId)?.name}
      />

      {/* 5. Weekly Report Modal */}
      <WeeklyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stats={overallStats}
        trades={trades}
        profile={profile}
      />

      {/* 6. Floating Support / Client Portal Button matching screenshots */}
      <FloatingSupport profile={profile} />
    </div>
  );
}
