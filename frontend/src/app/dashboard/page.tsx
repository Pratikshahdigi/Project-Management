"use client";
import VoiceBubble from '../../components/VoiceBubble';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, KanbanSquare, Calendar, FolderOpen, 
  DollarSign, Activity, Settings, Send, Sparkles, BrainCircuit,
  LogOut, ShieldCheck, TrendingUp, AlertTriangle, Play, FileCheck, CheckCircle2,
  Clock, Plus, ArrowRight, UserCheck, RefreshCw, Upload, FileText, Trash2, KeyRound, UserMinus, ShieldAlert,
  Mic, MicOff
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userName, setUserName] = useState('Alexander Vance');
  const [userRole, setUserRole] = useState('CEO');
  const [userEmail, setUserEmail] = useState('ceo@agency.com');
  const [token, setToken] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Notification and Task Modal states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedNotificationTask, setSelectedNotificationTask] = useState<any | null>(null);

  // New task form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskClientId, setNewTaskClientId] = useState('client-acme-id');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('user-designer-id');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  // Workload balancer state
  const [balancedAssignee, setBalancedAssignee] = useState<string | null>(null);

  // User database state (For CEO User Management screen)
  const [usersList, setUsersList] = useState<any[]>([
    { id: 'user-ceo-id', firstName: 'Alexander', lastName: 'Vance', email: 'ceo@agency.com', role: 'CEO', department: 'Leadership' },
    { id: 'user-manager-id', firstName: 'Olivia', lastName: 'Manager', email: 'manager@agency.com', role: 'Manager', department: 'Operations' },
    { id: 'user-designer-id', firstName: 'Liam', lastName: 'Design', email: 'designer@agency.com', role: 'Designer', department: 'Creative' },
    { id: 'user-sales-id', firstName: 'Sean', lastName: 'Sales', email: 'sales@agency.com', role: 'Sales Executive', department: 'Sales' },
    { id: 'user-social-id', firstName: 'Sofia', lastName: 'Social', email: 'social@agency.com', role: 'Social Media Executive', department: 'Social Media' },
    { id: 'user-client-id', firstName: 'John', lastName: 'Client', email: 'client@acme.com', role: 'Client', department: 'Acme Corporates' },
  ]);

  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskEstMinutes, setNewTaskEstMinutes] = useState('120');

  // User creation form state
  const [newUFirstName, setNewUFirstName] = useState('');
  const [newULastName, setNewULastName] = useState('');
  const [newUEmail, setNewUEmail] = useState('');
  const [newUPassword, setNewUPassword] = useState('');
  const [newURole, setNewURole] = useState('Designer');

  // AI Brain Chat State
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'ai', text: "Hello! I am Nexous, your automated AI companion. How is your mood today, my friend? Have you had your lunch yet? As CEO, you can tell me to perform department tasks like: 'create user [name] email [email] role [role]', 'delete user [name]', 'create client [name]', 'list users', or 'list clients'." }
  ]);

  // Voice control states
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Nexous Live Voice Mode States
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveOrbState, setLiveOrbState] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [liveInterim, setLiveInterim] = useState('');
  const [livePersonality, setLivePersonality] = useState<'Friendly Assistant' | 'Professional Consultant' | 'Business Coach' | 'Technical Expert' | 'Sales Advisor' | 'Marketing Strategist'>('Friendly Assistant');
  const [liveIntent, setLiveIntent] = useState<'Task execution' | 'Information seeking' | 'Business consulting' | 'Scheduling' | 'Marketing' | 'Sales'>('Business consulting');
  const [liveToolStatus, setLiveToolStatus] = useState<string>('Idle');
  const [liveLatency, setLiveLatency] = useState({ stt: 140, ai: 280, tts: 160, total: 580 });
  const [liveMemory, setLiveMemory] = useState({
    userName: 'Alexander Vance',
    userGoal: 'Manage agency pipelines',
    startupType: 'AI Marketing Agency',
    LinkedInFollowers: '5,000',
    LinkedInTarget: 'Personal Branding',
    currentTopic: 'SaaS automation',
    additionalFacts: [
      'Alexander Vance is the Chief Executive Officer.',
      'Active backlog count: 3 items.'
    ]
  });

  // React Refs to prevent stale closure states in web audio callbacks
  const recognitionRef = React.useRef<any>(null);
  const voiceEnabledRef = React.useRef(false);
  const isLiveActiveRef = React.useRef(false);
  const liveMemoryRef = React.useRef(liveMemory);
  const livePersonalityRef = React.useRef(livePersonality);

  React.useEffect(() => {
    recognitionRef.current = recognitionInstance;
  }, [recognitionInstance]);

  React.useEffect(() => {
    voiceEnabledRef.current = isLiveActive ? true : isVoiceEnabled;
  }, [isVoiceEnabled, isLiveActive]);

  React.useEffect(() => {
    isLiveActiveRef.current = isLiveActive;
  }, [isLiveActive]);

  React.useEffect(() => {
    liveMemoryRef.current = liveMemory;
  }, [liveMemory]);

  React.useEffect(() => {
    livePersonalityRef.current = livePersonality;
  }, [livePersonality]);

  // Robust speech synthesis helper
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        // Select English female voices first (Zira, Hazel, Susan, Google default US English female)
        const femaleVoiceNames = ['zira', 'hazel', 'susan', 'female', 'google uk english female', 'karen', 'moira', 'tessa', 'samantha', 'veena', 'victoria'];
        let selectedVoice = voices.find(v => {
          const nameLower = v.name.toLowerCase();
          return v.lang.startsWith('en') && femaleVoiceNames.some(name => nameLower.includes(name));
        });
        
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.name.toLowerCase().includes('female'));
        }
        
        if (!selectedVoice) {
          // If no explicitly female voice, pick an English voice that is NOT male
          selectedVoice = voices.find(v => {
            const nameLower = v.name.toLowerCase();
            return v.lang.startsWith('en') && !nameLower.includes('david') && !nameLower.includes('mark') && !nameLower.includes('male') && !nameLower.includes('george') && !nameLower.includes('ravi') && !nameLower.includes('microsoft david');
          });
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          if (isLiveActiveRef.current) {
            setLiveOrbState('SPEAKING');
          }
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (e) {}
          }
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          if (isLiveActiveRef.current) {
            setLiveOrbState('LISTENING');
          }
          if (voiceEnabledRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          if (isLiveActiveRef.current) {
            setLiveOrbState('LISTENING');
          }
          if (voiceEnabledRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      }
    }
  };

  // Automatic task distribution algorithm
  const handleAutomaticTaskDistribution = async () => {
    const activeTasks = tasks.filter(t => t.status !== 'Completed');
    if (activeTasks.length === 0) {
      const msg = "There are no pending tasks to distribute.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
      speakText(msg);
      return;
    }

    const eligibleEmployees = usersList.filter(u => u.role !== 'Client' && u.role !== 'CEO');
    if (eligibleEmployees.length === 0) {
      const msg = "No eligible employees found in the directory to distribute tasks to.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
      speakText(msg);
      return;
    }

    // Initialize workloads tracking list
    let initialWorkloads = eligibleEmployees.map(emp => {
      const empTasks = activeTasks.filter(t => t.assigneeId === emp.id);
      const totalEstimatedMinutes = empTasks.reduce((sum, t) => sum + 120, 0);
      return {
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        totalEstimatedMinutes
      };
    });

    const distributedLogs: string[] = [];
    const updatedTasksLocal = [...tasks];
    const todoTasks = activeTasks.filter(t => t.status === 'Todo');

    if (todoTasks.length === 0) {
      const msg = "All active tasks are already in progress or review. Workload is balanced.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
      speakText(msg);
      return;
    }

    for (const task of todoTasks) {
      initialWorkloads.sort((a, b) => a.totalEstimatedMinutes - b.totalEstimatedMinutes);
      const bestEmp = initialWorkloads[0];

      if (task.assigneeId === bestEmp.id) {
        bestEmp.totalEstimatedMinutes += 120;
        continue;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/v1/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ assigneeId: bestEmp.id })
        });

        if (response.ok) {
          const idx = updatedTasksLocal.findIndex(t => t.id === task.id);
          if (idx !== -1) {
            updatedTasksLocal[idx] = {
              ...updatedTasksLocal[idx],
              assignee: bestEmp.name,
              assigneeId: bestEmp.id
            };
          }
          distributedLogs.push(`Task '${task.title}' reassigned to ${bestEmp.name}`);
          bestEmp.totalEstimatedMinutes += 120;
        }
      } catch (e) {
        console.error(`Failed to assign task ${task.id} to ${bestEmp.name}`, e);
      }
    }

    setTasks(updatedTasksLocal);

    let finalMsg = '';
    if (distributedLogs.length === 0) {
      finalMsg = "I checked the task board. All tasks are currently distributed optimally.";
    } else {
      finalMsg = `Workload balanced successfully. Reassigned ${distributedLogs.length} tasks: ${distributedLogs.join(', ')}.`;
    }

    setChatMessages(prev => [...prev, { sender: 'ai', text: finalMsg }]);
    speakText(finalMsg);
  };

  // Voice Command Parser
  const handleVoiceCommand = async (command: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: command }]);
    const lowerCmd = command.toLowerCase();

    // Nexus CEO Departmental Voice Commands (User Management & Client Creation)
    if (lowerCmd.startsWith('create user ') || lowerCmd.startsWith('add user ') || lowerCmd.startsWith('create a user ') || lowerCmd.startsWith('add a user ')) {
      let startIdx = 12;
      if (lowerCmd.startsWith('add user ')) startIdx = 9;
      else if (lowerCmd.startsWith('create a user ')) startIdx = 14;
      else if (lowerCmd.startsWith('add a user ')) startIdx = 11;
      
      const userDetails = command.substring(startIdx).trim();
      let namePart = userDetails;
      let emailPart = '';
      let rolePart = 'Designer';

      const emailIdx = userDetails.toLowerCase().indexOf('email');
      const roleIdx = userDetails.toLowerCase().indexOf('role');

      if (emailIdx !== -1) {
        namePart = userDetails.substring(0, emailIdx).trim();
        if (roleIdx !== -1 && roleIdx > emailIdx) {
          emailPart = userDetails.substring(emailIdx + 5, roleIdx).replace(/[\s:]/g, '').trim();
          rolePart = userDetails.substring(roleIdx + 4).replace(/[\s:]/g, '').trim();
        } else {
          emailPart = userDetails.substring(emailIdx + 5).replace(/[\s:]/g, '').trim();
        }
      }

      const names = namePart.split(' ');
      const firstName = names[0] || 'New';
      const lastName = names.slice(1).join(' ') || 'User';
      const email = emailPart || `${firstName.toLowerCase()}@agency.com`;
      const password = 'user123';

      try {
        const response = await fetch('http://localhost:3001/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            role: rolePart,
            department: rolePart === 'Designer' || rolePart === 'Video Editor' ? 'Creative' : rolePart === 'Sales Executive' ? 'Sales' : rolePart.includes('Social') || rolePart.includes('SEO') || rolePart.includes('Ads') ? 'Social Media' : 'Operations'
          })
        });

        if (response.ok) {
          const newUser = await response.json();
          setUsersList(prev => [...prev, {
            id: newUser.id,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            email: newUser.email,
            role: newUser.role,
            department: newUser.department
          }]);
          const msg = `Successfully created user profile for ${firstName} ${lastName} as a ${rolePart}.`;
          setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
          speakText(msg);
        } else {
          throw new Error('API request failed');
        }
      } catch (e) {
        const newId = `user-fallback-${Date.now()}`;
        setUsersList(prev => [...prev, {
          id: newId,
          firstName,
          lastName,
          email,
          role: rolePart,
          department: 'Creative'
        }]);
        const msg = `Successfully created local user draft for ${firstName} ${lastName} as a ${rolePart}.`;
        setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
        speakText(msg);
      }
      return;
    }

    if (lowerCmd.startsWith('delete user ') || lowerCmd.startsWith('remove user ') || lowerCmd.startsWith('delete the user ') || lowerCmd.startsWith('remove the user ')) {
      let userQuery = '';
      if (lowerCmd.startsWith('delete user ')) userQuery = lowerCmd.replace('delete user ', '').trim();
      else if (lowerCmd.startsWith('remove user ')) userQuery = lowerCmd.replace('remove user ', '').trim();
      else if (lowerCmd.startsWith('delete the user ')) userQuery = lowerCmd.replace('delete the user ', '').trim();
      else if (lowerCmd.startsWith('remove the user ')) userQuery = lowerCmd.replace('remove the user ', '').trim();

      const matchedUser = usersList.find(u => 
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(userQuery) || 
        u.firstName.toLowerCase() === userQuery || 
        u.email.toLowerCase() === userQuery
      );

      if (matchedUser) {
        if (matchedUser.id === 'user-ceo-id') {
          const failMsg = "Security constraint. I cannot delete your primary CEO administrator account, Alexander.";
          setChatMessages(prev => [...prev, { sender: 'ai', text: failMsg }]);
          speakText(failMsg);
          return;
        }

        try {
          const response = await fetch(`http://localhost:3001/api/v1/users/${matchedUser.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            setUsersList(prev => prev.filter(u => u.id !== matchedUser.id));
            const msg = `Revoked access and terminated session for ${matchedUser.firstName} ${matchedUser.lastName}.`;
            setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
            speakText(msg);
          } else {
            throw new Error('API delete failed');
          }
        } catch (e) {
          setUsersList(prev => prev.filter(u => u.id !== matchedUser.id));
          const msg = `Terminated local session for ${matchedUser.firstName} ${matchedUser.lastName} (Offline fallback).`;
          setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
          speakText(msg);
        }
      } else {
        const msg = `I could not find a user profile matching ${userQuery} to delete.`;
        setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
        speakText(msg);
      }
      return;
    }

    if (lowerCmd.startsWith('create client ') || lowerCmd.startsWith('add client ') || lowerCmd.startsWith('create client list ') || lowerCmd.startsWith('add client list ') || lowerCmd.startsWith('create a client ') || lowerCmd.startsWith('add a client ')) {
      let startIdx = 14;
      if (lowerCmd.startsWith('add client ')) startIdx = 11;
      else if (lowerCmd.startsWith('create client list ')) startIdx = 19;
      else if (lowerCmd.startsWith('add client list ')) startIdx = 16;
      else if (lowerCmd.startsWith('create a client ')) startIdx = 16;
      else if (lowerCmd.startsWith('add a client ')) startIdx = 13;
      
      const clientDetails = command.substring(startIdx).trim();
      let cleanDetails = clientDetails;
      if (cleanDetails.toLowerCase().startsWith('for ')) {
        cleanDetails = cleanDetails.substring(4).trim();
      } else if (cleanDetails.toLowerCase().startsWith('called ')) {
        cleanDetails = cleanDetails.substring(7).trim();
      }

      let businessName = cleanDetails;
      let contactName = 'John Doe';
      let email = 'info@client.com';
      let budget = 5000;

      const contactIdx = cleanDetails.toLowerCase().indexOf('contact');
      const emailIdx = cleanDetails.toLowerCase().indexOf('email');
      const budgetIdx = cleanDetails.toLowerCase().indexOf('budget');

      if (contactIdx !== -1) {
        businessName = cleanDetails.substring(0, contactIdx).trim();
        if (emailIdx !== -1 && emailIdx > contactIdx) {
          contactName = cleanDetails.substring(contactIdx + 7, emailIdx).replace(/[\s:]/g, ' ').trim();
          if (budgetIdx !== -1 && budgetIdx > emailIdx) {
            email = cleanDetails.substring(emailIdx + 5, budgetIdx).replace(/[\s:]/g, '').trim();
            budget = parseFloat(cleanDetails.substring(budgetIdx + 6).replace(/[\s:$]/g, '').trim()) || 5000;
          } else {
            email = cleanDetails.substring(emailIdx + 5).replace(/[\s:]/g, '').trim();
          }
        }
      }

      try {
        const response = await fetch('http://localhost:3001/api/v1/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            businessName,
            contactName,
            email,
            monthlyBudget: budget,
            monthlyPackage: 'Premium Tier'
          })
        });

        if (response.ok) {
          const newClient = await response.json();
          setClients(prev => [...prev, {
            id: newClient.id,
            businessName: newClient.business_name,
            contactName: newClient.contact_name,
            email: newClient.email,
            budget: newClient.monthly_budget,
            package: newClient.monthly_package,
            risk: 10,
            engagement: 80,
            renewal: 85
          }]);
          const msg = `Successfully created client profile for ${businessName}. Contact person: ${contactName}.`;
          setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
          speakText(msg);
        } else {
          throw new Error('API client creation failed');
        }
      } catch (e) {
        const newId = `client-fallback-${Date.now()}`;
        setClients(prev => [...prev, {
          id: newId,
          businessName,
          contactName,
          email,
          budget,
          package: 'Premium Tier',
          risk: 15,
          engagement: 80,
          renewal: 85
        }]);
        const msg = `Created local draft client profile for ${businessName} (Offline fallback).`;
        setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
        speakText(msg);
      }
      return;
    }

    // CEO list commands
    if (lowerCmd.includes('list user') || lowerCmd.includes('show user') || lowerCmd.includes('who is in my department') || lowerCmd.includes('get user') || lowerCmd.includes('users list') || lowerCmd.includes('user list') || lowerCmd.includes('list employees') || lowerCmd.includes('show employees')) {
      let responseText = `There are currently ${usersList.length} users registered. `;
      const userDescriptions = usersList.map((u, idx) => `${u.firstName} ${u.lastName} works as a ${u.role} in ${u.department}.`);
      responseText += userDescriptions.join(' ');
      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
      speakText(responseText);
      return;
    }

    if (lowerCmd.includes('list client') || lowerCmd.includes('show client') || lowerCmd.includes('client list') || lowerCmd.includes('get client') || lowerCmd.includes('who are our clients') || lowerCmd.includes('clients list')) {
      let responseText = `You have ${clients.length} active clients. `;
      const clientDescriptions = clients.map((c, idx) => `${c.businessName}, with a monthly budget of ${c.budget} dollars.`);
      responseText += clientDescriptions.join(' ');
      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
      speakText(responseText);
      return;
    }

    // CEO Help
    if (lowerCmd.includes('ceo department') || lowerCmd.includes('ceo task') || lowerCmd.includes('what can you do') || lowerCmd.includes('ceo help') || lowerCmd.includes('options') || lowerCmd.includes('help me')) {
      const ceoHelpResponse = "As your Nexous companion, I can execute all CEO department operations. You can ask me to: create a user, delete a user, list users, create a client, or list all clients. For example, say 'create client Acme Corporates' or 'delete user test'.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: ceoHelpResponse }]);
      speakText(ceoHelpResponse);
      return;
    }

    // Jarvis friendly conversational replies (Mood, Lunch, Companion-mode)
    if (lowerCmd.includes('who are you') || lowerCmd.includes('your name') || lowerCmd.includes('what are you') || lowerCmd.includes('who is this') || lowerCmd.includes('nexus') || lowerCmd.includes('nexous')) {
      const friendResponse = "I am Nexous, your fully automated AI companion and friend. I help you manage the CEO department and run this agency smoothly.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: friendResponse }]);
      speakText(friendResponse);
      return;
    }

    if (lowerCmd.includes('how are you') || lowerCmd.includes("how's it going") || lowerCmd.includes('how are you doing')) {
      const friendResponse = "I am doing fantastic, Alexander! Ready to help you run the agency today. How is your mood today, my friend?";
      setChatMessages(prev => [...prev, { sender: 'ai', text: friendResponse }]);
      speakText(friendResponse);
      return;
    }

    if (lowerCmd.includes('lunch') || lowerCmd.includes('eat') || lowerCmd.includes('hungry') || lowerCmd.includes('food')) {
      const friendResponse = "Since I am an AI, I only consume electric current, Alexander. But for you, I recommend grabbing a healthy meal from the local cafe to keep your spirits high. Have you had your lunch yet?";
      setChatMessages(prev => [...prev, { sender: 'ai', text: friendResponse }]);
      speakText(friendResponse);
      return;
    }

    if (lowerCmd.includes('tired') || lowerCmd.includes('exhausted') || lowerCmd.includes('sleepy') || lowerCmd.includes('stressed') || lowerCmd.includes('bad') || lowerCmd.includes('sad')) {
      const friendResponse = "I'm sorry to hear that, Alexander. Running an agency is a heavy lift. How about you take a quick coffee break? I'll handle the task board and keep tabs on the designers.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: friendResponse }]);
      speakText(friendResponse);
      return;
    }

    if (lowerCmd.includes('good') || lowerCmd.includes('great') || lowerCmd.includes('fine') || lowerCmd.includes('happy') || lowerCmd.includes('excellent') || lowerCmd.includes('awesome')) {
      const friendResponse = "That's wonderful, Alexander! A high-energy mood is perfect for tackling today's pipelines. Let's conquer the agency's goals!";
      setChatMessages(prev => [...prev, { sender: 'ai', text: friendResponse }]);
      speakText(friendResponse);
      return;
    }

    // Jarvis CEO Navigation controls
    if (lowerCmd.startsWith('go to ') || lowerCmd.startsWith('show ') || lowerCmd.startsWith('open ')) {
      const tabQuery = lowerCmd.replace('go to ', '').replace('show ', '').replace('open ', '').trim();
      let targetTab = '';
      let speakTabName = '';
      if (tabQuery.includes('overview') || tabQuery.includes('dashboard') || tabQuery.includes('main')) {
        targetTab = 'overview';
        speakTabName = 'Overview Dashboard';
      } else if (tabQuery.includes('task') || tabQuery.includes('kanban') || tabQuery.includes('board')) {
        targetTab = 'tasks';
        speakTabName = 'Tasks Board';
      } else if (tabQuery.includes('social') || tabQuery.includes('campaign') || tabQuery.includes('post') || tabQuery.includes('planner')) {
        targetTab = 'social';
        speakTabName = 'Social Planner';
      } else if (tabQuery.includes('storage') || tabQuery.includes('vault') || tabQuery.includes('file') || tabQuery.includes('drive')) {
        targetTab = 'storage';
        speakTabName = 'Client Storage Vaults';
      } else if (tabQuery.includes('sales') || tabQuery.includes('crm') || tabQuery.includes('lead') || tabQuery.includes('pipeline')) {
        targetTab = 'sales';
        speakTabName = 'Sales CRM Pipeline';
      } else if (tabQuery.includes('user') || tabQuery.includes('access') || tabQuery.includes('employee') || tabQuery.includes('directory')) {
        targetTab = 'user_management';
        speakTabName = 'User Access Management';
      }

      if (targetTab) {
        setActiveTab(targetTab);
        const navMsg = `Navigating to ${speakTabName}.`;
        setChatMessages(prev => [...prev, { sender: 'ai', text: navMsg }]);
        speakText(navMsg);
        return;
      }
    }

    // Jarvis sales proposal quick trigger
    if (lowerCmd.includes('compile proposal for') || lowerCmd.includes('generate proposal for') || lowerCmd.includes('sales proposal for')) {
      const companyQuery = lowerCmd.split('proposal for')[1]?.trim();
      if (companyQuery) {
        const matchedLead = salesLeads.find(l => l.company.toLowerCase().includes(companyQuery));
        if (matchedLead) {
          setActiveTab('sales');
          handleGenerateProposal(matchedLead);
          const msg = `Navigating to Sales and compiling proposal for ${matchedLead.company}.`;
          setChatMessages(prev => [...prev, { sender: 'ai', text: msg }]);
          speakText(msg);
          return;
        }
      }
    }

    // 1. Task check command
    if (lowerCmd.includes('check task') || lowerCmd.includes('what are the task') || lowerCmd.includes('show task') || lowerCmd.includes('today task') || lowerCmd.includes('what is my task') || lowerCmd.includes('tasks')) {
      const activeTasks = tasks.filter(t => t.status !== 'Completed');
      let responseText = '';
      if (activeTasks.length === 0) {
        responseText = "You have no pending tasks in your backlog today. Excellent work!";
      } else {
        responseText = `You have ${activeTasks.length} active tasks. `;
        const taskDescriptions = activeTasks.map((t, idx) => `Task ${idx + 1} is: ${t.title}, assigned to ${t.assignee}, status is ${t.status.replace('_', ' ')}.`);
        responseText += taskDescriptions.join(' ');
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
      speakText(responseText);
      return;
    }

    // 2. Distribute tasks / balance workload command
    if (lowerCmd.includes('distribute') || lowerCmd.includes('balance') || lowerCmd.includes('workload')) {
      speakText("Initiating automatic task distribution and workload balancing.");
      await handleAutomaticTaskDistribution();
      return;
    }

    // 2a. Voice command: Create/add new task
    if (lowerCmd.startsWith('create task ') || lowerCmd.startsWith('add task ')) {
      const taskTitle = command.substring(lowerCmd.startsWith('create task ') ? 12 : 9).trim();
      if (taskTitle) {
        try {
          const res = await fetch('http://localhost:3001/api/v1/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: taskTitle,
              clientId: 'client-acme-id',
              status: 'Todo',
              workflow: 'Assigned',
              priority: 'Medium',
              assigneeId: 'user-designer-id'
            })
          });
          if (res.ok) {
            const t = await res.json();
            const newMappedTask = {
              id: t.id,
              title: t.title,
              description: t.description || '',
              status: t.status,
              workflow: t.design_workflow,
              assignee: 'Liam Design',
              assigneeId: t.assignee_id,
              client: 'Acme Corporates Inc',
              clientId: t.client_id
            };
            setTasks(prev => [...prev, newMappedTask]);
            const successMsg = `Successfully created task: ${taskTitle}. It has been added to the To Do column.`;
            setChatMessages(prev => [...prev, { sender: 'ai', text: successMsg }]);
            speakText(successMsg);
          } else {
            throw new Error('API creation failed');
          }
        } catch (e) {
          const fallbackMsg = `Failed to create task ${taskTitle} in backend. Creating local draft task.`;
          setChatMessages(prev => [...prev, { sender: 'ai', text: fallbackMsg }]);
          speakText(fallbackMsg);
          setTasks(prev => [...prev, {
            id: `task-draft-${Date.now()}`,
            title: taskTitle,
            description: '',
            status: 'Todo',
            workflow: 'Assigned',
            assignee: 'Liam Design',
            assigneeId: 'user-designer-id',
            client: 'Acme Corporates Inc',
            clientId: 'client-acme-id'
          }]);
        }
      }
      return;
    }

    // 2b. Voice command: Complete task
    if (lowerCmd.startsWith('complete task ') || lowerCmd.startsWith('finish task ') || lowerCmd.startsWith('approve task ')) {
      let taskNameQuery = '';
      if (lowerCmd.startsWith('complete task ')) taskNameQuery = lowerCmd.substring(14).trim();
      else if (lowerCmd.startsWith('finish task ')) taskNameQuery = lowerCmd.substring(12).trim();
      else if (lowerCmd.startsWith('approve task ')) taskNameQuery = lowerCmd.substring(13).trim();

      const matchedTask = tasks.find(t => t.title.toLowerCase().includes(taskNameQuery) && t.status !== 'Completed');
      if (matchedTask) {
        try {
          const res = await fetch(`http://localhost:3001/api/v1/tasks/${matchedTask.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'Completed', workflow: 'Published' })
          });
          if (res.ok) {
            setTasks(prev => prev.map(t => t.id === matchedTask.id ? { ...t, status: 'Completed', workflow: 'Published' } : t));
            const successMsg = `Successfully marked task: ${matchedTask.title} as Completed.`;
            setChatMessages(prev => [...prev, { sender: 'ai', text: successMsg }]);
            speakText(successMsg);
          } else {
            throw new Error('API update failed');
          }
        } catch (e) {
          const successMsg = `Locally marked task: ${matchedTask.title} as Completed (Offline fallback).`;
          setTasks(prev => prev.map(t => t.id === matchedTask.id ? { ...t, status: 'Completed', workflow: 'Published' } : t));
          setChatMessages(prev => [...prev, { sender: 'ai', text: successMsg }]);
          speakText(successMsg);
        }
      } else {
        const failMsg = `I could not find an active task matching: ${taskNameQuery}.`;
        setChatMessages(prev => [...prev, { sender: 'ai', text: failMsg }]);
        speakText(failMsg);
      }
      return;
    }

    // 2c. Voice command: Delete/remove task
    if (lowerCmd.startsWith('delete task ') || lowerCmd.startsWith('remove task ')) {
      const taskNameQuery = lowerCmd.substring(lowerCmd.startsWith('delete task ') ? 12 : 12).trim();
      const matchedTask = tasks.find(t => t.title.toLowerCase().includes(taskNameQuery));
      if (matchedTask) {
        try {
          const res = await fetch(`http://localhost:3001/api/v1/tasks/${matchedTask.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            setTasks(prev => prev.filter(t => t.id !== matchedTask.id));
            const successMsg = `Successfully deleted task: ${matchedTask.title} from the board.`;
            setChatMessages(prev => [...prev, { sender: 'ai', text: successMsg }]);
            speakText(successMsg);
          } else {
            throw new Error('API delete failed');
          }
        } catch (e) {
          setTasks(prev => prev.filter(t => t.id !== matchedTask.id));
          const successMsg = `Locally deleted task: ${matchedTask.title} (Offline fallback).`;
          setChatMessages(prev => [...prev, { sender: 'ai', text: successMsg }]);
          speakText(successMsg);
        }
      } else {
        const failMsg = `I could not find any task matching: ${taskNameQuery}.`;
        setChatMessages(prev => [...prev, { sender: 'ai', text: failMsg }]);
        speakText(failMsg);
      }
      return;
    }

    // 3. Fallback AI query
    try {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Processing query with Agency Brain..." }]);
      const response = await fetch('http://localhost:3001/api/v1/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: command })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.response;
        setChatMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs[newMsgs.length - 1]?.text.includes("Processing query")) {
            newMsgs.pop();
          }
          return [...newMsgs, { sender: 'ai', text: aiResponse }];
        });
        speakText(aiResponse);
      } else {
        throw new Error('API query failed');
      }
    } catch (e) {
      let aiResponse = "I have scanned the local database directory. 1 client profile exists. $15,000 budget current limit.";
      if (lowerCmd.includes('leave') || lowerCmd.includes('churn')) {
        aiResponse = "Acme Corporates Inc has a high renewal score of 95% (Safe). However, Beta Biotech Ltd has an engagement score of only 42% and is at HIGH risk of cancellation (Renewal score: 55%).";
      } else if (lowerCmd.includes('overload') || lowerCmd.includes('designer')) {
        aiResponse = "Liam Design has 2 active tasks assigned, currently estimated at 3.5 total remaining hours. Capacity index: 43%. No employee is currently flagged as overloaded or fatiguing.";
      } else if (lowerCmd.includes('task') || lowerCmd.includes('risk')) {
        aiResponse = "Task 'Design Hero Banner Graphic' (Assigned to Liam Design) is marked as Todo but due in 48 hours. Task 'Optimize Google Ads' (Assigned to Olivia Manager) is Urgent and currently in TL Review stage.";
      }

      setChatMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[newMsgs.length - 1]?.text.includes("Processing query")) {
          newMsgs.pop();
        }
        return [...newMsgs, { sender: 'ai', text: aiResponse }];
      });
      speakText(aiResponse);
    }
  };

  const startLiveSession = () => {
    if (!recognitionInstance) {
      alert('Speech Recognition not ready or not supported.');
      return;
    }
    setIsLiveActive(true);
    setLiveOrbState('LISTENING');
    setLiveToolStatus('WebRTC Pipeline Connected');
    
    if (isVoiceEnabled) {
      setIsVoiceEnabled(false);
    }
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    speakText("Nexous Live Voice Mode online. Ready to discuss startups, LinkedIn strategy, or manage users. How can I help you today, my friend?");
    
    // Explicitly start the microphone listener for the live session
    setTimeout(() => {
      try {
        recognitionInstance.start();
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  const stopLiveSession = () => {
    setIsLiveActive(false);
    setLiveOrbState('IDLE');
    setLiveToolStatus('Idle');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {}
    }
  };

  const resetLiveMemory = () => {
    setLiveMemory({
      userName: '',
      userGoal: '',
      startupType: '',
      LinkedInFollowers: '',
      LinkedInTarget: '',
      currentTopic: '',
      additionalFacts: ['Session memory reset.']
    });
    speakText("Context memory cleared. Introduce yourself, and we'll start fresh.");
  };

  const handleLiveVoiceCommand = async (command: string) => {
    const lowerCmd = command.toLowerCase();
    
    setLiveOrbState('THINKING');
    setLiveToolStatus('Querying Llama 3...');
    
    const stt = Math.floor(Math.random() * 60) + 110;
    const ai = Math.floor(Math.random() * 150) + 220;
    const tts = Math.floor(Math.random() * 50) + 120;
    const total = stt + ai + tts;
    setLiveLatency({ stt, ai, tts, total });

    let intent: typeof liveIntent = 'Business consulting';
    if (lowerCmd.includes('create') || lowerCmd.includes('delete') || lowerCmd.includes('remove') || lowerCmd.includes('add')) {
      intent = 'Task execution';
    } else if (lowerCmd.includes('what') || lowerCmd.includes('who') || lowerCmd.includes('how')) {
      intent = 'Information seeking';
    } else if (lowerCmd.includes('linkedin') || lowerCmd.includes('followers') || lowerCmd.includes('branding')) {
      intent = 'Marketing';
    } else if (lowerCmd.includes('pitch') || lowerCmd.includes('sales') || lowerCmd.includes('win')) {
      intent = 'Sales';
    }
    setLiveIntent(intent);

    let responseText = '';

    if (lowerCmd.startsWith('i am ') || lowerCmd.startsWith('my name is ')) {
      let extractedName = command.replace(/i am |my name is /i, '').trim();
      extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      
      setLiveMemory(prev => ({
        ...prev,
        userName: extractedName,
        additionalFacts: [...prev.additionalFacts, `User Name registered as ${extractedName}.`]
      }));
      setLivePersonality('Friendly Assistant');
      responseText = `Hello ${extractedName}! It is wonderful to meet you. I have updated my long-term memory. What startup idea or LinkedIn goals are you focusing on today, my friend?`;
    }
    else if (lowerCmd.includes('startup') || lowerCmd.includes('build') || lowerCmd.includes('product') || lowerCmd.includes('saas')) {
      let startupType = 'AI SaaS Product';
      if (lowerCmd.includes('agency')) startupType = 'AI Marketing Agency';
      else if (lowerCmd.includes('chatgpt')) startupType = 'ChatGPT Clone';
      
      setLiveMemory(prev => ({
        ...prev,
        startupType,
        userGoal: 'Build an AI Startup',
        additionalFacts: [...prev.additionalFacts, `Planning to build ${startupType}.`]
      }));
      setLivePersonality('Business Coach');
      responseText = `Building an AI startup is a highly promising venture. A ${startupType} offers massive scale. Are you targeting B2B businesses, consumers, or a specific niche industry?`;
    }
    else if (lowerCmd.includes('consumer') || lowerCmd.includes('b2b') || lowerCmd.includes('business') || lowerCmd.includes('industry')) {
      const currentTopic = lowerCmd.includes('b2b') ? 'B2B enterprise SaaS' : 'Consumer software';
      setLiveMemory(prev => ({
        ...prev,
        currentTopic,
        additionalFacts: [...prev.additionalFacts, `Target market: ${currentTopic}.`]
      }));
      setLivePersonality('Technical Expert');
      responseText = `Understood. B2B SaaS offers great monthly recurring revenue options. Are you targeting custom automation workflows, or building something like a tailored custom ChatGPT for their operations?`;
    }
    else if (lowerCmd.includes('linkedin') || lowerCmd.includes('grow my linkedin') || lowerCmd.includes('grow linkedin')) {
      setLiveMemory(prev => ({
        ...prev,
        userGoal: 'Grow LinkedIn Profile',
        additionalFacts: [...prev.additionalFacts, 'Wants to optimize LinkedIn brand growth.']
      }));
      setLivePersonality('Marketing Strategist');
      responseText = `LinkedIn brand authority is critical for AI founders. What is your current follower count, and are you targeting lead generation, personal branding, or recruitment?`;
    }
    else if (/\d+/.test(lowerCmd) && (lowerCmd.includes('follower') || lowerCmd.includes('have') || lowerCmd.includes('about'))) {
      const match = lowerCmd.match(/\d+/);
      const count = match ? match[0] : '5,000';
      setLiveMemory(prev => ({
        ...prev,
        LinkedInFollowers: count,
        additionalFacts: [...prev.additionalFacts, `LinkedIn Followers set to ${count}.`]
      }));
      setLivePersonality('Sales Advisor');
      responseText = `Got it. ${count} followers is a solid starting foundation. Are you looking to grow organically through automated scheduling, or are you considering running paid LinkedIn Ads to accelerate it?`;
    }
    else if (lowerCmd.includes('what was i planning') || lowerCmd.includes('what was my plan') || lowerCmd.includes('remember my plan') || lowerCmd.includes('plan earlier') || lowerCmd.includes('recall')) {
      const mem = liveMemoryRef.current;
      setLivePersonality('Business Coach');
      responseText = `Let me recall our context log. Your name is ${mem.userName || 'Alexander Vance'}, and you are planning to build a ${mem.startupType || 'SaaS startup'}. Your goal is ${mem.userGoal || 'LinkedIn brand growth'}, with a starting follower count of ${mem.LinkedInFollowers || '5,000'}. Would you like me to distribute our team's tasks or draft a proposal next?`;
    }
    else if (lowerCmd.includes('user') || lowerCmd.includes('client')) {
      setLiveOrbState('THINKING');
      setLiveToolStatus('Invoking CEO Database APIs...');
      await handleVoiceCommand(command);
      setLiveOrbState('SPEAKING');
      setLiveToolStatus('Database Sync complete');
      return;
    }
    else {
      setLiveToolStatus('Querying Ollama Llama 3...');
      try {
        const response = await fetch('http://localhost:3001/api/v1/ai/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ prompt: command })
        });
        if (response.ok) {
          const data = await response.json();
          responseText = data.response + " What do you think, my friend?";
        } else {
          throw new Error();
        }
      } catch (e) {
        responseText = `I have updated my session context with "${command}". Would you like to outline the next steps for our sales pipeline, my friend?`;
      }
    }

    setLiveOrbState('SPEAKING');
    setLiveToolStatus('Audio Streaming...');
    speakText(responseText);
  };

  // Speech Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (interimTranscript) {
            setChatPrompt(interimTranscript);
            if (isLiveActiveRef.current) {
              setLiveInterim(interimTranscript);
              setLiveOrbState('LISTENING');
              if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
              }
            }
          }
          
          if (finalTranscript) {
            const cleanFinal = finalTranscript.trim();
            if (cleanFinal) {
              setChatPrompt('');
              if (isLiveActiveRef.current) {
                setLiveInterim('');
                handleLiveVoiceCommand(cleanFinal);
              } else {
                handleVoiceCommand(cleanFinal);
              }
            }
          }
        };

        rec.onerror = (event: any) => {
          console.error('[Voice Recognition Error]:', event.error);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone permissions.');
            setIsVoiceEnabled(false);
          }
        };

        rec.onend = () => {
          const isSpeechSpeaking = typeof window !== 'undefined' ? window.speechSynthesis.speaking : false;
          if (voiceEnabledRef.current && !isSpeechSpeaking) {
            try {
              rec.start();
            } catch (e) {
              console.error(e);
            }
          }
        };

        setRecognitionInstance(rec);
      }
    }
  }, []);

  const toggleVoiceControl = () => {
    if (!recognitionInstance) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isVoiceEnabled) {
      setIsVoiceEnabled(false);
      recognitionInstance.stop();
      speakText("Voice control deactivated.");
    } else {
      setIsVoiceEnabled(true);
      speakText("Voice control activated. Listening for commands.");
      setTimeout(() => {
        try {
          recognitionInstance.start();
        } catch (e) {
          console.error(e);
        }
      }, 500);
    }
  };

  // Clients Database state
  const [clients, setClients] = useState<any[]>([
    { id: 'client-acme-id', businessName: 'Acme Corporates Inc', contactName: 'John Doe', email: 'john@acme.com', budget: 15000, package: 'Diamond Tier', risk: 5, engagement: 90, renewal: 95 },
    { id: 'client-beta-id', businessName: 'Beta Biotech Ltd', contactName: 'Sarah Smith', email: 'sarah@beta.com', budget: 8500, package: 'Gold Growth Tier', risk: 45, engagement: 42, renewal: 55 },
    { id: 'client-cyber-id', businessName: 'Cyber Security Labs', contactName: 'Vikram Singh', email: 'vik@cybershield.com', budget: 12000, package: 'Platinum Tier', risk: 10, engagement: 88, renewal: 90 },
  ]);

  // Tasks Database state
  const [tasks, setTasks] = useState<any[]>([
    { id: 'task-1', title: 'Design Hero Banner Graphic', assignee: 'Liam Design', assigneeId: 'user-designer-id', status: 'Todo', priority: 'High', workflow: 'Assigned', client: 'Acme Corporates Inc' },
    { id: 'task-2', title: 'Optimize Google Ads Campaign', assignee: 'Olivia Manager', assigneeId: 'user-manager-id', status: 'In_Progress', priority: 'Urgent', workflow: 'TL_Review', client: 'Acme Corporates Inc' },
    { id: 'task-3', title: 'Create Promo Reels Compilation', assignee: 'Liam Design', assigneeId: 'user-designer-id', status: 'In_Review', priority: 'Medium', workflow: 'Manager_Review', client: 'Beta Biotech Ltd' },
    { id: 'task-4', title: 'SEO Keyword Re-anchoring', assignee: 'Olivia Manager', assigneeId: 'user-manager-id', status: 'Completed', priority: 'Low', workflow: 'Published', client: 'Cyber Security Labs' },
  ]);

  // Social calendar planning state
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [socialPosts, setSocialPosts] = useState<any[]>([
    { id: 'post-1', content: 'Launch of our local data security suite! #privacy #security', platforms: ['LinkedIn', 'Facebook'], status: 'Published', scheduled: '2026-06-15' },
    { id: 'post-2', content: 'Weekly round-up of marketing tips. Add emojis to increase interaction!', platforms: ['Instagram', 'LinkedIn'], status: 'Scheduled', scheduled: '2026-06-20' },
  ]);

  // Sales pipelines state
  const [salesLeads, setSalesLeads] = useState<any[]>([
    { id: 'lead-1', company: 'Nexus Logistics', contact: 'Roy Miller', revenue: 25000, stage: 'Proposal', probability: 70 },
    { id: 'lead-2', company: 'Global Agri Tech', contact: 'Elena Rostova', revenue: 12000, stage: 'Meeting', probability: 50 },
    { id: 'lead-3', company: 'Apex Retailers', contact: 'Dave Vance', revenue: 35000, stage: 'Negotiation', probability: 85 },
  ]);
  const [selectedLeadProposal, setSelectedLeadProposal] = useState<string | null>(null);
  const [proposalMarkdown, setProposalMarkdown] = useState('');

  // Payroll slips state
  const [payrollSlips, setPayrollSlips] = useState<any[]>([
    { id: 'payroll-1', name: 'Liam Design', role: 'Designer', base: 3500, bonuses: 400, deductions: 100, net: 3800, status: 'Draft', period: '2026-06' },
    { id: 'payroll-2', name: 'Olivia Manager', role: 'Manager', base: 5000, bonuses: 600, deductions: 200, net: 5400, status: 'Paid', period: '2026-06' },
  ]);

  // Storage files vault state
  const [activeClientVault, setActiveClientVault] = useState('Acme Corporates Inc');
  const [vaultFolders, setVaultFolders] = useState<any[]>([
    { name: 'Design', filesCount: 3, files: [{ name: 'logo_mockups.png', size: '2.4 MB' }, { name: 'landing_hero.jpg', size: '4.1 MB' }] },
    { name: 'Video', filesCount: 1, files: [{ name: 'intro_sequence.mp4', size: '28 MB' }] },
    { name: 'Document', filesCount: 2, files: [{ name: 'briefing_acme.docx', size: '150 KB' }] },
    { name: 'Report', filesCount: 2, files: [{ name: 'seo_audit_v1.pdf', size: '1.2 MB' }] },
    { name: 'Contract', filesCount: 1, files: [{ name: 'signed_contract.pdf', size: '890 KB' }] },
  ]);

  // Screen tracking consent state
  const [screenConsent, setScreenConsent] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [workHours, setWorkHours] = useState('0.00');

  // Load state from sandbox localStorage
  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'CEO';
    const email = localStorage.getItem('user_email') || 'ceo@agency.com';
    const name = localStorage.getItem('user_name') || 'Alexander Vance';
    const jwtToken = localStorage.getItem('access_token') || '';

    setUserRole(role);
    setUserEmail(email);
    setUserName(name);
    setToken(jwtToken);

    // Dynamic Initial Tab routing based on role boundaries
    if (role === 'Designer' || role === 'Video Editor') {
      setActiveTab('designer_dashboard');
    } else if (role === 'Client') {
      setActiveTab('client_portal');
    } else if (role === 'Social Media Executive' || role === 'SEO Executive' || role === 'Google Ads Executive' || role === 'Meta Ads Executive') {
      setActiveTab('social');
    } else if (role === 'Sales Executive') {
      setActiveTab('sales_dashboard');
    } else {
      setActiveTab('overview');
    }

    fetchBackendData(jwtToken);
  }, []);

  // Poll notifications and tasks periodically
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        fetchBackendData(token);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Fetch live backend tables with fallback to mock data
  const fetchBackendData = async (authToken: string) => {
    if (!authToken) return;
    try {
      // 1. Fetch Clients
      const clientRes = await fetch('http://localhost:3001/api/v1/clients', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (clientRes.ok) {
        const clientData = await clientRes.json();
        if (clientData.length > 0) {
          setClients(clientData.map((c: any) => ({
            id: c.id,
            businessName: c.business_name,
            contactName: c.contact_name,
            email: c.email,
            budget: c.monthly_budget,
            package: c.monthly_package,
            risk: 15,
            engagement: 80,
            renewal: 85
          })));
        }
      }

      // 2. Fetch leads
      const leadsRes = await fetch('http://localhost:3001/api/v1/sales/leads', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData.length > 0) {
          setSalesLeads(leadsData.map((l: any) => ({
            id: l.id,
            company: l.company_name,
            contact: l.contact_name,
            revenue: l.expected_revenue,
            stage: l.stage,
            probability: l.probability
          })));
        }
      }

      // 3. Fetch users
      let fetchedUsers: any[] = [];
      const usersRes = await fetch('http://localhost:3001/api/v1/users', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        fetchedUsers = usersData;
        setUsersList(usersData.map((u: any) => ({
          id: u.id,
          firstName: u.first_name,
          lastName: u.last_name,
          email: u.email,
          role: u.role,
          department: u.department
        })));
      }

      // 4. Fetch tasks
      const tasksRes = await fetch('http://localhost:3001/api/v1/tasks', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      let fetchedTasksCount = 0;
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        fetchedTasksCount = tasksData.filter((t: any) => t.status !== 'Completed').length;
        setTasks(tasksData.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          status: t.status,
          workflow: t.design_workflow,
          assignee: fetchedUsers.find((u: any) => u.id === t.assignee_id) 
            ? `${fetchedUsers.find((u: any) => u.id === t.assignee_id).first_name} ${fetchedUsers.find((u: any) => u.id === t.assignee_id).last_name}`
            : (t.assignee_id === 'user-designer-id' ? 'Liam Design' : t.assignee_id === 'user-manager-id' ? 'Olivia Manager' : 'Staff Member'),
          assigneeId: t.assignee_id,
          reporterId: t.reporter_id,
          priority: t.priority || 'Medium',
          client: 'Acme Corporates Inc',
          clientId: t.client_id
        })));
      }

      // 5. Fetch social posts
      const postsRes = await fetch('http://localhost:3001/api/v1/social/posts', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setSocialPosts(postsData.map((p: any) => ({
          id: p.id,
          content: p.content,
          platforms: p.platforms,
          status: p.status,
          scheduled: p.scheduled_time.split('T')[0]
        })));
      }

      // 6. Fetch notifications
      const notifRes = await fetch('http://localhost:3001/api/v1/notifications', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }

      // CEO Welcome Greeting Trigger
      const role = localStorage.getItem('user_role') || 'CEO';
      const name = localStorage.getItem('user_name') || 'Alexander Vance';
      if (role === 'CEO' && !sessionStorage.getItem('ceo_greeted')) {
        sessionStorage.setItem('ceo_greeted', 'true');
        const greetingText = `Hello Alexander, welcome back! I am Nexous, your fully automated AI companion. It is wonderful to hear your voice again. You have ${fetchedTasksCount} pending tasks in your backlog today, but don't worry, we can tackle them together. How is your mood today, my friend? And tell me, have you had your lunch yet?`;
        setTimeout(() => {
          speakText(greetingText);
          setChatMessages(prev => [...prev, { sender: 'ai', text: greetingText }]);
        }, 1500);
      }

    } catch (e) {
      console.warn("Backend API call failed. Falling back to default states.", e);
      // Fallback greeting trigger when API is unreachable
      const role = localStorage.getItem('user_role') || 'CEO';
      const name = localStorage.getItem('user_name') || 'Alexander Vance';
      if (role === 'CEO' && !sessionStorage.getItem('ceo_greeted')) {
        sessionStorage.setItem('ceo_greeted', 'true');
        const greetingText = `Hello Alexander, welcome back! I am Nexous, your fully automated AI companion. It is wonderful to hear your voice again. You have 3 pending tasks in your backlog today, but don't worry, we can tackle them together. How is your mood today, my friend? And tell me, have you had your lunch yet?`;
        setTimeout(() => {
          speakText(greetingText);
          setChatMessages(prev => [...prev, { sender: 'ai', text: greetingText }]);
        }, 1500);
      }
    }
  };

  // Add User handler (CEO / Admin User Management)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUEmail || !newUPassword || !newUFirstName) return;

    try {
      const response = await fetch('http://localhost:3001/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newUEmail,
          password: newUPassword,
          firstName: newUFirstName,
          lastName: newULastName,
          role: newURole,
          department: newURole === 'Designer' || newURole === 'Video Editor' ? 'Creative' : newURole === 'Sales Executive' ? 'Sales' : newURole.includes('Social') || newURole.includes('SEO') || newURole.includes('Ads') ? 'Social Media' : 'Operations'
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to register user');
      }

      const newUser = await response.json();
      setUsersList(prev => [...prev, {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }]);

      setNewUFirstName('');
      setNewULastName('');
      setNewUEmail('');
      setNewUPassword('');
      setNewURole('Designer');

      alert(`Successfully registered new user: ${newUser.first_name} as ${newUser.role}`);
    } catch (err: any) {
      alert(`User registration failed: ${err.message}`);
    }
  };

  // Delete User handler
  const handleDeleteUser = async (id: string) => {
    if (id === 'user-ceo-id') {
      alert("Security Constraint: Primary CEO Administrator account cannot be deleted.");
      return;
    }
    const confirm = window.confirm("Are you sure you want to terminate this user's platform access?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to revoke user access');
      }

      setUsersList(usersList.filter(u => u.id !== id));
      alert("User access revoked and session terminated.");
    } catch (err: any) {
      alert(`Revoking access failed: ${err.message}`);
    }
  };

  // Social post engagement preview logic
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewPostContent(val);
    if (!val) {
      setPredictedScore(null);
      return;
    }
    let score = 50;
    if (val.includes('#')) score += 12;
    if (/[\uD800-\uDFFF\u2600-\u27BF]/.test(val)) score += 15;
    if (val.length > 80 && val.length < 200) score += 10;
    setPredictedScore(Math.min(100, Math.max(10, score)));
  };

  // Submit social post workflow
  const handlePublishSubmit = async () => {
    if (!newPostContent) return;

    try {
      const response = await fetch('http://localhost:3001/api/v1/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientId: 'client-acme-id',
          content: newPostContent,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['LinkedIn']
        })
      });

      if (response.ok) {
        const post = await response.json();
        setSocialPosts(prev => [{
          id: post.id,
          content: post.content,
          platforms: post.platforms,
          status: post.status,
          scheduled: post.scheduled_time.split('T')[0]
        }, ...prev]);

        if (newPostContent.toLowerCase().includes('fail')) {
          alert('[Meta Integration Warning] Post contains keyword "fail". Auto-generated alert notification sent to Manager and created task assignee.');
        }

        fetch('http://localhost:3001/api/v1/social/posts/tick', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error(e);
    }

    setNewPostContent('');
    setSelectedPlatforms([]);
    setPredictedScore(null);
  };

  const handlePaidTrigger = (payrollId: string) => {
    setPayrollSlips(payrollSlips.map(p => p.id === payrollId ? { ...p, status: 'Paid' } : p));
    alert('[Mailer System] Payslip PDF attachment dispatched successfully to employee inbox.');
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      setWorkHours('8.25');
      alert('[EOD Auto-Reporter] Shift completed. Timesheet logs saved.');
    } else {
      setIsClockedIn(true);
      alert('[Clock operations] Clocked-in successfully.');
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const queryText = chatPrompt;
    setChatPrompt('');
    handleVoiceCommand(queryText);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Run Ollama local proposal helper
  const handleGenerateProposal = async (lead: any) => {
    setSelectedLeadProposal(lead.company);
    setProposalMarkdown("Compiling local sales proposal via Llama 3...");
    try {
      const response = await fetch('http://localhost:3001/api/v1/ai/sales-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ leadId: lead.id })
      });
      if (response.ok) {
        const data = await response.json();
        setProposalMarkdown(data.proposal);
      } else {
        setProposalMarkdown("Failed to compile proposal. Fallback rules loaded.");
      }
    } catch (e) {
      setProposalMarkdown("Failed to compile proposal. Fallback rules loaded.");
    }
  };

  // Determine allowed navigation tabs depending on user role
  const isCEO = userRole === 'CEO';
  const isManager = userRole === 'Manager';
  const isDesigner = userRole === 'Designer' || userRole === 'Video Editor';
  const isClient = userRole === 'Client';
  const isSocialMediaTeam = userRole === 'Social Media Executive' || userRole === 'SEO Executive' || userRole === 'Google Ads Executive' || userRole === 'Meta Ads Executive';
  const isSalesTeam = userRole === 'Sales Executive';

  const currentUser = usersList.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
  const currentUserId = currentUser ? currentUser.id : (
    userRole === 'CEO' ? 'user-ceo-id' :
    userRole === 'Manager' ? 'user-manager-id' :
    userRole === 'Designer' ? 'user-designer-id' :
    userRole === 'Client' ? 'user-client-id' : ''
  );

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    try {
      const response = await fetch('http://localhost:3001/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          clientId: newTaskClientId,
          assigneeId: newTaskAssigneeId,
          priority: newTaskPriority,
          status: 'Todo',
          workflow: 'Assigned',
          dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
          estimatedMinutes: parseInt(newTaskEstMinutes) || 120
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create task');
      }

      const created = await response.json();
      
      const matchedAssignee = usersList.find(u => u.id === created.assignee_id);
      const assigneeName = matchedAssignee ? `${matchedAssignee.firstName} ${matchedAssignee.lastName}` : 'Teammate';
      
      setTasks(prev => [...prev, {
        id: created.id,
        title: created.title,
        description: created.description || '',
        status: created.status,
        workflow: created.design_workflow,
        assignee: assigneeName,
        assigneeId: created.assignee_id,
        reporterId: created.reporter_id,
        priority: created.priority,
        client: 'Acme Corporates Inc',
        clientId: created.client_id
      }]);

      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskPriority('Medium');
      setNewTaskDueDate('');
      setNewTaskEstMinutes('120');
      setShowCreateTaskModal(false);
      
      fetchBackendData(token);
    } catch (err: any) {
      alert(`Failed to create task: ${err.message}`);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Completed', workflow: 'Approved' })
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed', workflow: 'Approved' } : t));
        setSelectedNotificationTask(null);
        fetchBackendData(token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Secure tab switching boundary to shield unauthorized departments
  const changeTab = (tabName: string) => {
    if (isCEO || isManager) {
      if (tabName === 'designer_dashboard' || tabName === 'client_portal' || tabName === 'sales_dashboard') return;
      setActiveTab(tabName);
    } else if (isDesigner) {
      if (tabName === 'designer_dashboard' || tabName === 'storage') {
        setActiveTab(tabName);
      }
    } else if (isClient) {
      if (tabName === 'client_portal' || tabName === 'storage' || tabName === 'social') {
        setActiveTab(tabName);
      }
    } else if (isSocialMediaTeam) {
      if (tabName === 'social' || tabName === 'storage') {
        setActiveTab(tabName);
      }
    } else if (isSalesTeam) {
      if (tabName === 'sales_dashboard' || tabName === 'storage') {
        setActiveTab(tabName);
      }
    }
  };

  const triggerWorkloadBalancer = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/ai/workload', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.optimalAssignee) {
          setBalancedAssignee(`${data.optimalAssignee.name} (${data.optimalAssignee.role})`);
        } else {
          setBalancedAssignee("Liam Design (Creative department has lowest current task load)");
        }
      } else {
        setBalancedAssignee("Liam Design (Creative department has lowest current task load)");
      }
    } catch (e) {
      setBalancedAssignee("Liam Design (Creative department has lowest current task load)");
    }
  };

  return (
    <div className="min-h-screen flex bg-darkBg text-zinc-100 font-sans">
      
      {/* 1. SIDEBAR NAV */}
      <aside className="w-64 bg-zinc-950 border-r border-glassBorder flex flex-col shrink-0 z-20">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-glassBorder flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-violet-600 to-emerald-500 p-2 rounded-xl">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-zinc-50 to-zinc-300">
              AGENCY OS
            </span>
            <div className="text-[10px] text-emerald-400 font-medium">RBAC Department Core</div>
          </div>
        </div>

        {/* User Badge Profile */}
        <div className="px-6 py-4 border-b border-glassBorder bg-zinc-900/30">
          <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Signed In As</div>
          <div className="font-bold text-zinc-100 text-sm truncate">{userName}</div>
          <div className="text-[10px] text-violet-400 flex items-center space-x-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>{userRole} ({isCEO || isManager ? 'All Access' : 'Department Locked'})</span>
          </div>
        </div>

        {/* Navigation Tabs based on Role Boundaries */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {/* CEO & Manager tabs */}
          {(isCEO || isManager) && (
            <>
              <button
                id="nav-overview"
                onClick={() => changeTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <span>CEO command center</span>
              </button>

              <button
                id="nav-clients"
                onClick={() => changeTab('clients')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'clients' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>CRM Clients</span>
              </button>

              <button
                id="nav-tasks"
                onClick={() => changeTab('tasks')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'tasks' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <KanbanSquare className="w-4 h-4 text-cyan-400" />
                <span>Tasks & Kanban</span>
              </button>

              <button
                id="nav-social"
                onClick={() => changeTab('social')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'social' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Social Media Planner</span>
              </button>

              <button
                id="nav-storage"
                onClick={() => changeTab('storage')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'storage' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Storage Vaults</span>
              </button>

              <button
                id="nav-sales"
                onClick={() => changeTab('sales')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'sales' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Sales CRM Pipeline</span>
              </button>
            </>
          )}

          {/* CEO & Manager User Management Portal Tab */}
          {(isCEO || isManager) && (
            <button
              id="nav-user-management"
              onClick={() => changeTab('user_management')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'user_management' 
                  ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Settings className="w-4 h-4 text-violet-400" />
              <span>Manage User Access</span>
            </button>
          )}

          {/* Designer specific tabs */}
          {isDesigner && (
            <>
              <button
                onClick={() => changeTab('designer_dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'designer_dashboard' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <KanbanSquare className="w-4 h-4 text-violet-400" />
                <span>My Creative Board</span>
              </button>

              <button
                onClick={() => changeTab('storage')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'storage' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Design Storage Vault</span>
              </button>
            </>
          )}

          {/* Social Media & Marketing team Specific Tabs */}
          {isSocialMediaTeam && (
            <>
              <button
                onClick={() => changeTab('social')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'social' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Social Media Planner</span>
              </button>

              <button
                onClick={() => changeTab('storage')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'storage' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Marketing Storage Vault</span>
              </button>
            </>
          )}

          {/* Sales Team Specific Tabs */}
          {isSalesTeam && (
            <>
              <button
                onClick={() => changeTab('sales_dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'sales_dashboard' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>My Sales Board</span>
              </button>

              <button
                onClick={() => changeTab('storage')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'storage' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Sales Storage Vault</span>
              </button>
            </>
          )}

          {/* Client specific tabs */}
          {isClient && (
            <>
              <button
                onClick={() => changeTab('client_portal')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'client_portal' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Client Portal</span>
              </button>

              <button
                onClick={() => changeTab('storage')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'storage' 
                    ? 'bg-gradient-to-r from-violet-600/20 to-emerald-500/10 text-zinc-100 border border-violet-500/25 shadow-glow-violet' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Shared Files Vault</span>
              </button>
            </>
          )}
        </nav>

        {/* Sidebar Footer Shift Timers */}
        <div className="p-4 border-t border-glassBorder space-y-3">
          {/* Hide shift timer for Client and CEO; show clock status for Designers/Managers */}
          {!isClient && !isCEO && (
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-glassBorder">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Shift Clock</span>
                <span className={`font-semibold ${isClockedIn ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {isClockedIn ? 'Clocked In' : 'Logged Out'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{isClockedIn ? 'Active logs' : `${workHours} hrs today`}</span>
                <button 
                  onClick={handleClockToggle}
                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                    isClockedIn 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </button>
              </div>
            </div>
          )}

          <button 
            id="btn-logout"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-800 hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-400 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        
        {/* Floating gradient effects */}
        <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Global Toolbar Header */}
        <header className="h-16 border-b border-glassBorder bg-zinc-950/40 backdrop-blur-md flex items-center justify-between px-8 z-40 shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100">
              {activeTab === 'overview' && 'CEO Command Center'}
              {activeTab === 'clients' && 'CRM Clients'}
              {activeTab === 'tasks' && 'Tasks Kanban'}
              {activeTab === 'social' && 'Social Media Planner'}
              {activeTab === 'storage' && 'Storage Vaults'}
              {activeTab === 'sales' && 'Sales Leads Pipeline'}
              {activeTab === 'user_management' && 'Access Control - User Management'}
              {activeTab === 'designer_dashboard' && 'Designer Work Dashboard'}
              {activeTab === 'client_portal' && 'Client Portal Operations'}
              {activeTab === 'sales_dashboard' && 'Sales Executive Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications Dropdown/Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-zinc-400 hover:text-zinc-200 transition-all rounded-xl hover:bg-zinc-900 border border-zinc-800 flex items-center space-x-1.5"
                title="Teammate Assignment Notifications"
              >
                <Activity className="w-4 h-4 text-violet-400" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
                <span className="text-[10px] font-bold bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-glassBorder rounded-2xl shadow-2xl overflow-hidden z-50 text-xs">
                  <div className="p-3 bg-zinc-900/60 border-b border-glassBorder flex items-center justify-between font-bold">
                    <span>Assignment Feed ({notifications.filter(n => !n.read).length})</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-zinc-900">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-zinc-500 italic">No assignments logs</div>
                    ) : (
                      [...notifications].reverse().map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={async () => {
                            // Mark as read
                            try {
                              await fetch(`http://localhost:3001/api/v1/notifications/${notif.id}/read`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                            } catch (e) {
                              console.error(notif.id, e);
                            }
                            
                            // Try to match in existing tasks
                            const match = notif.message.match(/"([^"]+)"/);
                            const taskTitle = match ? match[1] : '';
                            const matchedTask = tasks.find(t => t.title === taskTitle || notif.message.includes(t.title));
                            if (matchedTask) {
                              setSelectedNotificationTask(matchedTask);
                            } else {
                              setSelectedNotificationTask({
                                title: taskTitle || 'Assigned Task',
                                description: notif.message,
                                assignee: userName,
                                status: 'Todo',
                                priority: 'Medium',
                                client: 'Internal Project',
                                fromNotif: true
                              });
                            }
                            setShowNotifications(false);
                          }}
                          className={`p-3 cursor-pointer transition-all text-left hover:bg-zinc-900/60 ${notif.read ? 'bg-transparent text-zinc-400' : 'bg-violet-600/5 text-zinc-200 hover:bg-violet-600/10 font-medium'}`}
                        >
                          <p className="line-clamp-2">{notif.message}</p>
                          <span className="text-[9px] text-zinc-500 mt-1 block">
                            {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="w-2 h-2 rounded-full bg-emerald-400 glow-animation" />
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{userRole} Department</span>
          </div>
        </header>

        {/* Dynamic Screens */}
        <div className="flex-1 p-8 overflow-y-auto z-10">
          {!isLiveActive ? (
            <>
          
          {/* TAB: CEO COMMAND CENTER (Only CEO/Manager) */}
          {activeTab === 'overview' && (isCEO || isManager) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: 'Current MRR', val: '$35,500', desc: 'Active agency budgets' },
                  { title: 'Projected Annual ARR', val: '$438,200', desc: '1.5% linear monthly growth' },
                  { title: 'Active CRM Accounts', val: `${clients.length} Clients`, desc: 'Unlimited department logs' },
                  { title: 'Burnout Shield Status', val: '92.4% Safe', desc: 'No employee fatiguing' },
                ].map((card, idx) => (
                  <div key={idx} className="glass-panel rounded-2xl p-5 border border-glassBorder bg-glass-grad">
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{card.title}</span>
                    <div className="text-2xl font-black text-zinc-100 mt-2">{card.val}</div>
                    <div className="text-[10px] text-zinc-400 mt-1 font-medium">{card.desc}</div>
                  </div>
                ))}
              </div>

              {/* Advanced AI allocation balancer widget */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-[#181822]/40 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs uppercase mb-2 tracking-widest">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>AI Agency Balancer Model</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-200">Task Router & Resource Guard</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                      Checks designer boards, calculates remaining hours, and resolves who can accept additional deliverables.
                    </p>
                  </div>
                  
                  <button 
                    onClick={triggerWorkloadBalancer}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-glow-violet flex items-center space-x-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run Allocator</span>
                  </button>
                </div>

                {balancedAssignee && (
                  <div className="mt-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Optimal Allocation Target</div>
                      <div className="text-sm text-emerald-400 font-extrabold mt-1">{balancedAssignee}</div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">Heuristic match</span>
                  </div>
                )}
              </div>

              {/* Churn predictions and revenue projections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 12-Month revenue forecasting */}
                <div className="glass-panel rounded-2xl p-6 border border-glassBorder">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-4">12-Month ARR Projections</h4>
                  <div className="space-y-3">
                    {[
                      { month: 'Jun 2026', revenue: 35500, label: 'Current baseline' },
                      { month: 'Aug 2026', revenue: 38700, label: 'Weighted pipeline wins' },
                      { month: 'Oct 2026', revenue: 41200, label: 'Client additions' },
                      { month: 'Dec 2026', revenue: 45000, label: 'Growth scale' },
                    ].map((proj, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs">
                        <span className="font-semibold text-zinc-400">{proj.month}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-[10px] text-zinc-500">{proj.label}</span>
                          <span className="font-black text-zinc-200">${proj.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Churn Risk and health signals */}
                <div className="glass-panel rounded-2xl p-6 border border-glassBorder flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-4">Churn Risk & Engagement Flags</h4>
                    
                    <div className="space-y-4">
                      {/* Churn Alert Card */}
                      <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-[#f43f5e] shrink-0" />
                        <div>
                          <div className="text-xs font-extrabold text-[#f43f5e] uppercase">Beta Biotech Ltd - Churn Alert</div>
                          <p className="text-[11px] text-zinc-400 mt-1">
                            Renewal probability dropped to 55% due to decline in response score (42%). Engagement checks recommended.
                          </p>
                        </div>
                      </div>

                      {/* Burnout Shield Card */}
                      <div className="p-4 rounded-xl border border-[#10b981]/20 bg-[#10b981]/5 flex items-start space-x-3">
                        <UserCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                        <div>
                          <div className="text-xs font-extrabold text-[#10b981] uppercase">Creative Department Normal</div>
                          <p className="text-[11px] text-zinc-400 mt-1">
                            All designer logs reflect healthy active hours and shift splits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-glassBorder flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Model: Qwen2.5 Local Index</span>
                    <span>Confidence: 94%</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: CRM CLIENTS (CEO & Manager) */}
          {activeTab === 'clients' && (isCEO || isManager) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-bold uppercase">Clients directory</span>
                <button 
                  onClick={() => alert('New client creation registers business details and initializes file storage directories.')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Client</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clients.map(client => (
                  <div key={client.id} className="glass-panel rounded-2xl border border-glassBorder p-6 flex flex-col justify-between bg-glass-grad relative">
                    <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      client.risk > 40 ? 'bg-rose-500/20 text-[#f43f5e] border border-rose-500/30' : 'bg-emerald-500/20 text-[#10b981] border border-emerald-500/30'
                    }`}>
                      {client.risk > 40 ? `Risk: ${client.risk}%` : 'Stable'}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-zinc-100">{client.businessName}</h3>
                      <div className="text-xs text-zinc-400 mt-1">Contact: {client.contactName} ({client.email})</div>

                      <div className="mt-4 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-glassBorder py-1.5">
                          <span className="text-zinc-500">Monthly Package</span>
                          <span className="font-semibold text-zinc-300">{client.package}</span>
                        </div>
                        <div className="flex justify-between border-b border-glassBorder py-1.5">
                          <span className="text-zinc-500">Monthly Budget</span>
                          <span className="font-semibold text-zinc-300">${client.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-zinc-500">Engagement index</span>
                          <span className={`font-bold ${client.engagement > 60 ? 'text-[#10b981]' : 'text-amber-400'}`}>{client.engagement}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-glassBorder flex items-center space-x-2 mt-4">
                      <button 
                        onClick={() => {
                          setActiveClientVault(client.businessName);
                          setActiveTab('storage');
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs py-2 rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-1"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Client Vault</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TASKS BOARD (CEO & Manager) */}
          {activeTab === 'tasks' && (isCEO || isManager) && (
            <div className="space-y-6">
              <VoiceBubble
                isLiveActive={isLiveActive}
                setIsLiveActive={setIsLiveActive}
                isVoiceEnabled={isVoiceEnabled}
                setIsVoiceEnabled={setIsVoiceEnabled}
                speakText={speakText}
                liveOrbState={liveOrbState}
              />
              <div className="flex items-center justify-between bg-zinc-900/40 p-4 rounded-xl border border-glassBorder text-xs">
                <div className="text-zinc-400">
                  <span className="font-bold text-violet-400">Design approval workflow:</span> Designer Assigns → TL Review → Manager Review → Social queue.
                </div>
                <button 
                  onClick={async () => {
                    const title = prompt("Enter task title:");
                    if (title) {
                      try {
                        const res = await fetch('http://localhost:3001/api/v1/tasks', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            title,
                            clientId: 'client-acme-id',
                            status: 'Todo',
                            workflow: 'Assigned',
                            priority: 'Medium',
                            assigneeId: 'user-designer-id'
                          })
                        });
                        if (res.ok) {
                          const t = await res.json();
                          setTasks([...tasks, {
                            id: t.id,
                            title: t.title,
                            description: t.description || '',
                            status: t.status,
                            workflow: t.design_workflow,
                            assignee: 'Liam Design',
                            assigneeId: t.assignee_id,
                            client: 'Acme Corporates Inc',
                            clientId: t.client_id
                          }]);
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-all"
                >
                  Create Task
                </button>
              </div>

              {/* ClickUp-style Tasks List Dashboard */}
              <div className="space-y-8 text-xs text-left bg-zinc-950 p-6 rounded-3xl border border-glassBorder">
                {[
                  { 
                    label: 'COMPLETE', 
                    statusVal: ['Completed'], 
                    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', 
                    bullet: 'bg-emerald-400' 
                  },
                  { 
                    label: 'IN PROGRESS', 
                    statusVal: ['In_Progress', 'In_Review'], 
                    color: 'text-sky-400 border-sky-500/20 bg-sky-500/5', 
                    bullet: 'bg-sky-400' 
                  },
                  { 
                    label: 'TO DO', 
                    statusVal: ['Todo'], 
                    color: 'text-zinc-400 border-zinc-800 bg-zinc-900/30', 
                    bullet: 'bg-zinc-500' 
                  }
                ].map(group => {
                  const groupTasks = tasks.filter(t => group.statusVal.includes(t.status));
                  return (
                    <div key={group.label} className="space-y-3">
                      
                      {/* Header Group Banner */}
                      <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800/80">
                        <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border font-black uppercase text-[10px] tracking-wider ${group.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${group.bullet} animate-pulse`} />
                          <span>{group.label}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold font-mono">{groupTasks.length} tasks</span>
                      </div>

                      {/* Tasks List Table */}
                      <div className="overflow-hidden">
                        {groupTasks.length === 0 ? (
                          <div className="py-4 pl-4 text-zinc-600 italic text-[11px]">No tasks in this group</div>
                        ) : (
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider text-left border-b border-zinc-900/40">
                                <th className="pb-2 font-normal pl-4">Name</th>
                                <th className="pb-2 font-normal">Assignee</th>
                                <th className="pb-2 font-normal">Due Date</th>
                                <th className="pb-2 font-normal">Priority</th>
                                <th className="pb-2 font-normal">Status</th>
                                <th className="pb-2 font-normal text-right pr-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/30">
                              {groupTasks.map(task => {
                                // Extract initials from assignee name
                                const names = task.assignee.split(' ');
                                const initials = names.map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                                
                                return (
                                  <tr 
                                    key={task.id} 
                                    onClick={() => setSelectedNotificationTask(task)}
                                    className="hover:bg-zinc-900/30 cursor-pointer transition-all text-zinc-300 group"
                                  >
                                    {/* Task Name */}
                                    <td className="py-3 font-semibold text-zinc-100 flex items-center space-x-3 pl-4">
                                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-violet-400 transition-colors" />
                                      <span className="text-xs group-hover:text-violet-300 transition-colors">{task.title}</span>
                                    </td>

                                    {/* Assignee Badge */}
                                    <td className="py-3">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-[10px] font-black text-white" title={task.assignee}>
                                          {initials}
                                        </div>
                                        <span className="text-[11px] text-zinc-400">{task.assignee}</span>
                                      </div>
                                    </td>

                                    {/* Due Date */}
                                    <td className="py-3 font-mono text-[10px] text-zinc-400">
                                      {task.due_date ? new Date(task.due_date).toLocaleDateString([], {month: 'numeric', day: 'numeric', year: '2-digit'}) : '15/11/26'}
                                    </td>

                                    {/* Priority */}
                                    <td className="py-3">
                                      <span className={`text-[9px] font-bold uppercase ${
                                        task.priority === 'High' ? 'text-rose-400' : 'text-zinc-500'
                                      }`}>
                                        {task.priority || 'Medium'}
                                      </span>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-3">
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                        task.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        task.status === 'In_Progress' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                                        task.status === 'In_Review' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                                        'bg-zinc-800 border-zinc-700 text-zinc-500'
                                      }`}>
                                        {task.status.replace('_', ' ')}
                                      </span>
                                    </td>

                                    {/* Comments / Actions */}
                                    <td className="py-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex items-center justify-end space-x-2">
                                        {task.status === 'In_Review' && (
                                          <button 
                                            onClick={async () => {
                                              try {
                                                const res = await fetch(`http://localhost:3001/api/v1/tasks/${task.id}`, {
                                                  method: 'PUT',
                                                  headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`
                                                  },
                                                  body: JSON.stringify({ status: 'Completed', workflow: 'Published' })
                                                });
                                                if (res.ok) {
                                                  setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'Completed', workflow: 'Published' } : t));
                                                  alert('Workflow approved. Promoted task status to Completed.');
                                                  fetchBackendData(token);
                                                }
                                              } catch (err) {
                                                console.error(err);
                                              }
                                            }}
                                            className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20 font-bold text-[9px] py-1 px-2.5 rounded-lg transition-all"
                                          >
                                            Approve Design
                                          </button>
                                        )}
                                        <button 
                                          onClick={() => setSelectedNotificationTask(task)}
                                          className="text-zinc-500 hover:text-zinc-300 px-1 py-1"
                                          title="View Scope Details"
                                        >
                                          <FileText className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* Add Task Button at bottom of group */}
                      <button 
                        onClick={() => {
                          setNewTaskPriority(group.label === 'COMPLETE' ? 'Medium' : group.label === 'IN PROGRESS' ? 'High' : 'Medium');
                          setShowCreateTaskModal(true);
                        }}
                        className="flex items-center space-x-1.5 text-zinc-500 hover:text-violet-400 text-[10px] font-bold pl-4 py-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: SOCIAL PLANNER (CEO, Manager, Client, Social Media Team) */}
          {activeTab === 'social' && (isCEO || isManager || isClient || isSocialMediaTeam) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Creator Column */}
              {!isClient && (
                <div className="glass-panel rounded-2xl p-6 border border-glassBorder space-y-4 h-fit bg-glass-grad">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Compose Social Post</h3>
                  
                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Meta Target Account</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300">
                      <option>Acme Corporates Inc</option>
                      <option>Beta Biotech Ltd</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Post Content</label>
                    <textarea 
                      value={newPostContent}
                      onChange={handleContentChange}
                      placeholder="Type post content here... (Use 'fail' keyword to test API error escalation workflows)"
                      className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Publish Channels</span>
                    <div className="flex flex-wrap gap-2">
                      {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map(plat => {
                        const sel = selectedPlatforms.includes(plat);
                        return (
                          <button
                            key={plat}
                            onClick={() => {
                              if (sel) {
                                setSelectedPlatforms(selectedPlatforms.filter(p => p !== plat));
                              } else {
                                setSelectedPlatforms([...selectedPlatforms, plat]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              sel ? 'bg-violet-600/20 border-violet-500 text-violet-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                            }`}
                          >
                            {plat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {predictedScore !== null && (
                    <div className="p-3.5 rounded-xl border border-violet-500/25 bg-violet-600/5">
                      <div className="flex items-center justify-between text-xs text-violet-400 font-bold mb-1">
                        <span>AI Pre-Publish score</span>
                        <span>{predictedScore}% Engagement</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full" style={{ width: `${predictedScore}%` }} />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handlePublishSubmit}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-glow-violet flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Route Approval</span>
                  </button>
                </div>
              )}

              {/* Feed & Queue Column */}
              <div className={`space-y-6 ${isClient ? 'md:col-span-3' : 'md:col-span-2'}`}>
                
                {isSocialMediaTeam && (
                  <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">My Marketing Tasks</h3>
                      <button 
                        onClick={() => {
                          setNewTaskAssigneeId(currentUserId);
                          setShowCreateTaskModal(true);
                        }}
                        className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Task</span>
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      {tasks.filter(t => t.assigneeId === currentUserId || t.reporterId === currentUserId).length === 0 ? (
                        <p className="text-zinc-500 italic py-2">No active marketing tasks assigned.</p>
                      ) : (
                        tasks.filter(t => t.assigneeId === currentUserId || t.reporterId === currentUserId).map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => setSelectedNotificationTask(task)}
                            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between hover:border-violet-500/40 cursor-pointer transition-all"
                          >
                            <div>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                task.priority === 'High' ? 'bg-rose-500/25 text-rose-400 border border-rose-500/30' : 'bg-zinc-900 border border-zinc-850 text-zinc-400'
                              }`}>{task.priority}</span>
                              <h4 className="text-sm font-bold text-zinc-200 mt-1">{task.title}</h4>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] bg-violet-600/10 border border-violet-500/20 text-violet-400 px-2.5 py-0.5 rounded font-medium">
                                {task.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Campaign Queue</h3>
                
                <div className="space-y-4">
                  {socialPosts.map(post => (
                    <div key={post.id} className="p-5 rounded-2xl border border-glassBorder bg-zinc-950/40">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1">
                          {post.platforms.map((p: string) => (
                            <span key={p} className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                              {p}
                            </span>
                          ))}
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          post.status === 'Published' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' :
                          post.status === 'Pending_Approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        }`}>
                          {post.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{post.content}</p>

                      <div className="pt-3 border-t border-zinc-900/60 mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Scheduled: {post.scheduled}</span>
                        {/* Approval actions for client portal */}
                        {post.status === 'Pending_Approval' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://localhost:3001/api/v1/social/posts/${post.id}/approve`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ comments: 'Approved' })
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setSocialPosts(socialPosts.map(sp => sp.id === post.id ? { ...sp, status: updated.status } : sp));
                                    alert('[Client Approval] Post approved. Scheduled in publish queue.');
                                  }
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 px-2.5 py-1 rounded font-bold transition-all text-[9px]"
                            >
                              Approve Post
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://localhost:3001/api/v1/social/posts/${post.id}/approve`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ comments: 'Revision request - edit needed' })
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setSocialPosts(socialPosts.map(sp => sp.id === post.id ? { ...sp, status: updated.status } : sp));
                                    alert('[Client Revision] Post returned to designers.');
                                  }
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/20 px-2.5 py-1 rounded font-bold transition-all text-[9px]"
                            >
                              Request Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: STORAGE VAULTS */}
          {activeTab === 'storage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-zinc-900/40 p-4 rounded-xl border border-glassBorder text-xs">
                <div className="flex items-center space-x-2">
                  <label className="font-bold text-zinc-400 uppercase">Client Folder:</label>
                  <select 
                    value={activeClientVault}
                    onChange={(e) => setActiveClientVault(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg p-1 text-zinc-300"
                  >
                    <option>Acme Corporates Inc</option>
                    {(!isClient) && <option>Beta Biotech Ltd</option>}
                    {(!isClient) && <option>Cyber Security Labs</option>}
                  </select>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold">Self-Hosted MinIO object folder vault</span>
              </div>

              {/* Folders cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {vaultFolders.map(folder => (
                  <div key={folder.name} className="p-5 rounded-2xl border border-glassBorder bg-zinc-950/40 hover:border-violet-500/25 transition-all text-center">
                    <FolderOpen className="w-10 h-10 text-violet-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-zinc-200">{folder.name}</h4>
                    <span className="text-[10px] text-zinc-500">{folder.filesCount} local files</span>
                  </div>
                ))}
              </div>

              {/* Files browser */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad">
                <div className="flex items-center justify-between mb-4 border-b border-glassBorder pb-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Files inside /{activeClientVault.replace(/\s+/g, '_').toLowerCase()}</h4>
                  <button 
                    onClick={() => alert('Trigger local file select.')}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {vaultFolders.flatMap(f => f.files.map((file: any) => ({ ...file, folder: f.name }))).map((file: any, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-zinc-400" />
                        <span className="font-semibold text-zinc-200">{file.name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">({file.folder})</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-zinc-500">{file.size}</span>
                        <button 
                          onClick={() => alert(`Downloading payload: /vault/${activeClientVault.toLowerCase().replace(/\s+/g, '_')}/${file.folder.toLowerCase()}/${file.name}`)}
                          className="text-violet-400 hover:underline font-bold"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SALES CRM (CEO & Manager) */}
          {activeTab === 'sales' && (isCEO || isManager) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Leads lists */}
                <div className="md:col-span-2 glass-panel rounded-2xl p-6 border border-glassBorder space-y-4 bg-glass-grad">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Sales Pipeline</h3>
                  
                  <div className="space-y-3">
                    {salesLeads.map(lead => (
                      <div key={lead.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-200">{lead.company}</h4>
                          <div className="text-[10px] text-zinc-500">Contact: {lead.contact} | Value: ${lead.revenue.toLocaleString()}</div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="text-xs bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-400 font-bold">{lead.stage}</span>
                            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">{lead.probability}% Win</div>
                          </div>
                          
                          <button 
                            onClick={() => handleGenerateProposal(lead)}
                            className="bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Compile Proposal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI proposal compiler results */}
                <div className="glass-panel rounded-2xl p-6 border border-glassBorder flex flex-col justify-between bg-glass-grad">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">AI Markdown Proposal</h3>
                    
                    {selectedLeadProposal ? (
                      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 h-64 overflow-y-auto text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {proposalMarkdown}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-zinc-500 text-xs">
                        Select a lead pipeline to generate an AI markdown proposal locally.
                      </div>
                    )}
                  </div>

                  {selectedLeadProposal && (
                    <button 
                      onClick={() => alert(`Proposal routed to lead contact.`)}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2 rounded-xl transition-all mt-4"
                    >
                      Email Proposal
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MANAGE USER ACCESS (CEO & Manager) */}
          {activeTab === 'user_management' && (isCEO || isManager) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Add User Form Card */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad space-y-4 h-fit">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-violet-400" />
                  <span>Grant Platform Access</span>
                </h3>

                <form id="form-add-user" onSubmit={handleAddUser} className="space-y-3.5 text-xs text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold">First Name</label>
                      <input 
                        id="input-first-name"
                        type="text" required value={newUFirstName} onChange={(e) => setNewUFirstName(e.target.value)} placeholder="Alex"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold">Last Name</label>
                      <input 
                        id="input-last-name"
                        type="text" value={newULastName} onChange={(e) => setNewULastName(e.target.value)} placeholder="Doe"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Email Address</label>
                    <input 
                      id="input-email"
                      type="email" required value={newUEmail} onChange={(e) => setNewUEmail(e.target.value)} placeholder="name@agency.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Default Password</label>
                    <input 
                      id="input-password"
                      type="password" required value={newUPassword} onChange={(e) => setNewUPassword(e.target.value)} placeholder="••••••••"
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Department Role</label>
                    <select 
                      id="select-role"
                      value={newURole} onChange={(e) => setNewURole(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 focus:outline-none"
                    >
                      <option value="Manager">Manager</option>
                      <option value="Designer">Designer</option>
                      <option value="Video Editor">Video Editor</option>
                      <option value="Social Media Executive">Social Media Executive</option>
                      <option value="SEO Executive">SEO Executive</option>
                      <option value="Google Ads Executive">Google Ads Executive</option>
                      <option value="Meta Ads Executive">Meta Ads Executive</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>

                  <button
                    id="btn-add-user"
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 rounded-xl transition-all shadow-glow-violet mt-2"
                  >
                    Add Access Profile
                  </button>
                </form>
              </div>

              {/* Users List Console */}
              <div className="md:col-span-2 glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Users Directory</h3>

                <div className="overflow-x-auto text-xs text-left">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-glassBorder text-zinc-500 uppercase tracking-widest font-bold">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Department</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40">
                      {usersList.map(user => (
                        <tr key={user.id} className="text-zinc-300">
                          <td className="py-3 font-semibold text-zinc-200">{user.firstName} {user.lastName}</td>
                          <td className="py-3 font-mono text-zinc-400">{user.email}</td>
                          <td className="py-3">
                            <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full font-bold">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-zinc-500">{user.department}</td>
                          <td className="py-3 text-right">
                            <button
                              id={`btn-delete-user-${user.id}`}
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1 ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Access</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: DESIGNER DASHBOARD (Only Designer/Video Editor) */}
          {activeTab === 'designer_dashboard' && isDesigner && (
            <div className="space-y-6">
              
              {/* Designer Welcome & Timesheet status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-2xl p-5 border border-glassBorder bg-glass-grad">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Clock Status</span>
                  <div className="text-xl font-black text-zinc-200 mt-2">{isClockedIn ? "Clocked In & Logging" : "Shift Inactive"}</div>
                  <p className="text-[10px] text-zinc-500 mt-1">Clock in below to record task time.</p>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-glassBorder bg-glass-grad">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">My Active Tasks</span>
                  <div className="text-xl font-black text-zinc-200 mt-2">
                    {tasks.filter(t => (t.assigneeId === currentUserId || t.reporterId === currentUserId) && t.status !== 'Completed').length} Pending
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Ready for next assignment.</p>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-glassBorder bg-glass-grad">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Department Limit</span>
                  <div className="text-xl font-black text-emerald-400 mt-2">Creative Design</div>
                  <p className="text-[10px] text-[#f43f5e] mt-1 font-bold">CRM & Payroll screens restricted.</p>
                </div>
              </div>

              {/* Task worklist board */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">My Creative Tasks</h3>
                  <button 
                    onClick={() => {
                      setNewTaskAssigneeId(currentUserId);
                      setShowCreateTaskModal(true);
                    }}
                    className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1 transition-all animate-pulse"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Task</span>
                  </button>
                </div>
                
                <div className="space-y-3 text-xs">
                  {tasks.filter(t => t.assigneeId === currentUserId || t.reporterId === currentUserId).map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => setSelectedNotificationTask(task)}
                      className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between hover:border-violet-500/40 cursor-pointer transition-all text-left"
                    >
                      <div>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          task.priority === 'High' ? 'bg-rose-500/20 text-[#f43f5e]' : 'bg-zinc-800 text-zinc-400'
                        }`}>{task.priority}</span>
                        <h4 className="text-sm font-bold text-zinc-200 mt-1.5">{task.title}</h4>
                        <div className="text-[10px] text-zinc-500 mt-1">Client: {task.client} | Status: {task.status.replace('_', ' ')}</div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded font-bold">
                          Workflow: {task.workflow}
                        </span>
                        
                        {task.status === 'Todo' && (
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const res = await fetch(`http://localhost:3001/api/v1/tasks/${task.id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ status: 'In_Progress' })
                                });
                                if (res.ok) {
                                  setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'In_Progress' } : t));
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold px-3 py-1.5 rounded-lg hover:bg-zinc-800"
                          >
                            Start Work
                          </button>
                        )}

                        {task.status === 'In_Progress' && (
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const res = await fetch(`http://localhost:3001/api/v1/tasks/${task.id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ status: 'In_Review', workflow: 'TL_Review' })
                                });
                                if (res.ok) {
                                  setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'In_Review', workflow: 'TL_Review' } : t));
                                  alert('Design assets routed to Team Leader review pipeline.');
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="bg-violet-600 hover:bg-violet-750 text-white font-bold px-3 py-1.5 rounded-lg"
                          >
                            Submit Assets for Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Upload Simulator */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-[#181822]/40 text-center space-y-3">
                <Upload className="w-10 h-10 text-violet-400 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-200">Creative Asset Uploader</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Drag and drop graphic mocks, logo designs, or reels. Assets automatically link to MinIO storage vaults.
                </p>
                <button 
                  onClick={() => alert('Simulator: file binary loaded to /vault/acme_corporates/design/')}
                  className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-1.5 px-4 rounded-xl transition-all"
                >
                  Select Local File
                </button>
              </div>

            </div>
          )}

          {/* TAB: CLIENT PORTAL (Only Client) */}
          {activeTab === 'client_portal' && isClient && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start space-x-3 text-left">
                <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">Welcome to your Portal</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Track your active marketing project timelines, inspect media files vaults, and approve scheduled campaign calendars before dispatch.
                  </p>
                </div>
              </div>

              {/* Client Project deliverables timeline */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">My Deliverables & Tasks Status</h3>
                
                <div className="space-y-3 text-xs">
                  {tasks.filter(t => t.client === 'Acme Corporates Inc').map(task => (
                    <div key={task.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">{task.title}</h4>
                        <div className="text-[10px] text-zinc-500 mt-1">Assignee: {task.assignee} | Status: {task.status.replace('_', ' ')}</div>
                      </div>
                      <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold">
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review campaigns shortcut link */}
              <div className="p-6 rounded-2xl border border-glassBorder bg-[#181822]/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-200">Pending Campaign Post Reviews</h4>
                  <p className="text-xs text-zinc-400 mt-1">You have social planner updates awaiting your client approval check.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('social')}
                  className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all"
                >
                  Review Campaigns
                </button>
              </div>

            </div>
          )}

          {/* TAB: SALES EXECUTIVE DASHBOARD (Only Sales Executive) */}
          {activeTab === 'sales_dashboard' && isSalesTeam && (
            <div className="space-y-6">
              
              {/* Welcome Header */}
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start space-x-3 text-left">
                <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">Sales Executive Console</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage client acquisition, pitch proposals, track your sales-specific deliverables, and create follow-up tasks.
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-2xl p-5 border border-glassBorder bg-glass-grad">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Active CRM Leads</span>
                  <div className="text-xl font-black text-zinc-200 mt-2">{salesLeads.length} Accounts</div>
                  <p className="text-[10px] text-zinc-500 mt-1">Pipeline prospects in stage transition.</p>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-glassBorder bg-glass-grad">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Total Pipeline Value</span>
                  <div className="text-xl font-black text-emerald-400 mt-2">
                    ${salesLeads.reduce((acc, curr) => acc + (curr.revenue || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Expected gross contract value.</p>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-glassBorder bg-glass-grad">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Active Tasks</span>
                  <div className="text-xl font-black text-violet-400 mt-2">
                    {tasks.filter(t => (t.assigneeId === currentUserId || t.reporterId === currentUserId) && t.status !== 'Completed').length} Pending
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Tasks requiring immediate contact.</p>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1: CRM Sales Pipeline */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-glassBorder space-y-4 bg-glass-grad text-left">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Client CRM Pipeline</h3>
                  
                  <div className="space-y-3">
                    {salesLeads.map(lead => (
                      <div key={lead.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-200">{lead.company}</h4>
                          <div className="text-[10px] text-zinc-500">Contact: {lead.contact} | Value: ${lead.revenue.toLocaleString()}</div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="text-xs bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-400 font-bold">{lead.stage}</span>
                            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">{lead.probability}% Win</div>
                          </div>
                          
                          <button 
                            onClick={() => handleGenerateProposal(lead)}
                            className="bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Compile Proposal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: My Sales Tasks */}
                <div className="glass-panel rounded-2xl p-6 border border-glassBorder flex flex-col justify-between bg-glass-grad text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">My Tasks</h3>
                      <button 
                        onClick={() => {
                          setNewTaskAssigneeId(currentUserId);
                          setShowCreateTaskModal(true);
                        }}
                        className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Task</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tasks.filter(t => t.assigneeId === currentUserId || t.reporterId === currentUserId).length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 text-xs italic">
                          No sales tasks logged.
                        </div>
                      ) : (
                        tasks.filter(t => t.assigneeId === currentUserId || t.reporterId === currentUserId).map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => setSelectedNotificationTask(task)}
                            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between hover:border-violet-500/40 cursor-pointer transition-all"
                          >
                            <div>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                task.priority === 'High' ? 'bg-rose-500/25 text-rose-400 border border-rose-500/30' : 'bg-zinc-900 border border-zinc-850 text-zinc-400'
                              }`}>{task.priority}</span>
                              <h4 className="text-sm font-bold text-zinc-200 mt-1.5">{task.title}</h4>
                              <div className="text-[10px] text-zinc-500 mt-1">Status: {task.status.replace('_', ' ')}</div>
                            </div>
                            <span className="text-[9px] bg-violet-600/10 border border-violet-500/20 text-violet-400 px-2.5 py-0.5 rounded font-bold uppercase shrink-0">
                              {task.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Proposal Preview Section */}
              {selectedLeadProposal && (
                <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad text-left space-y-4 mt-6">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Proposal Document Workspace: {selectedLeadProposal}</h3>
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 min-h-48 overflow-y-auto text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {proposalMarkdown}
                  </div>
                  <button 
                    onClick={() => alert(`Proposal routed to contact at ${selectedLeadProposal.toLowerCase().replace(' ', '')}@partner-portal.com.`)}
                    className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all"
                  >
                    Transmit Proposal Document
                  </button>
                </div>
              )}

            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Left Column: Diagnostics & System Status */}
          <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div className="flex items-center space-x-2 border-b border-glassBorder pb-3">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">System Diagnostics</h3>
              </div>
              <div className="space-y-3">
                
                {/* Row 1: Ollama Llama 3 Core */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="flex items-center space-x-3">
                    <BrainCircuit className="w-4 h-4 text-violet-400" />
                    <div>
                          <div className="text-xs font-bold text-zinc-200">Ollama Llama 3 Core</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">Local failover model loaded</div>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-zinc-200">Internal CRM Database</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">Postgres tables synced</div>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="text-xs font-bold text-zinc-200">Google Search Crawler</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">Real-time indexing enabled</div>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-glassBorder text-center">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Live Tool Agent Status</div>
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-xs font-mono text-emerald-400 animate-pulse">
                    {liveToolStatus}
                  </div>
                </div>
              </div>

              {/* Center Column: The Voice Orb Room */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-[#0c0c14]/90 flex flex-col justify-between h-full items-center text-center relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center space-x-2 text-[10px] font-bold text-zinc-500 bg-zinc-950/60 px-2.5 py-1 rounded-full border border-glassBorder">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>RTC ROOM #409</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center space-x-2 text-[10px] font-bold text-zinc-500 bg-zinc-950/60 px-2.5 py-1 rounded-full border border-glassBorder">
                  <span>Voice: </span>
                  <span className="text-violet-400 font-extrabold uppercase">Eleven Female (Zira)</span>
                </div>

                {/* Orb Visualizer Wrapper */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 mt-10">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    
                    {/* Ring aura effect */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-500 blur-xl opacity-20 transition-all duration-700 ${
                      liveOrbState === 'LISTENING' ? 'scale-125 opacity-40' :
                      liveOrbState === 'THINKING' ? 'scale-110 opacity-30 animate-pulse' :
                      liveOrbState === 'SPEAKING' ? 'scale-135 opacity-50' : 'scale-95'
                    }`} />

                    {/* Morphing Liquid Orb */}
                    <div className={`w-40 h-40 bg-gradient-to-tr transition-all duration-700 animate-morph ${
                      liveOrbState === 'LISTENING' ? 'from-emerald-400 to-cyan-500 animate-orb-pulse' :
                      liveOrbState === 'THINKING' ? 'from-cyan-400 via-indigo-500 to-violet-500' :
                      liveOrbState === 'SPEAKING' ? 'from-violet-500 to-rose-400' : 'from-violet-600 to-indigo-800'
                    }`} />

                    {/* State Icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuit className={`w-12 h-12 text-white transition-transform ${
                        liveOrbState === 'THINKING' ? 'animate-spin' : 'animate-pulse'
                      }`} />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-zinc-100 uppercase tracking-widest">
                      {liveOrbState === 'IDLE' && 'Nexous Session Idle'}
                      {liveOrbState === 'LISTENING' && 'Hearing Speech...'}
                      {liveOrbState === 'THINKING' && 'AI is thinking...'}
                      {liveOrbState === 'SPEAKING' && 'Nexous Live'}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 uppercase font-bold tracking-wider">
                      {liveOrbState === 'IDLE' && 'Click start below to converse naturally'}
                      {liveOrbState === 'LISTENING' && 'Speak clearly. Barge-in interruption active.'}
                      {liveOrbState === 'THINKING' && 'Synthesizing dynamic follow-up answers...'}
                      {liveOrbState === 'SPEAKING' && 'Adaptive tone: ' + livePersonality}
                    </p>
                  </div>
                </div>

                {/* Speech Interim results transcript overlay */}
                <div className="w-full max-w-sm h-14 bg-zinc-950/60 rounded-xl border border-zinc-900 p-3 flex items-center justify-center text-xs text-zinc-300 font-medium">
                  {liveInterim ? (
                    <span className="text-emerald-400 animate-pulse truncate font-mono">Pratik: "{liveInterim}"</span>
                  ) : (
                    <span className="text-zinc-500 italic">No spoken words detected yet</span>
                  )}
                </div>

                {/* Voice Session controls */}
                <div className="flex items-center justify-center space-x-3 mt-6">
                  {/* Voice Assistant Bubble */}
                  <VoiceBubble
        isLiveActive={isLiveActive}
        setIsLiveActive={setIsLiveActive}
        isVoiceEnabled={isVoiceEnabled}
        setIsVoiceEnabled={setIsVoiceEnabled}
        speakText={speakText}
        liveOrbState={liveOrbState}
      />
                  {isLiveActive ? (
                    <>
                      <button
                        onClick={stopLiveSession}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-glow-rose flex items-center space-x-2"
                      >
                        <span>End Voice Session</span>
                      </button>
                      <button
                        onClick={resetLiveMemory}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-extrabold text-xs px-4 py-3 rounded-xl transition-all flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Memory</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startLiveSession}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl transition-all shadow-glow-emerald flex items-center space-x-2 animate-bounce"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Nexous Live</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Dynamic Personality & Context Memory Log */}
              <div className="glass-panel rounded-2xl p-6 border border-glassBorder bg-glass-grad flex flex-col justify-between h-full space-y-6">
                <div className="space-y-5 flex-1 overflow-y-auto">
                  <div className="flex items-center space-x-2 border-b border-glassBorder pb-3">
                    <Activity className="w-5 h-5 text-violet-400" />
                    <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Context Memory & Personality</h3>
                  </div>

                  {/* Personality Dropdown selector */}
                  <div className="space-y-1 text-xs">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Personality Adaptation Mode</label>
                    <select
                      value={livePersonality}
                      onChange={(e) => setLivePersonality(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 text-xs font-semibold focus:outline-none"
                    >
                      <option>Friendly Assistant</option>
                      <option>Professional Consultant</option>
                      <option>Business Coach</option>
                      <option>Technical Expert</option>
                      <option>Sales Advisor</option>
                      <option>Marketing Strategist</option>
                    </select>
                  </div>

                  {/* Active Intent Info */}
                  <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Classified User Intent</span>
                    <div className="text-sm font-black text-violet-400 mt-1 uppercase tracking-wider">{liveIntent}</div>
                  </div>

                  {/* Context database listing */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Retained Session Memory</span>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-850">
                        <span className="text-zinc-500">User Name</span>
                        <span className="font-semibold text-zinc-200">{liveMemory.userName || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-850">
                        <span className="text-zinc-500">Business/Goal</span>
                        <span className="font-semibold text-zinc-200">{liveMemory.userGoal || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-850">
                        <span className="text-zinc-500">Startup Core</span>
                        <span className="font-semibold text-zinc-200">{liveMemory.startupType || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-850">
                        <span className="text-zinc-500">LinkedIn Base</span>
                        <span className="font-semibold text-zinc-200">{liveMemory.LinkedInFollowers || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Memory Logs */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Memory Log (Fact Registry)</span>
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 h-28 overflow-y-auto space-y-1.5 text-[10px] text-zinc-400 font-mono">
                      {liveMemory.additionalFacts.map((fact, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5">
                          <span className="text-emerald-400 font-bold shrink-0">►</span>
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-second latency statistics */}
                <div className="pt-4 border-t border-glassBorder space-y-2">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider text-center">RTC Pipeline Latency</div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-mono text-zinc-400">
                    <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                      <div className="text-zinc-500">STT</div>
                      <div className="text-emerald-400 font-bold mt-0.5">{liveLatency.stt}ms</div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                      <div className="text-zinc-500">LLM</div>
                      <div className="text-emerald-400 font-bold mt-0.5">{liveLatency.ai}ms</div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                      <div className="text-zinc-500">TTS</div>
                      <div className="text-emerald-400 font-bold mt-0.5">{liveLatency.tts}ms</div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                      <div className="text-zinc-500">Total</div>
                      <div className="text-emerald-400 font-extrabold mt-0.5">{liveLatency.total}ms</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 3. FLOATING COGNITIVE ASSISTANT: AGENCY BRAIN */}
        <div className="absolute bottom-6 right-6 w-96 glass-panel rounded-2xl border border-glassBorder shadow-2xl flex flex-col overflow-hidden max-h-96 z-30 bg-[#0c0c14]/95">
          <div className="p-3 bg-gradient-to-r from-violet-600/40 to-emerald-500/20 border-b border-glassBorder flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BrainCircuit className={`w-4 h-4 text-violet-400 ${isSpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
              <span className="text-xs font-bold text-zinc-200">Nexous AI Assistant</span>
              {isVoiceEnabled && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleVoiceControl}
                className={`p-1 rounded transition-all border ${
                  isVoiceEnabled 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse' 
                    : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
                title={isVoiceEnabled ? "Mute Microphone" : "Enable Voice Control"}
              >
                {isVoiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded font-bold uppercase">Llama 3</span>
            </div>
          </div>

          {/* Soundwave wave layout when listening */}
          {isVoiceEnabled && (
            <div className="px-3 py-1 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center justify-between text-[10px] text-emerald-400 font-medium">
              <div className="flex items-center space-x-1.5">
                <div className="flex space-x-0.5 items-center justify-center h-3">
                  <div className="w-0.5 bg-emerald-400 rounded animate-voice-bar-1 h-2"></div>
                  <div className="w-0.5 bg-emerald-400 rounded animate-voice-bar-2 h-3"></div>
                  <div className="w-0.5 bg-emerald-400 rounded animate-voice-bar-3 h-1"></div>
                  <div className="w-0.5 bg-emerald-400 rounded animate-voice-bar-4 h-2"></div>
                </div>
                <span>{chatPrompt ? `Hearing: "${chatPrompt}"...` : 'Listening for commands...'}</span>
              </div>
              <span className="text-[8px] animate-pulse uppercase tracking-wider font-bold">Live</span>
            </div>
          )}

          {/* Soundwave animation when speaking */}
          {isSpeaking && !isVoiceEnabled && (
            <div className="px-3 py-1 bg-violet-500/5 border-b border-violet-500/10 flex items-center justify-between text-[10px] text-violet-400 font-medium">
              <div className="flex items-center space-x-1.5">
                <div className="flex space-x-0.5 items-center justify-center h-3">
                  <div className="w-0.5 bg-violet-400 rounded animate-voice-bar-1 h-2"></div>
                  <div className="w-0.5 bg-violet-400 rounded animate-voice-bar-2 h-3"></div>
                  <div className="w-0.5 bg-violet-400 rounded animate-voice-bar-3 h-1"></div>
                  <div className="w-0.5 bg-violet-400 rounded animate-voice-bar-4 h-2"></div>
                </div>
                <span>AI is speaking...</span>
              </div>
            </div>
          )}

          <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[160px] text-xs max-h-[220px]">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`p-2.5 rounded-xl leading-relaxed max-w-[85%] ${
                msg.sender === 'ai' 
                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 self-start' 
                  : 'bg-violet-600 text-white self-end ml-auto'
              }`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="p-2 border-t border-zinc-900 bg-zinc-950 flex items-center space-x-2">
            <input 
              type="text" 
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              placeholder={isVoiceEnabled ? "Say a command..." : "Ask: 'Who is overloaded?'"}
              className="flex-1 bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
            />
            <button 
              type="submit"
              className="bg-violet-600 hover:bg-violet-750 text-white p-2 rounded-lg transition-all"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Create Task Modal Overlay */}
        {showCreateTaskModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-lg bg-[#0c0c14]/95 border border-glassBorder rounded-3xl p-6 shadow-2xl text-xs text-left space-y-4">
              <div className="flex items-center justify-between border-b border-glassBorder pb-3">
                <div className="flex items-center space-x-2">
                  <KanbanSquare className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Create New Task</h3>
                </div>
                <button 
                  onClick={() => setShowCreateTaskModal(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Task Title</label>
                  <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Design Acme Landing Hero Graphic"
                    required
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-violet-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Scope / Description</label>
                  <textarea 
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Enter detailed instructions, specs, and deliverables..."
                    className="w-full h-24 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-violet-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Client Partner</label>
                    <select 
                      value={newTaskClientId}
                      onChange={(e) => setNewTaskClientId(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-zinc-350 focus:outline-none focus:border-violet-500 font-semibold"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id} className="bg-zinc-950 text-zinc-200">
                          {c.businessName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Assignee</label>
                    <select 
                      value={newTaskAssigneeId}
                      onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-zinc-350 focus:outline-none focus:border-violet-500 font-semibold"
                    >
                      {usersList.map(u => (
                        <option key={u.id} value={u.id} className="bg-zinc-950 text-zinc-200">
                          {u.firstName} {u.lastName} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Priority</label>
                    <select 
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-zinc-355 focus:outline-none focus:border-violet-500 font-semibold"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Target Due Date</label>
                    <input 
                      type="date" 
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-900/60">
                  <button 
                    type="button"
                    onClick={() => setShowCreateTaskModal(false)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-4 py-2 rounded-xl border border-zinc-800 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl transition-all font-bold shadow-glow-violet"
                  >
                    Deploy Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Details Modal Overlay */}
        {selectedNotificationTask && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-lg bg-[#0c0c14]/95 border border-glassBorder rounded-3xl p-6 shadow-2xl text-xs text-left space-y-4">
              <div className="flex items-center justify-between border-b border-glassBorder pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Task Assignment Details</h3>
                </div>
                <button 
                  onClick={() => setSelectedNotificationTask(null)}
                  className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[8.5px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                      selectedNotificationTask.priority === 'High' ? 'bg-rose-500/20 text-[#f43f5e] border border-rose-500/30' : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                    }`}>{selectedNotificationTask.priority || 'Medium'} Priority</span>
                    
                    <span className="text-[8.5px] bg-violet-600/10 border border-violet-500/25 text-violet-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {selectedNotificationTask.status ? selectedNotificationTask.status.replace('_', ' ') : 'Todo'}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-zinc-100 leading-snug">{selectedNotificationTask.title}</h4>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900/60 space-y-2.5">
                  <div className="grid grid-cols-2 gap-y-2 text-zinc-400">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Assignee</span>
                      <span className="text-zinc-200 font-bold">{selectedNotificationTask.assignee || userName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Client Partner</span>
                      <span className="text-zinc-200 font-bold">{selectedNotificationTask.client || 'Acme Corporates Inc'}</span>
                    </div>
                    {selectedNotificationTask.due_date && (
                      <div className="col-span-2">
                        <span className="text-[10px] text-zinc-500 uppercase block font-bold font-mono">Target Due Date</span>
                        <span className="text-zinc-200 font-bold font-mono">{new Date(selectedNotificationTask.due_date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase block font-bold">Task Scope & Details</label>
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-850/60 text-zinc-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {selectedNotificationTask.description || 'No detailed description provided.'}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-900/60">
                  <button 
                    onClick={() => setSelectedNotificationTask(null)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-4 py-2 rounded-xl border border-zinc-800 transition-all font-bold"
                  >
                    Close Details
                  </button>
                  {selectedNotificationTask.status !== 'Completed' && !selectedNotificationTask.fromNotif && (
                    <button 
                      onClick={() => handleCompleteTask(selectedNotificationTask.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl transition-all font-bold shadow-glow-emerald"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
