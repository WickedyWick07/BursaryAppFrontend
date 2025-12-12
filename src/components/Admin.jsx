import React, { useEffect, useState, useContext } from 'react';
import { Users, Award, Shield, TrendingUp, Search, Filter, MoreVertical, ExternalLink, Mail, UserCheck, UserX, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import api from '../../axios/api';
import {AuthContext} from '../context/AuthContext';

const Admin = () => {
  const [bursaries, setBursaries] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { logout} = useContext(AuthContext)
  
  // Pagination states
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentBursaryPage, setCurrentBursaryPage] = useState(1);
  const usersPerPage = 9;
  const bursariesPerPage = 5;

  useEffect(() => {
    const fetchBursaries = async () => {
      try {
        const res = await api.get('bursaries');
        setBursaries(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        console.error('An error occurred while fetching bursaries', error);
        setBursaries([]);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const res = await api.get('fetch-all-users');
        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      } catch (error) {
        console.error('An error occurred while fetching users', error);
        setUsers([]);
      }
    };

    fetchBursaries();
    fetchAllUsers();
  }, []);

  const staffCount = users.filter(user => user.is_staff).length;
  const regularUsers = users.length - staffCount;

  // Extract unique categories from bursaries
  const categories = ['all', ...new Set(bursaries.map(b => b.category).filter(Boolean))];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterRole === 'all' || 
      (filterRole === 'staff' && user.is_staff) || 
      (filterRole === 'regular' && !user.is_staff);
    return matchesSearch && matchesFilter;
  });

  // Filter bursaries by category
  const filteredBursaries = selectedCategory === 'all' 
    ? bursaries 
    : bursaries.filter(b => b.category === selectedCategory);

  // Pagination logic for users
  const indexOfLastUser = currentUserPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination logic for bursaries
  const indexOfLastBursary = currentBursaryPage * bursariesPerPage;
  const indexOfFirstBursary = indexOfLastBursary - bursariesPerPage;
  const currentBursaries = filteredBursaries.slice(indexOfFirstBursary, indexOfLastBursary);
  const totalBursaryPages = Math.ceil(filteredBursaries.length / bursariesPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentUserPage(1);
  }, [searchTerm, filterRole]);

  useEffect(() => {
    setCurrentBursaryPage(1);
  }, [selectedCategory]);

  const Pagination = ({ currentPage, totalPages, onPageChange, itemType }) => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> {itemType}
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => onPageChange(1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                </>
              )}
              
              {pages.map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-blue-600 text-white focus:z-20'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}

      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-200">Manage users, bursaries, and system overview</p>
            </div>
            <div className="flex items-center space-x-6">
              <Shield className="w-16 h-16 text-blue-300 opacity-50" />
              {/* Logout Button */}
              <button
                onClick={() => logout()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Active accounts</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Staff & Admins</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{staffCount}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {((staffCount / users.length) * 100 || 0).toFixed(1)}% of total users
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Regular Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{regularUsers}</p>
              </div>
              <div className="bg-emerald-100 rounded-full p-3">
                <UserCheck className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Standard access level
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Bursaries</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bursaries.length}</p>
              </div>
              <div className="bg-amber-100 rounded-full p-3">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Available opportunities
            </div>
          </div>
        </div>

        {/* Bursaries Section */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-white mr-3" />
                <h2 className="text-2xl font-bold text-white">Bursary Opportunities</h2>
              </div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                {filteredBursaries.length} available
              </span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 mr-2">Categories:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {currentBursaries.length > 0 ? (
              <div className="space-y-4">
                {currentBursaries.map(bursary => (
                  <div
                    key={bursary.id}
                    className="border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {bursary.title}
                          </h3>
                          {bursary.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {bursary.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-3">{bursary.description}</p>
                        <a
                          href={bursary.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 ml-4">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No bursaries found in this category</p>
              </div>
            )}
          </div>

          {totalBursaryPages > 1 && (
            <Pagination
              currentPage={currentBursaryPage}
              totalPages={totalBursaryPages}
              onPageChange={setCurrentBursaryPage}
              itemType="bursaries"
            />
          )}
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-white mr-3" />
                <h2 className="text-2xl font-bold text-white">User Management</h2>
              </div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                {filteredUsers.length} users
              </span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Users</option>
                  <option value="staff">Staff Only</option>
                  <option value="regular">Regular Users</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className="p-6">
            {currentUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUsers.map(user => (
                  <div
                    key={user.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          user.is_staff ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                        }`}>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {user.first_name} {user.last_name}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            user.is_staff 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.is_staff ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                User
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No users found matching your criteria</p>
              </div>
            )}
          </div>

          {totalUserPages > 1 && (
            <Pagination
              currentPage={currentUserPage}
              totalPages={totalUserPages}
              onPageChange={setCurrentUserPage}
              itemType="users"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;