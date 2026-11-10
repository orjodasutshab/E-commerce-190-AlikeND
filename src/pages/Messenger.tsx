import { useState, useRef, useEffect, FormEvent, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Send, Phone, Video, Search, Image, Paperclip, CheckCircle, Clock, MoreVertical, Ban, VolumeX, Volume2, X } from 'lucide-react';
import { Contact, Message } from '../types';

interface MessengerProps {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  user: { name: string; email: string; phone: string } | null;
  onNavigate?: (view: string) => void;
}

export default function Messenger({ contacts, setContacts, showToast, user, onNavigate }: MessengerProps) {
  const customerName = user?.name ? user.name.split(' ')[0] : 'Customer';

  const personalizeText = (text: string): string => {
    if (!text) return text;
    return text
      .replace(/\bDear customer\b/gi, `Dear ${customerName}`)
      .replace(/\bDear client\b/gi, `Dear ${customerName}`)
      .replace(/\bNoble customer\b/gi, `Dear ${customerName}`)
      .replace(/\bVIP client\b/gi, `VIP client ${customerName}`);
  };

  const [activeContactId, setActiveContactId] = useState<string>(() => contacts[0]?.id || 'contact-alike-support');
  const [messageText, setMessageText] = useState<string>('');
  const [contactSearch, setContactSearch] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState<boolean>(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  const lastActiveContactIdRef = useRef<string>(activeContactId);
  const lastMsgCountRef = useRef<number>(0);

  useEffect(() => {
    const currentLength = activeContact?.messages?.length || 0;
    const isChannelSwitch = lastActiveContactIdRef.current !== activeContactId;

    if (isChannelSwitch) {
      // Switched channels - scroll instantly to bottom
      scrollToBottom(false);
      lastActiveContactIdRef.current = activeContactId;
    } else if (currentLength > lastMsgCountRef.current) {
      // Message added to same channel - scroll smoothly to bottom
      scrollToBottom(true);
    }

    lastMsgCountRef.current = currentLength;
  }, [activeContactId, activeContact?.messages?.length]);

  useEffect(() => {
    if (isAiAnalyzing) {
      scrollToBottom(true);
    }
  }, [isAiAnalyzing]);

  // Handle outside click to close options dropdown
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowDropdown(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file to upload.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPendingImage(event.target.result as string);
          showToast('Image staged for dispatch. Send to analyze.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();

    if (activeContact.isBlocked) {
      showToast('This butler channel is blocked. Unblock to resume chat.', 'warning');
      return;
    }

    if (!messageText.trim() && !pendingImage) return;
    if (isTransmitting) return;

    setIsTransmitting(true);

    const userMsgId = `usr-m-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSending: true,
      isDelivered: false,
      ...(pendingImage ? { image: pendingImage } : {})
    };

    const hasImageSent = !!pendingImage;
    const sentText = messageText;

    // Immediately update list state locally
    setContacts((prevContacts) =>
      prevContacts.map((c) => {
        if (c.id === activeContactId) {
          return {
            ...c,
            lastMessage: hasImageSent ? '📷 Photo attachment dispatched' : sentText,
            timestamp: 'Just now',
            messages: [...(c.messages || []), userMsg]
          };
        }
        return c;
      })
    );

    // Clear user message composing boxes immediately
    setMessageText('');
    setPendingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollToBottom(true);
    }, 50);

    // Brief timeout simulating network delivery delay of 800ms
    setTimeout(() => {
      setContacts((prevContacts) =>
        prevContacts.map((c) => {
          if (c.id === activeContactId) {
            return {
              ...c,
              messages: (c.messages || []).map((m) =>
                m.id === userMsgId ? { ...m, isSending: false, isDelivered: true } : m
              )
            };
          }
          return c;
        })
      );
      setIsTransmitting(false);

      if (hasImageSent && (activeContactId === 'contact-alike-support' || activeContact.name.toLowerCase().includes('concierge'))) {
        setIsAiAnalyzing(true);
      }

      // Butler responds after another delay
      setTimeout(() => {
        setIsAiAnalyzing(false);

        setContacts((prevContacts) => {
          const currentRef = prevContacts.find((c) => c.id === activeContactId);
          if (!currentRef || currentRef.isBlocked) return prevContacts;

          let autoReplyText = '';

          if (hasImageSent) {
            if (activeContactId === 'contact-alike-support' || currentRef.name.toLowerCase().includes('concierge')) {
              autoReplyText = `Dear ${customerName}, our high-end Butler Vision System has processed your visual upload. Specifically, we detected authentic stitch vectors and precious metal refractions of an elite Alike-ND luxury asset. This artifact is authenticated 100% genuine under sovereign dark lodge standards. Staging code is updated to PRIORITY status. ✨`;
            } else if (activeContactId === 'contact-jewel-boutique') {
              autoReplyText = `Dear ${customerName}, your visual preview has been shared directly with our lead jeweler in Florence. We have verified the certified gold weight and pristine bezel index layouts matching this snapshot. Parcel preparations have been expedited.`;
            } else {
              autoReplyText = `Dear ${customerName}, we have cataloged this photo attachment under your order routing. Dispatch curators are preparing transit boarding.`;
            }
          } else {
            const autoReplyTextRaw = {
              'contact-alike-support': 'Noble customer, your personal Alike Butler has verified this routing segment. A client consultant will arrive at this channel momentarily.',
              'contact-jewel-boutique': 'Dear client, yes! The Italian Venetian dip chain is fully crafted in Florence. We can provide custom certificates of gold weight inside your parcel.',
              'contact-gaming-hub': 'No worries gamer! We cleared your gold controller holding limit, we are packing it next.'
            }[activeContactId] || 'Greetings VIP client! Alike-ND Concierge has received your bespoke inquiry. Our physical dark store atelier is preparing immediate feedback.';

            autoReplyText = personalizeText(autoReplyTextRaw);
          }

          const butlerMsg: Message = {
            id: `bt-reply-${Date.now()}`,
            text: autoReplyText,
            sender: 'contact',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };

          if (!currentRef.isMuted) {
            showToast('Boutique Butler responded!', 'info');
          }

          return prevContacts.map((c) => {
            if (c.id === activeContactId) {
              return {
                ...c,
                lastMessage: autoReplyText,
                timestamp: 'Just now',
                messages: [...(c.messages || []), butlerMsg]
              };
            }
            return c;
          });
        });
      }, hasImageSent ? 2000 : 1200);

    }, 800);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div id="messenger-root" className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-fade-in">
      <div className="bg-neutral-900 border border-solid border-neutral-800/90 rounded-2xl overflow-hidden shadow-2xl h-[600px] grid grid-cols-1 md:grid-cols-12 transition-all">
        
        {/* Left Side: Contacts directory list */}
        <div className="md:col-span-4 border-r border-solid border-neutral-800/90 bg-neutral-950 flex flex-col h-full">
          {/* Query Filter row */}
          <div className="p-4 md:p-5 border-b border-solid border-neutral-800/90 space-y-3 shrink-0 bg-neutral-950/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-white font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                Concierge Channels
              </h3>
              <span className="text-[10px] text-neutral-500 font-mono">{filteredContacts.length} Corridors</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <input
                id="contact-search-bar"
                type="text"
                placeholder="Search boutiques, support threads..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-neutral-900 border border-solid border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]/60 transition-all duration-200"
              />
            </div>
          </div>

          {/* Directory listings */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 scrollbar-thin">
            {filteredContacts.map((c) => {
              const isBlocked = c.isBlocked;
              const isMuted = c.isMuted;
              const isSelected = c.id === activeContactId;
              return (
                <div
                  key={c.id}
                  id={`contact-row-${c.id}`}
                  onClick={() => {
                    setActiveContactId(c.id);
                    // Clear unread counts upon inspection
                    setContacts(contacts.map(item => item.id === c.id ? { ...item, unreadCount: 0 } : item));
                  }}
                  className={`p-3.5 rounded-xl flex items-center gap-3.5 cursor-pointer transition-all duration-300 relative select-none border-l-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D4AF37]/15 via-neutral-900 to-neutral-900 border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.08)]'
                      : 'hover:bg-neutral-900/70 border-transparent hover:border-neutral-700/60'
                  }`}
                >
                  {/* Photo with status dot indicator */}
                  <div className="relative shrink-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className={`w-11 h-11 rounded-full object-cover border border-solid transition-all duration-300 ${
                        isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md' : 'border-neutral-800'
                      }`}
                    />
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-neutral-950 ${
                      c.isOnline && !isBlocked ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-neutral-600'
                    }`} />
                  </div>

                  <div className="text-xs flex-1 min-w-0 pr-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0 font-extrabold">
                        <h4 className={`truncate uppercase text-[12px] tracking-wider font-extrabold max-w-[80%] transition-colors duration-200 ${
                          isSelected ? 'text-[#D4AF37]' : 'text-white'
                        }`}>
                          {c.name}
                        </h4>
                        {isMuted && <VolumeX className="w-3.5 h-3.5 text-neutral-500 shrink-0" />}
                        {isBlocked && <Ban className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                      </div>
                      <span className="text-[9px] text-neutral-500 font-mono font-medium shrink-0 ml-1">{c.timestamp}</span>
                    </div>
                    <p className="text-neutral-400 truncate text-[11px] font-medium leading-relaxed">
                      {isBlocked ? '🚫 Channel Blocked' : c.lastMessage}
                    </p>
                  </div>

                  {c.unreadCount > 0 && !isMuted && !isBlocked && (
                    <span className="shrink-0 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-black text-[9px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.5)] ring-2 ring-neutral-950">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Visual conversation workspace */}
        <div className="hidden md:flex md:col-span-8 bg-neutral-900 flex-col h-full relative">
          {/* Channel Header bar with micro controls */}
          <div className="px-6 py-3.5 border-b border-solid border-[#D4AF37]/25 bg-neutral-950/95 shadow-[0_4px_16px_rgba(212,175,55,0.04)] flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover border border-solid border-[#D4AF37]/40 shadow-sm" />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-950 ${
                  activeContact.isOnline && !activeContact.isBlocked ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-neutral-600'
                }`} />
              </div>
              <div className="text-xs">
                <h4 className="text-[14px] font-black text-white uppercase tracking-wider flex items-center gap-2">
                  {activeContact.name}
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    VIP CORRIDOR
                  </span>
                </h4>
                <p className="text-neutral-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeContact.isOnline && !activeContact.isBlocked ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                  {activeContact.isBlocked ? 'Blocked corridor' : activeContact.isOnline ? 'Active client agent online' : 'Offline. Butler active'}
                </p>
              </div>
            </div>

            {/* Video, Vocal calls triggers & Dropdown menu */}
            <div className="flex items-center gap-1.5 text-neutral-400 relative" onClick={(e) => e.stopPropagation()}>
              <button
                id="chat-call-audio"
                disabled={activeContact.isBlocked}
                onClick={() => alert(`Starting audio encryption tunnel with ${activeContact.name}...`)}
                className="p-2 hover:text-white hover:bg-neutral-850 rounded-lg transition-all duration-200 disabled:opacity-30 cursor-pointer hover:scale-105 active:scale-95"
                title="Initiate voice call"
              >
                <Phone className="w-4.5 h-4.5" />
              </button>
              <button
                id="chat-call-video"
                disabled={activeContact.isBlocked}
                onClick={() => alert(`Launching physical high-def video stream tunnel with ${activeContact.name}...`)}
                className="p-2 hover:text-white hover:bg-neutral-850 rounded-lg transition-all duration-200 disabled:opacity-30 cursor-pointer hover:scale-105 active:scale-95"
                title="Initiate video call"
              >
                <Video className="w-4.5 h-4.5" />
              </button>

              {/* Three dot More Options Menu */}
              <button
                id="chat-more-options"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-2 hover:text-white hover:bg-neutral-850 rounded-lg transition-all duration-200 cursor-pointer ${showDropdown ? 'text-[#D4AF37] bg-neutral-850' : ''}`}
                title="More Options"
              >
                <MoreVertical className="w-4.5 h-4.5" />
              </button>

              {/* Dropdown Card */}
              {showDropdown && (
                <div className="absolute right-0 top-12 bg-neutral-950 border border-solid border-neutral-800 rounded-xl shadow-2xl p-1.5 w-48 z-30 animate-fade-in text-xs font-semibold">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (activeContact.isBlocked) {
                        // Unblock immediately
                        setContacts(contacts.map(c => c.id === activeContactId ? { ...c, isBlocked: false } : c));
                        showToast(`${activeContact.name} unblocked successfully`, 'success');
                      } else {
                        // Confirmation prompt
                        setShowBlockConfirm(true);
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-neutral-300 hover:bg-neutral-900 rounded-lg flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <Ban className={`w-3.5 h-3.5 ${activeContact.isBlocked ? 'text-green-500' : 'text-red-500'}`} />
                    <span>{activeContact.isBlocked ? 'Unblock Curator' : 'Block Advisor'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      const isCurrentlyMuted = activeContact.isMuted;
                      setContacts(contacts.map(c => c.id === activeContactId ? { ...c, isMuted: !isCurrentlyMuted } : c));
                      showToast(isCurrentlyMuted ? 'Notifications revived' : 'Channel notifications muted', 'info');
                    }}
                    className="w-full text-left px-3 py-2 text-neutral-300 hover:bg-neutral-900 rounded-lg flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    {activeContact.isMuted ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-green-500" />
                        <span>Restore Notices</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-500" />
                        <span>Mute Notices</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Stream list with smooth transition on channel switch */}
          <div
            key={activeContactId}
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-5 bg-gradient-to-b from-[#0b0f17] via-[#0f141f] to-neutral-950 animate-fade-in transition-all duration-300"
          >
            {activeContact.messages.map((m) => {
              const fromMe = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex ${fromMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`max-w-[76%] md:max-w-[68%] p-4 md:p-4.5 rounded-2xl transition-all duration-200 ${
                    fromMe
                      ? 'bg-gradient-to-br from-[#0c182b] to-[#12243d] border border-solid border-[#D4AF37]/35 text-[#FFFDE6] rounded-tr-none shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_12px_rgba(212,175,55,0.06)]'
                      : 'bg-[#181c24] border border-solid border-neutral-800 text-[#E2E8F0] rounded-tl-none shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                  }`}>
                    {m.image && (
                      <div className="rounded-xl overflow-hidden border border-solid border-neutral-700/80 max-w-full sm:max-w-xs bg-neutral-950 select-none mb-2 shadow-inner">
                        <img src={m.image} alt="User visual upload" className="w-full h-auto max-h-48 object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    {m.text && (
                      <p className="leading-relaxed font-semibold text-xs md:text-[13px] whitespace-pre-line tracking-wide">
                        {personalizeText(m.text)}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-white/5 text-[9px] text-neutral-400 font-mono">
                      <span>{m.timestamp}</span>
                      {fromMe && (
                        m.isSending ? (
                          <span className="flex items-center gap-1 text-[#D4AF37] animate-pulse">
                            <Clock className="w-3 h-3 animate-spin text-[#D4AF37]" />
                            <span>Dispatching</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#D4AF37]">
                            <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                            <span className="font-semibold text-[#D4AF37]">Delivered</span>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isAiAnalyzing && (
              <div className="flex justify-start animate-pulse">
                <div className="max-w-[70%] p-4 rounded-2xl bg-[#181c24] border border-solid border-[#D4AF37]/30 space-y-1.5 text-neutral-300 rounded-tl-none shadow-lg">
                  <div className="flex items-center gap-2 text-[10px] text-[#D4AF37] font-extrabold font-mono tracking-widest uppercase">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                    </span>
                    Atelier Butler Authenticating Asset...
                  </div>
                  <p className="text-[10px] text-neutral-400 font-medium">Examining visual metal refractions and stitching precision... Please wait.</p>
                </div>
              </div>
            )}

            <div className="h-1" />
          </div>

          {/* User Input bar */}
          <form
            onSubmit={handleSend}
            className="p-4 md:px-6 md:py-4 border-t border-solid border-neutral-800/90 bg-neutral-950 flex flex-col gap-3 shrink-0"
            id="chat-user-input-form"
          >
            {/* Staged Image Thumbnail preview */}
            {pendingImage && (
              <div className="flex items-center gap-3 bg-neutral-900 border border-solid border-neutral-800 p-2.5 rounded-xl relative self-start max-w-xs animate-fade-in group shadow-lg">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-solid border-neutral-700">
                  <img src={pendingImage} alt="Staged upload preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] min-w-0 pr-6">
                  <p className="text-white font-semibold truncate font-mono text-[9px]">staged_asset.png</p>
                  <p className="text-[#D4AF37] font-medium text-[8px] uppercase tracking-wide">Ready to dispatch</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPendingImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center border border-solid border-neutral-950 shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-90"
                  title="Remove staged image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Block Warning alert */}
            {activeContact.isBlocked && (
              <div className="flex items-center gap-2 bg-red-950/40 border border-solid border-red-900/30 text-red-400 p-2.5 rounded-xl text-[10px] font-semibold tracking-wide uppercase justify-center animate-fade-in">
                <span>🚫 You have blocked this concierge channel. Unblock from options to resume.</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="hidden-image-upload-input"
              />

              {/* Attachment clips */}
              <div className="flex gap-1 text-neutral-400 shrink-0">
                <button
                  type="button"
                  disabled={activeContact.isBlocked}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:text-white rounded-xl hover:bg-neutral-900 cursor-pointer disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Attach image"
                >
                  <Image className="w-4.5 h-4.5 text-neutral-400 hover:text-[#D4AF37] transition-colors" />
                </button>
                <button
                  type="button"
                  disabled={activeContact.isBlocked}
                  onClick={() => {
                    if (activeContact.isBlocked) return;
                    showToast('Secure file locker index opened', 'info');
                  }}
                  className="p-2 hover:text-white rounded-xl hover:bg-neutral-900 cursor-pointer disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Attach file"
                >
                  <Paperclip className="w-4.5 h-4.5 text-neutral-400 hover:text-[#D4AF37] transition-colors" />
                </button>
              </div>

              <input
                id="chat-text-input"
                type="text"
                disabled={activeContact.isBlocked}
                placeholder={activeContact.isBlocked ? "Channel is currently blocked..." : "Type your message..."}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-neutral-900 border border-solid border-neutral-800 rounded-xl focus:outline-none focus:border-[#D4AF37] text-xs text-white placeholder-neutral-500 disabled:opacity-50 transition-all duration-200"
              />

              <button
                id="chat-send-submit"
                type="submit"
                disabled={activeContact.isBlocked}
                className="px-5 py-2.5 uppercase font-black text-[11px] tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-black rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none shrink-0"
              >
                <Send className="w-3.5 h-3.5 inline-block mr-1.5" /> Send
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Block Confirmation dialogue backdrop overlay */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowBlockConfirm(false)}>
          <div className="bg-neutral-900 border border-solid border-red-500/40 rounded-2xl shadow-[0_0_35px_rgba(239,68,68,0.15)] max-w-sm w-full p-6 text-center space-y-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Confirm Block Action</h3>
              <p className="text-neutral-400 text-xs">
                Are you sure you want to block <span className="text-white font-semibold">{activeContact.name}</span>? 
                This will cease all communication streams.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBlockConfirm(false)}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-750 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setContacts(contacts.map(c => c.id === activeContactId ? { ...c, isBlocked: true } : c));
                  setShowBlockConfirm(false);
                  showToast(`${activeContact.name} advisor has been blocked`, 'warning');
                }}
                className="px-4 py-2 bg-red-650 text-white rounded-xl hover:bg-red-700 text-xs font-semibold cursor-pointer"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
