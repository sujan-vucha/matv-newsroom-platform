import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, XCircle, AlertCircle, Download, X, Eye, FileText, Trash2 } from 'lucide-react';

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  preferredTime: string;
  expertise?: string;
  message?: string;
  whyPodcast: string;
  topicsToDiscuss: string;
  pastEngagements?: string;
  portfolioUrl?: string;
  socialMediaLinks?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  submittedAt: string;
}

// Helper function for downloading files
const downloadFile = (url: string, filename?: string) => {
  const proxyUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/download?url=${encodeURIComponent(url)}`;
  const link = document.createElement('a');
  link.href = proxyUrl;
  link.download = filename || 'portfolio.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const RajneetiBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rajneeti-bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'rejected') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rajneeti-bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking._id === id ? { ...booking, status } : booking
        ));
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rajneeti-bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking._id !== id));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSlotLabel = (value: string) => {
    const timeSlots: { [key: string]: string } = {
      'saturday': 'Saturday: 10:00–11:00 AM (London)',
      'oct25': 'Saturday, 25th Oct - 10:00–11:00 AM',
      'oct27': 'Monday, 27th Oct - 1:00–2:00 PM (London) / 5:30–6:30 PM (India)',
      'nov1': 'Saturday, 1st Nov - 10:00–11:00 AM',
      'nov3': 'Monday, 3rd Nov - 1:00–2:00 PM (London) / 5:30–6:30 PM (India)',
      'nov8': 'Saturday, 8th Nov - 10:00–11:00 AM',
      'nov10': 'Monday, 10th Nov - 1:00–2:00 PM (London) / 5:30–6:30 PM (India)',
      'nov15': 'Saturday, 15th Nov - 10:00–11:00 AM',
      'nov22': 'Saturday, 22nd Nov - 10:00–11:00 AM',
      'nov29': 'Saturday, 29th Nov - 10:00–11:00 AM',
      'dec6': 'Saturday, 6th Dec - 10:00–11:00 AM',
      'dec13': 'Saturday, 13th Dec - 10:00–11:00 AM',
      'dec20': 'Saturday, 20th Dec - 10:00–11:00 AM',
      'dec27': 'Saturday, 27th Dec - 10:00–11:00 AM'
    };
    return timeSlots[value] || value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rajneeti Show Bookings</h1>
        <p className="text-gray-600">Manage bookings for "Rajneeti by Prashant Kumar" show</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'confirmed', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  filter === status
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status} ({bookings.filter(b => status === 'all' || b.status === status).length})
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
            <p className="text-slate-400">No bookings match the current filter.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{booking.name}</h3>
                    <p className="text-sm text-slate-400">{booking.email}</p>
                    <p className="text-xs text-slate-500">Submitted {formatDate(booking.submittedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="capitalize">{booking.status}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'rejected')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border border-slate-700 w-11/12 max-w-5xl shadow-lg rounded-md bg-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-white">Booking Details - {selectedBooking.name}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.name || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.email || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">WhatsApp Number</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.phone || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Area of Expertise</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.expertise || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Preferred Time</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.preferredTime ? getTimeSlotLabel(selectedBooking.preferredTime) : '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Why Podcast</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.whyPodcast || '-'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Topics to Discuss</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.topicsToDiscuss || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Past Engagements</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.pastEngagements || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Social Media Links</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.socialMediaLinks || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Additional Message</label>
                    <p className="mt-1 text-sm text-white">{selectedBooking.message || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Portfolio</label>
                    <div className="mt-1">
                      {selectedBooking.portfolioUrl && selectedBooking.portfolioUrl.trim() !== '' ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => downloadFile(
                              selectedBooking.portfolioUrl,
                              'portfolio.pdf'
                            )}
                            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800 underline"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Download Portfolio</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-1">Click to download the portfolio file</p>
                        </div>
                      ) : (
                        <p className="text-sm text-white">-</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300">Submitted At</label>
                    <p className="mt-1 text-sm text-white">{formatDate(selectedBooking.submittedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedBooking.status === 'pending' && (
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking._id, 'confirmed');
                    setIsModalOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm</span>
                </button>
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking._id, 'rejected');
                    setIsModalOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RajneetiBookings;