'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, Chip } from '@heroui/react';

type Message = {
  type: 'user' | 'bot' | 'suggestion';
  content: string;
  category?: string;
  progress?: number;
};

type PortfolioSection = {
  title: string;
  description: string;
  progress: number;
  tags: string[];
};

const suggestionCategories = [
  { icon: '👨‍💻', label: 'About Me', value: 'about' },
  { icon: '💼', label: 'Experience', value: 'experience' },
  { icon: '🛠️', label: 'Skills', value: 'skills' },
  { icon: '🚀', label: 'Projects', value: 'projects' },
  { icon: '📧', label: 'Contact', value: 'contact' }
];

const portfolioInfo: Record<string, PortfolioSection> = {
  about: {
    description: "I'm a Full Stack Developer specializing in modern web technologies, passionate about creating beautiful and performant web applications.",
    progress: 95,
    tags: ['Full Stack', 'Web Dev', 'UI/UX'],
    title: 'About Me'
  },
  contact: {
    description: "Available for freelance and full-time opportunities. Let's discuss how I can help with your project.",
    progress: 100,
    tags: ['Freelance', 'Full-time', 'Remote'],
    title: 'Contact'
  },
  experience: {
    description: "5+ years of experience in web development, working with startups and enterprise clients to deliver high-quality solutions.",
    progress: 90,
    tags: ['Leadership', 'Agile', 'Team Work'],
    title: 'Experience'
  },
  projects: {
    description: "Portfolio of diverse projects including e-commerce platforms, SaaS applications, and interactive web experiences.",
    progress: 92,
    tags: ['Portfolio', 'Case Studies', 'Live Demos'],
    title: 'Projects'
  },
  skills: {
    description: "Proficient in React, Next.js, Node.js, TypeScript, and modern web development practices. Strong focus on performance and user experience.",
    progress: 88,
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    title: 'Technical Skills'
  }
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'bot', 
      content: `Hi! I'm your portfolio assistant. What would you like to know about?` 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (category: string) => {
    const info = portfolioInfo[category];
    if (!info) return;

    setMessages(prev => [
      ...prev,
      { type: 'user', content: `Tell me about your ${category}` },
      {
        type: 'bot',
        content: info.description,
        category: category,
        progress: info.progress
      }
    ]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { type: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);

    // Process the message and get response
    const response = getBotResponse(inputValue);
    setTimeout(() => {
      setMessages(prev => [...prev, response]);
    }, 500);

    setInputValue('');
  };

  const getBotResponse = (input: string): Message => {
    const lowercaseInput = input.toLowerCase();
    
    for (const [category, info] of Object.entries(portfolioInfo)) {
      if (lowercaseInput.includes(category)) {
        return {
          type: 'bot',
          content: info.description,
          category: category,
          progress: info.progress
        };
      }
    }
    
    return {
      type: 'bot',
      content: "I can tell you about my experience, skills, projects, or how to contact me. What interests you?",
    };
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-96 rounded-2xl bg-background shadow-2xl border border-border overflow-hidden z-40"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-secondary/50 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-grotesk font-bold">Portfolio Assistant</h3>
                  <p className="text-xs text-muted-foreground">Ask me anything about my work</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-background/50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && message.category && (
                    <Card className="w-full">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-grotesk font-bold">{portfolioInfo[message.category].title}</h4>
                          {message.progress && (
                            <div className="text-xs font-mono text-muted-foreground">
                              {message.progress}%
                            </div>
                          )}
                        </div>
                        
                        {message.progress && (
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${message.progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-primary"
                            />
                          </div>
                        )}
                        
                        <p className="text-sm">{message.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {portfolioInfo[message.category].tags.map((tag) => (
                            <Chip key={tag} variant="flat" >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {(message.type === 'bot' && !message.category) && (
                    <div className="bg-secondary/50 rounded-2xl p-4 max-w-[80%]">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                  
                  {message.type === 'user' && (
                    <div className="bg-primary text-primary-foreground rounded-2xl p-4 max-w-[80%]">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
              
              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mt-4">
                {suggestionCategories.map((category) => (
                  <motion.button
                    key={category.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(category.value)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm transition-colors"
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-secondary/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 