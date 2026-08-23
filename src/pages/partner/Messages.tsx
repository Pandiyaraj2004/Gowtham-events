import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { db, ChatMessage } from '../../data/db';
import { toast } from 'react-hot-toast';
import { FiSend, FiPaperclip, FiSearch, FiFileText, FiImage } from 'react-icons/fi';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const projectId = 'seraphina-wedding';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = () => {
    db.getChatMessages(projectId).then((data) => {
      setMessages(data);
      db.markChatAsRead(projectId, user?.email || '');
    });
  };

  useEffect(() => {
    loadMessages();
    const unsub = db.subscribeToProjectChanges(projectId, () => {
      loadMessages();
    });
    return unsub;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent, attachment?: any) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      senderEmail: user?.email || 'partner@gowthamevents.com',
      senderName: user?.name || 'Partner',
      recipientEmail: 'admin@gowthamevents.com',
      message: inputText,
      timestamp: new Date().toISOString(),
      read: false,
      attachments: attachment ? [attachment] : undefined,
    };

    try {
      await db.sendChatMessage(newMsg);
      setInputText('');
      loadMessages();

      setIsTyping(true);
      setTimeout(async () => {
        setIsTyping(false);
        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          projectId,
          senderEmail: 'admin@gowthamevents.com',
          senderName: 'Harrison Sterling (Admin)',
          recipientEmail: user?.email || '',
          message: `Operational check parsed. We have logged the coordinates on the calendar layout, ${user?.name.split(' ')[0]}. Thank you for the quick follow-up.`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        await db.sendChatMessage(replyMsg);
        loadMessages();
      }, 2000);

    } catch (err) {
      toast.error('Failed to send message.');
    }
  };

  const handleUploadAttachment = () => {
    const mockAttach = {
      name: 'Lake_Como_Permit_Approved.pdf',
      url: 'https://res.cloudinary.com/demo/image/upload/v1615456321/sample.jpg',
      type: 'file' as const,
    };
    handleSendMessage({ preventDefault: () => {} } as any, mockAttach);
    toast.success('Mock document attachment uploaded.');
  };

  const filteredMessages = messages.filter((m) => 
    m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-3xl premium-shadow overflow-hidden">
      
      {/* Header / Chat Info */}
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-zinc-850 flex items-center justify-between bg-neutral-50/50 dark:bg-zinc-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-sm">
            HS
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-neutral-900 dark:text-zinc-200">Harrison Sterling</h3>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block">Senior Producer</span>
          </div>
        </div>

        {/* Message Search Bar */}
        <div className="relative w-48 sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-450 dark:text-zinc-650" />
          <input
            type="text"
            placeholder="Search chat log..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-805 dark:text-zinc-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4">
        {filteredMessages.map((msg) => {
          const isSender = msg.senderEmail.toLowerCase() === user?.email.toLowerCase();
          return (
            <div key={msg.id} className={`flex gap-3 max-w-lg ${isSender ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                isSender ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-200 dark:bg-zinc-800 text-neutral-800 dark:text-zinc-205'
              }`}>
                {msg.senderName.charAt(0)}
              </div>
              <div className="space-y-1.5">
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                  isSender 
                    ? 'bg-amber-500 text-neutral-950 rounded-tr-none font-medium shadow-sm' 
                    : 'bg-neutral-100 dark:bg-zinc-950 border border-neutral-200/50 dark:border-zinc-850/60 text-neutral-805 dark:text-zinc-250 rounded-tl-none font-light'
                }`}>
                  {msg.message}

                  {/* Render attachments if present */}
                  {msg.attachments && msg.attachments.map((at, idx) => (
                    <a 
                      key={idx} 
                      href={at.url}
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-3.5 p-3 rounded-xl border border-neutral-250 dark:border-zinc-800 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-900 text-neutral-605 dark:text-zinc-400 hover:text-amber-500 transition-colors block"
                    >
                      {at.type === 'image' ? <FiImage className="text-amber-500" /> : <FiFileText className="text-amber-500" />}
                      {at.name}
                    </a>
                  ))}
                </div>
                <div className={`text-[9px] text-neutral-450 dark:text-zinc-550 font-mono ${isSender ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  {isSender && (
                    <span className="ml-1.5 text-emerald-500 font-bold uppercase font-mono tracking-widest">{msg.read ? 'read' : 'sent'}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-zinc-800 text-neutral-850 flex items-center justify-center font-bold text-xs shrink-0">
              H
            </div>
            <div className="bg-neutral-100 dark:bg-zinc-950 border border-neutral-200/50 dark:border-zinc-850 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-zinc-650 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-zinc-650 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-zinc-650 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 dark:border-zinc-850 flex gap-3 bg-neutral-50/30 dark:bg-zinc-950/10">
        <button
          type="button"
          onClick={handleUploadAttachment}
          className="p-3 rounded-xl border border-neutral-250 dark:border-zinc-850 hover:bg-neutral-100 dark:hover:bg-zinc-955 text-neutral-500 dark:text-zinc-450 hover:text-amber-500 dark:hover:text-amber-500 transition-colors cursor-pointer"
          title="Attach reference file"
        >
          <FiPaperclip size={16} />
        </button>
        
        <input
          type="text"
          placeholder="Compose secure partner message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-grow bg-neutral-100 dark:bg-zinc-955 border border-neutral-200 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-neutral-805 dark:text-zinc-200 focus:outline-none"
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
          disabled={!inputText.trim()}
        >
          <FiSend size={15} />
        </button>
      </form>

    </div>
  );
};
export default Messages;
