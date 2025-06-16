import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth';
import { db, auth } from '../services/firebase';
import { 
  collection, query, where, getDocs, addDoc,
  doc, updateDoc, deleteDoc, serverTimestamp, getDoc
} from 'firebase/firestore';


import BugForm from './BugForm';
import BugList from './BugList';
import BugFilters from './BugFilters';
import EditBugModal from './EditBugModal';

const Dashboard = () => {
  const user = getCurrentUser();
  const [bugs, setBugs] = useState([]);
  const [filteredBugs, setFilteredBugs] = useState([]);
  const [projects] = useState(['Project A', 'Project B', 'Project C']);
  const [teamMembers] = useState(['Alice', 'Bob', 'Charlie', 'Diana']);
  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    project: '',
    assignee: '',
    dueDate: '',
    createdBy: user.name,
    labels: []
  });
  const [editingBug, setEditingBug] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  useEffect(() => {
    fetchBugs();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [bugs, filters, sortConfig]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const startTimerForBug = async (bugId) => {
    try {
      const bugRef = doc(db, 'bugs', bugId);
      await updateDoc(bugRef, {
        timerStart: serverTimestamp(),
        status: 'in-progress',
        updatedAt: serverTimestamp()
      });
      fetchBugs();
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const stopTimer = async (bugId) => {
    try {
      const bugRef = doc(db, 'bugs', bugId);
      const bugDoc = await getDoc(bugRef);
      const bugData = bugDoc.data();
      
      if (bugData.timerStart) {
        const endTime = new Date();
        const startTime = bugData.timerStart.toDate();
        const duration = Math.floor((endTime - startTime) / 1000);
        
        await addDoc(collection(db, 'timeLogs'), {
          bugId,
          userId: user.uid,
          userName: user.name,
          startTime: bugData.timerStart,
          endTime: serverTimestamp(),
          duration,
          createdAt: serverTimestamp()
        });

        await updateDoc(bugRef, {
          timerStart: null,
          updatedAt: serverTimestamp()
        });

        fetchBugs();
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const fetchBugs = async () => {
    const q = query(collection(db, 'bugs'));
    const querySnapshot = await getDocs(q);
    const bugsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timerStart: doc.data().timerStart || null,
      createdAt: doc.data().createdAt || serverTimestamp()
    }));
    setBugs(bugsData);
  };

  const applyFiltersAndSort = () => {
    let result = [...bugs];
    
    if (filters.status) {
      result = result.filter(bug => bug.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(bug => bug.priority === filters.priority);
    }
    if (filters.project) {
      result = result.filter(bug => bug.project === filters.project);
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredBugs(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBug(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLabelToggle = (label) => {
    setNewBug(prev => ({
      ...prev,
      labels: prev.labels.includes(label) 
        ? prev.labels.filter(l => l !== label) 
        : [...prev.labels, label]
    }));
  };

  const handleAddBug = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'bugs'), {
        ...newBug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        timerStart: newBug.status === 'in-progress' ? serverTimestamp() : null
      });
      
      setNewBug({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium',
        project: '',
        assignee: '',
        dueDate: '',
        createdBy: user.name,
        labels: []
      });
      fetchBugs();
    } catch (error) {
      console.error('Error adding bug:', error);
    }
  };

  const handleUpdateBug = async () => {
    if (!editingBug) return;
    
    try {
      const bugRef = doc(db, 'bugs', editingBug.id);
      await updateDoc(bugRef, {
        ...editingBug,
        updatedAt: serverTimestamp()
      });
      setEditingBug(null);
      fetchBugs();
    } catch (error) {
      console.error('Error updating bug:', error);
    }
  };

  const handleDeleteBug = async (bugId) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        const bugRef = doc(db, 'bugs', bugId);
        const bugDoc = await getDoc(bugRef);
        const bugData = bugDoc.data();
        
        if (bugData.timerStart) {
          await stopTimer(bugId);
        }
        
        await deleteDoc(bugRef);
        fetchBugs();
      } catch (error) {
        console.error('Error deleting bug:', error);
      }
    }
  };

  const handleCloseBug = async (bugId) => {
    try {
      await stopTimer(bugId);
      const bugRef = doc(db, 'bugs', bugId);
      await updateDoc(bugRef, {
        status: 'pending-approval',
        updatedAt: serverTimestamp()
      });
      fetchBugs();
    } catch (error) {
      console.error('Error closing bug:', error);
    }
  };

  const handleApproveBug = async (bugId) => {
    try {
      const bugRef = doc(db, 'bugs', bugId);
      await updateDoc(bugRef, {
        status: 'closed',
        updatedAt: serverTimestamp()
      });
      fetchBugs();
    } catch (error) {
      console.error('Error approving bug:', error);
    }
  };

  const handleReopenBug = async (bugId) => {
    try {
      const bugRef = doc(db, 'bugs', bugId);
      await updateDoc(bugRef, {
        status: 'open',
        updatedAt: serverTimestamp()
      });
      await startTimerForBug(bugId);
      fetchBugs();
    } catch (error) {
      console.error('Error reopening bug:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Bug Tracker</h1>
          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              Welcome, <span className="text-white">{user.name}</span>! <span className="text-gray-500">({user.role})</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-md border border-red-800/50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <BugFilters 
          filters={filters} 
          projects={projects} 
          handleFilterChange={handleFilterChange} 
        />

        {user.role === 'developer' && (
          <BugForm 
            newBug={newBug} 
            projects={projects} 
            teamMembers={teamMembers} 
            handleInputChange={handleInputChange} 
            handleLabelToggle={handleLabelToggle} 
            handleAddBug={handleAddBug} 
          />
        )}

        <BugList 
          filteredBugs={filteredBugs} 
          user={user} 
          setEditingBug={setEditingBug}
          handleDeleteBug={handleDeleteBug}
          handleCloseBug={handleCloseBug}
          handleApproveBug={handleApproveBug}
          handleReopenBug={handleReopenBug}
        />
      </div>

      <EditBugModal 
        editingBug={editingBug} 
        setEditingBug={setEditingBug} 
        projects={projects} 
        handleUpdateBug={handleUpdateBug} 
      />
    </div>
  );
};

export default Dashboard;
