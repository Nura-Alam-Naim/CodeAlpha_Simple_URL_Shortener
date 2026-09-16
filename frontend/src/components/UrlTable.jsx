import React, { useState, useEffect } from 'react';
import { Trash2, Search, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
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
        if (!window.confirm('Are you sure you want to delete this URL?')) return;
        
        try {
            await api.delete(`/urls/${shortCode}`);
            toast.success('URL deleted successfully');
            fetchUrls();
        } catch (error) {
            toast.error(error.message || 'Failed to delete URL');
        }
    };

    return (
        <div className="glass-panel" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Your Links</h2>
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
                                            <BarChart3 size={16} color="var(--primary)" />
                                            {url.click_count}
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
                                        <button 
                                            className="btn-icon" 
                                            onClick={() => handleDelete(url.short_code)}
                                            style={{ color: 'var(--danger)' }}
                                            title="Delete"
                                            disabled={!url.is_active}
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
        </div>
    );
};

export default UrlTable;
