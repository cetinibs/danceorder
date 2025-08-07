'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  isActive: boolean;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    managerName: ''
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
      }
    } catch (error) {
      console.error('Şubeler alınırken hata:', error);
      toast.error('Şubeler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/branches', {
        method: editingBranch ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingBranch?.id,
          ...formData
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingBranch ? 'Şube güncellendi' : 'Şube eklendi');
        fetchBranches();
        handleCloseModal();
      } else {
        toast.error(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Şube kaydetme hatası:', error);
      toast.error('Şube kaydedilirken bir hata oluştu');
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      managerName: branch.managerName
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu şubeyi silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/branches?id=${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();

        if (data.success) {
          toast.success('Şube silindi');
          fetchBranches();
        } else {
          toast.error(data.error || 'Şube silinirken bir hata oluştu');
        }
      } catch (error) {
        console.error('Şube silme hatası:', error);
        toast.error('Şube silinirken bir hata oluştu');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      managerName: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Şubeler</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Şube Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{branch.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(branch)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(branch.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Yönetici: {branch.managerName}</p>
              <p>Telefon: {branch.phone}</p>
              <p>E-posta: {branch.email}</p>
              <p>Adres: {branch.address}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Şube Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingBranch ? 'Şube Düzenle' : 'Yeni Şube Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şube Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yönetici Adı
                </label>
                <input
                  type="text"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  {editingBranch ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 