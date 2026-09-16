import React, { useState, useEffect } from 'react';
import { Trash2, Search, BarChart3, ChevronLeft, ChevronRight, Pause, Play, RefreshCw, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../api';
import { toast } from 'react-toastify';

const UrlTable = ({ reloadTrigger }) => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // Analytics Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/urls', {
                params: { page, limit: 10, search: debouncedSearch }
            });
            setUrls(data.data);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch URLs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrls();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, debouncedSearch, reloadTrigger]);

    const handleDelete = async (shortCode) => {
        if (!window.confirm('Are you sure you want to permanently delete this URL and all its analytics?')) return;
        
        try {
            await api.delete(`/urls/${shortCode}`);
            toast.success('URL deleted completely');
            fetchUrls();
        } catch (error) {
            toast.error(error.message || 'Failed to delete URL');
        }
    };

    const handleToggleActive = async (shortCode, isActive) => {
        try {
            if (isActive) {
                await api.put(`/urls/${shortCode}/deactivate`);
                toast.success('URL stopped');
            } else {
                await api.put(`/urls/${shortCode}/activate`);
                toast.success('URL activated');
            }
            fetchUrls();
        } catch (error) {
            toast.error(error.message || 'Failed to change URL status');
        }
    };

    const openAnalytics = async (shortCode) => {
        setShowModal(true);
        setModalLoading(true);
        try {
            const { data } = await api.get(`/stats/${shortCode}`);
            setModalData(data);
        } catch (error) {
            toast.error('Failed to load analytics');
            setShowModal(false);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2>Your Links</h2>
                    <button className="btn-icon" onClick={fetchUrls} title="Refresh Table" style={{ marginBottom: '0.5rem' }}>
                        <RefreshCw size={18} />
                    </button>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search URLs..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading...</div>
                ) : urls.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>No URLs found.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Short Code</th>
                                <th>Original URL</th>
                                <th>Clicks</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urls.map((url) => (
                                <tr key={url.id}>
                                    <td>
                                        <a href={`http://localhost:5001/${url.short_code}`} target="_blank" rel="noopener noreferrer">
                                            {url.short_code}
                                        </a>
                                    </td>
                                    <td>
                                        <a href={url.original_url} target="_blank" rel="noopener noreferrer" className="truncate" title={url.original_url}>
                                            {url.original_url}
                                        </a>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold' }}>{url.click_count}</span>
                                            <button className="btn-icon" onClick={() => openAnalytics(url.short_code)} title="View Analytics" style={{ padding: '0.25rem' }}>
                                                <BarChart3 size={16} color="var(--primary)" />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {url.is_active ? (
                                            <span className="status-badge status-active">Active</span>
                                        ) : (
                                            <span className="status-badge status-expired">Inactive</span>
                                        )}
                                    </td>
                                    <td>
                                        <span title={new Date(url.created_at).toLocaleString()}>
                                            {formatDistanceToNow(new Date(url.created_at), { addSuffix: true })}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                className="btn-icon" 
                                                onClick={() => handleToggleActive(url.short_code, url.is_active)}
                                                title={url.is_active ? "Stop URL" : "Start URL"}
                                            >
                                                {url.is_active ? <Pause size={16} color="var(--text-main)" /> : <Play size={16} color="var(--success)" />}
                                            </button>
                                            <button 
                                                className="btn-icon" 
                                                onClick={() => handleDelete(url.short_code)}
                                                style={{ color: 'var(--danger)' }}
                                                title="Hard Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="btn-icon" 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="pagination-info">Page {page} of {totalPages}</span>
                    <button 
                        className="btn-icon" 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Analytics Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Analytics: {modalData?.short_code}</h3>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {modalLoading ? (
                                <p style={{ textAlign: 'center' }}>Loading stats...</p>
                            ) : modalData ? (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                                        <div>
                                            <p style={{ color: 'var(--text-muted)' }}>Total Clicks</p>
                                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{modalData.click_count}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: 'var(--text-muted)' }}>Status</p>
                                            <p style={{ fontWeight: 'bold', color: modalData.is_active ? 'var(--success)' : 'var(--danger)' }}>
                                                {modalData.is_active ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    </div>

                                    <h4>Recent Clicks (Last 10)</h4>
                                    {modalData.recent_logs && modalData.recent_logs.length > 0 ? (
                                        <div style={{ marginTop: '1rem' }}>
                                            {modalData.recent_logs.map((log, idx) => (
                                                <div key={idx} className="log-item">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>IP: {log.ip_address || 'Unknown'}</span>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                            {new Date(log.clicked_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', wordBreak: 'break-all' }}>
                                                        {log.user_agent || 'Unknown Browser'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No clicks recorded yet.</p>
                                    )}
                                </div>
                            ) : (
                                <p>Error loading data.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UrlTable;
