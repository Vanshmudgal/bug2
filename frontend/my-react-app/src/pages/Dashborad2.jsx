import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth';
import { db, auth } from '../services/firebase';
import { 
  collection, query, where, getDocs, addDoc,
  doc, updateDoc, deleteDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

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
  const [totalTimes, setTotalTimes] = useState({});
  const [developerTimes, setDeveloperTimes] = useState({});
  const [elapsedTimes, setElapsedTimes] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchBugs();
      await fetchTimeLogs();
    };
    fetchData();

    const interval = setInterval(() => {
      updateElapsedTimes();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Apply filters when bugs or filters change
  useEffect(() => {
    applyFiltersAndSort();
  }, [bugs, filters, sortConfig]);

  const updateElapsedTimes = () => {
    const now = new Date();
    const updatedElapsedTimes = {};
    
    bugs.forEach(bug => {
      if (bug.status === 'in-progress' && bug.timerStart) {
        const startTime = bug.timerStart.toDate();
        updatedElapsedTimes[bug.id] = Math.floor((now - startTime) / 1000);
      }
      
      // Calculate total time from creation to now for all bugs
      if (bug.createdAt) {
        const createdAt = bug.createdAt.toDate();
        updatedElapsedTimes[bug.id] = updatedElapsedTimes[bug.id] || 0;
        updatedElapsedTimes[bug.id] += Math.floor((now - createdAt) / 1000);
      }
    });
    
    setElapsedTimes(updatedElapsedTimes);
  };

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

        fetchTimeLogs();
        fetchBugs();
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const calculateTotalTime = (bug) => {
    const dbTime = totalTimes[bug.id] || 0;
    if (bug.status === 'in-progress' && bug.timerStart) {
      const activeTime = elapsedTimes[bug.id] || 0;
      return dbTime + activeTime;
    }
    return dbTime;
  };

  const fetchBugs = async () => {
    const q = query(collection(db, 'bugs'));
    const querySnapshot = await getDocs(q);
    const bugsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timerStart: doc.data().timerStart || null,
      createdAt: doc.data().createdAt || serverTimestamp() // Ensure createdAt exists
    }));
    setBugs(bugsData);
  };

  const fetchTimeLogs = async () => {
    const q = query(collection(db, 'timeLogs'));
    const querySnapshot = await getDocs(q);
    const logsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const times = {};
    const devTimes = {};
    
    logsData.forEach(log => {
      if (!times[log.bugId]) times[log.bugId] = 0;
      times[log.bugId] += log.duration;
      
      if (!devTimes[log.bugId]) devTimes[log.bugId] = {};
      if (!devTimes[log.bugId][log.userId]) {
        devTimes[log.bugId][log.userId] = { name: log.userName, time: 0 };
      }
      devTimes[log.bugId][log.userId].time += log.duration;
    });
    
    setTotalTimes(times);
    setDeveloperTimes(devTimes);
  };

  const applyFiltersAndSort = () => {
    let result = [...bugs];
    
    // Apply filters
    if (filters.status) {
      result = result.filter(bug => bug.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(bug => bug.priority === filters.priority);
    }
    if (filters.project) {
      result = result.filter(bug => bug.project === filters.project);
    }
    
    // Apply sorting
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

  const formatTime = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-emerald-900/20 text-emerald-400';
      case 'in-progress': return 'bg-amber-900/20 text-amber-400';
      case 'pending-approval': return 'bg-blue-900/20 text-blue-400';
      case 'closed': return 'bg-gray-800/50 text-gray-400';
      default: return '';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-blue-400';
      case 'high': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return '';
    }
  };

  const renderTimeTracking = (bug) => {
    const totalTime = calculateTotalTime(bug);
    const createdAt = bug.createdAt?.toDate();
    const now = new Date();
    const timeSinceCreation = createdAt ? Math.floor((now - createdAt) / 1000) : 0;
    
    return (
      <div className="flex flex-col">
        <div className="text-sm font-medium">
          {formatTime(totalTime)}
          {bug.status === 'in-progress' && (
            <span className="ml-2 text-xs text-emerald-400">(Active)</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Total: {formatTime(timeSinceCreation)}
        </div>
        {user.role === 'manager' && developerTimes[bug.id] && (
          <div className="mt-1 space-y-1">
            {Object.entries(developerTimes[bug.id]).map(([userId, data]) => (
              <div key={userId} className="text-xs text-gray-500">
                {data.name}: {formatTime(data.time)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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

        {/* Filters Section */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
          <h2 className="text-lg font-medium text-gray-300 mb-3">Filters</h2>
          <div className="flex flex-wrap gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-approval">Pending Approval</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <select
              name="project"
              value={filters.project}
              onChange={handleFilterChange}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bug Creation Form (for developers) */}
        {user.role === 'developer' && (
          <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
            <h2 className="text-lg font-medium text-gray-300 mb-4">Create New Bug</h2>
            <form onSubmit={handleAddBug} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={newBug.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Project*</label>
                  <select
                    name="project"
                    value={newBug.project}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={newBug.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Priority*</label>
                  <select
                    name="priority"
                    value={newBug.priority}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status*</label>
                  <select
                    name="status"
                    value={newBug.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
                  <select
                    name="assignee"
                    value={newBug.assignee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newBug.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Labels</label>
                <div className="flex flex-wrap gap-2">
                  {['bug', 'feature', 'ui', 'backend', 'urgent'].map(label => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleLabelToggle(label)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        newBug.labels.includes(label) 
                          ? 'bg-blue-900/50 text-blue-400 border border-blue-800' 
                          : 'bg-gray-800/50 text-gray-400 border border-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm font-medium transition-colors"
              >
                Create Bug
              </button>
            </form>
          </div>
        )}

        {/* Bugs List */}
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-medium text-gray-300">
              {user.role === 'developer' ? 'Your Bugs' : 'All Bugs'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignee</th>
                  {user.role === 'manager' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created By</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredBugs
                  .filter(bug => user.role === 'manager' || bug.createdBy === user.name || bug.assignee === user.name)
                  .map(bug => (
                    <tr key={bug.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{bug.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{bug.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bug.status)}`}>
                          {bug.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm capitalize ${getPriorityColor(bug.priority)}`}>
                        {bug.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{bug.assignee || 'Unassigned'}</td>
                      {user.role === 'manager' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{bug.createdBy}</td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {renderTimeTracking(bug)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 space-x-2">
                        {user.role === 'developer' && (
                          <>
                            <button
                              onClick={() => setEditingBug(bug)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBug(bug.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                            {bug.status === 'in-progress' && (
                              <button
                                onClick={() => handleCloseBug(bug.id)}
                                className="text-amber-400 hover:text-amber-300"
                              >
                                End Task
                              </button>
                            )}
                          </>
                        )}
                        {user.role === 'manager' && bug.status === 'pending-approval' && (
                          <>
                            <button
                              onClick={() => handleApproveBug(bug.id)}
                              className="text-emerald-400 hover:text-emerald-300"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReopenBug(bug.id)}
                              className="text-amber-400 hover:text-amber-300"
                            >
                              Reopen
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Bug Modal */}
      {editingBug && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-800">
            <h2 className="text-lg font-medium text-gray-300 mb-4">Edit Bug</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={editingBug.title}
                    onChange={(e) => setEditingBug({...editingBug, title: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Project*</label>
                  <select
                    name="project"
                    value={editingBug.project}
                    onChange={(e) => setEditingBug({...editingBug, project: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={editingBug.description}
                  onChange={(e) => setEditingBug({...editingBug, description: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Priority*</label>
                  <select
                    name="priority"
                    value={editingBug.priority}
                    onChange={(e) => setEditingBug({...editingBug, priority: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status*</label>
                  <select
                    name="status"
                    value={editingBug.status}
                    onChange={(e) => setEditingBug({...editingBug, status: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    {editingBug.status === 'pending-approval' && (
                      <option value="pending-approval">Pending Approval</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBug(null)}
                  className="px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateBug}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;