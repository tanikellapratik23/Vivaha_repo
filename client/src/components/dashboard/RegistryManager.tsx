import { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, Heart, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Registry {
  _id?: string;
  id?: string;
  name: string;
  url: string;
  type: 'zola' | 'amazon' | 'target' | 'bed-bath-beyond' | 'other';
  itemsCount?: number;
  guests?: string[];
}

export default function RegistryManager() {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newRegistry, setNewRegistry] = useState<Partial<Registry>>({
    name: '',
    url: '',
    type: 'zola',
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
    zola: 'bg-blue-100 text-blue-700',
    amazon: 'bg-orange-100 text-orange-700',
    target: 'bg-red-100 text-red-700',
    'bed-bath-beyond': 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">Registry Manager</h1>
          <p className="text-gray-100 mt-1 drop-shadow-md">Centralize all your gift registries in one place</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Registry</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 font-medium">Total Registries</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{registries.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 font-medium">Guest Access</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {registries.length > 0 ? '✓ Ready' : 'Add registry'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 font-medium">Registry Types</p>
          <p className="text-sm text-gray-600 mt-2">
            {Array.from(new Set(registries.map(r => r.type))).join(', ') || 'None added'}
          </p>
        </div>
      </div>

      {/* Registries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registries.map(registry => (
          <div key={registry._id || registry.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{registry.name}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${typeColors[registry.type as keyof typeof typeColors]}`}>
                  {registry.type.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>

            <p className="text-sm text-gray-600 mb-4 truncate">{registry.url}</p>

            <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Registry Type</span>
                <span className="font-medium text-gray-900">{registry.type}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <a
                href={registry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Registry
              </a>
              <button
                onClick={() => deleteRegistry(registry._id || registry.id!)}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm transition"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {registries.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No registries added yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Add your wedding registries from your favorite retailers to share with guests
            </p>
          </div>
        )}
      </div>

      {/* Share Instructions */}
      {registries.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-lg text-gray-900 mb-3">📱 Share with Guests</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Copy your registry links and add them to your wedding website</p>
            <p>• Include in your email invitations or wedding announcements</p>
            <p>• Share directly in your wedding day communication hub</p>
            <p className="mt-3 p-2 bg-white rounded font-medium text-primary-600">
              ✨ Tip: Multiple registries help guests find gifts in their favorite stores!
            </p>
          </div>
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
