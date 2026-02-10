import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Heart, Copy, Check } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Registry {
  _id?: string;
  id?: string;
  name: string;
  url: string;
  type: 'zola' | 'amazon' | 'target' | 'bed-bath-beyond' | 'other';
  notes?: string;
}

export default function RegistryManager() {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newRegistry, setNewRegistry] = useState<Partial<Registry>>({
    name: '',
    url: '',
    type: 'zola',
    notes: '',
  });

  useEffect(() => {
    fetchRegistries();
  }, []);

  const fetchRegistries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const cached = localStorage.getItem('registries');
        if (cached) setRegistries(JSON.parse(cached));
        return;
      }

      const response = await axios.get(`${API_URL}/api/registries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRegistries(response.data.data || []);
        localStorage.setItem('registries', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Failed to fetch registries:', error);
      const cached = localStorage.getItem('registries');
      if (cached) setRegistries(JSON.parse(cached));
    }
  };

  const addRegistry = async () => {
    if (!newRegistry.name || !newRegistry.url) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        const local = [...registries, { id: `local-${Date.now()}`, ...newRegistry } as Registry];
        setRegistries(local);
        localStorage.setItem('registries', JSON.stringify(local));
        setShowAddModal(false);
        setNewRegistry({ name: '', url: '', type: 'zola' });
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/registries`,
        newRegistry,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRegistries([...registries, response.data.data]);
        setShowAddModal(false);
        setNewRegistry({ name: '', url: '', type: 'zola' });
      }
    } catch (error) {
      console.error('Failed to add registry:', error);
      alert('Failed to add registry');
    } finally {
      setLoading(false);
    }
  };

  const deleteRegistry = async (id: string) => {
    if (!confirm('Delete this registry?')) return;

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`${API_URL}/api/registries/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setRegistries(registries.filter(r => (r._id || r.id) !== id));
    } catch (error) {
      console.error('Failed to delete registry:', error);
    }
  };

  const typeColors = {
    zola: { badge: 'bg-blue-100 text-blue-700', bg: 'bg-blue-50' },
    amazon: { badge: 'bg-orange-100 text-orange-700', bg: 'bg-orange-50' },
    target: { badge: 'bg-red-100 text-red-700', bg: 'bg-red-50' },
    'bed-bath-beyond': { badge: 'bg-green-100 text-green-700', bg: 'bg-green-50' },
    other: { badge: 'bg-gray-100 text-gray-700', bg: 'bg-gray-50' },
  };

  const typeIcons = {
    zola: '💍',
    amazon: '📦',
    target: '🎯',
    'bed-bath-beyond': '🛁',
    other: '🎁',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white drop-shadow-md">Wedding Registries</h1>
        <p className="text-gray-100 mt-1 drop-shadow-md">Centralize all your gift registries in one place</p>
      </div>

      {/* Search & Add Bar */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
        <div className="flex-1">
          <p className="text-gray-700 font-medium">
            <span className="text-lg font-bold text-primary-600">{registries.length}</span> registry{registries.length !== 1 ? 'ies' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Registry
        </button>
      </div>

      {/* Registries Grid - Vendor Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {registries.map(registry => {
          const colors = typeColors[registry.type as keyof typeof typeColors];
          const icon = typeIcons[registry.type as keyof typeof typeIcons];
          const id = registry._id || registry.id || `reg-${Date.now()}`;
          
          return (
            <div key={id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden relative">
              {/* Delete Button */}
              <button
                onClick={() => deleteRegistry(id)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full transition bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-md"
                title="Remove registry"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="p-6">
                {/* Title & Type */}
                <div className="flex items-start justify-between mb-4 pr-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{icon}</span>
                      <h3 className="text-xl font-bold text-gray-900">{registry.name}</h3>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                      {registry.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Notes if any */}
                {registry.notes && (
                  <p className="text-sm text-gray-600 mb-4 italic">"{registry.notes}"</p>
                )}

                {/* URL Display */}
                <div className={`mb-4 p-3 rounded-lg ${colors.bg}`}>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Registry Link</p>
                  <p className="text-xs text-gray-600 truncate font-mono">{registry.url}</p>
                </div>

                {/* Share Instructions */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Share with guests</p>
                  <p className="text-xs text-blue-600">Include this link in your wedding invitations and website</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <a
                    href={registry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-primary-500 text-white hover:bg-primary-600 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Registry
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(registry.url);
                      setCopiedId(id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition ${
                      copiedId === id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Copy registry link"
                  >
                    {copiedId === id ? (
                      <>
                        <Check className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {registries.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No registries yet</h3>
            <p className="text-gray-600 mb-6">
              Add your wedding registries from your favorite stores to share with guests
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Registry
            </button>
          </div>
        )}
      </div>

      {/* Helpful Tips */}
      {registries.length > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-200">
          <h4 className="font-bold text-gray-900 mb-3">💡 Tips for Sharing Registries</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Include all registries in your wedding website</li>
            <li>✓ Add registry links to your email invitations</li>
            <li>✓ Share on your wedding registry landing page</li>
            <li>✓ Multiple registries make it easier for guests to find gifts they can afford</li>
          </ul>
        </div>
      )}

      {/* Add Registry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-semibold tracking-tight mb-4">Add Registry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registry Name *</label>
                <input
                  type="text"
                  value={newRegistry.name || ''}
                  onChange={(e) => setNewRegistry({ ...newRegistry, name: e.target.value })}
                  placeholder="e.g., Our Zola Registry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registry Type *</label>
                <select
                  value={newRegistry.type || 'zola'}
                  onChange={(e) => setNewRegistry({ ...newRegistry, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="zola">Zola</option>
                  <option value="amazon">Amazon Registry</option>
                  <option value="target">Target Registry</option>
                  <option value="bed-bath-beyond">Bed Bath & Beyond</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registry URL *</label>
                <input
                  type="url"
                  value={newRegistry.url || ''}
                  onChange={(e) => setNewRegistry({ ...newRegistry, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewRegistry({ name: '', url: '', type: 'zola' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addRegistry}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Registry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
