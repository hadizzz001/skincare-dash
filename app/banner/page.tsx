'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import { useRouter } from 'next/navigation';

const Managebanner = () => {
  const [formData, setFormData] = useState({ title: '', sub: '', img: [] });
  const [editFormData, setEditFormData] = useState({ id: '', title: '', sub: '', img: [] });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [img, setImg] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  // Fetch all banners
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/banner');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Banner added successfully!');
      setFormData({ title: '', sub: '', img: [] });
      fetchCategories();
      window.location.replace("/banner");
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  // Edit banner
  const handleEdit = (banner) => {
    setEditMode(true);
    setEditFormData({
      id: banner.id,
      title: banner.title,
      sub: banner.sub || '',
      img: banner.img,
    });
    setImg(banner.img);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/banner?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.title,
          sub: editFormData.sub,
          img: img,
        }),
      });

      if (res.ok) {
        setEditFormData({ id: '', title: '', sub: '', img: [] });
        setEditMode(false);
        fetchCategories();
        window.location.replace("/banner");
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the banner.');
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete this banner?`)) return;

    try {
      const res = await fetch(`/api/banner?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage('Banner deleted successfully!');
        fetchCategories();
        window.location.replace("/banner");
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle image upload
  const handleImgChange = (url) => {
    if (url) setImg(url);
  };

  useEffect(() => {
    if (!img.includes('')) {
      if (editMode) {
        setEditFormData((prev) => ({ ...prev, img }));
      } else {
        setFormData((prev) => ({ ...prev, img }));
      }
    }
  }, [img, editMode]);

  return (
    <div className="container mx-auto p-4 text-[13px]">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit banner' : 'Add banner'}</h1>

      {/* ADD / EDIT FORM */}
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="mb-8 space-y-4">

        {/* NAME */}
        <input
          type="text"
          placeholder="Banner Name"
          value={editMode ? editFormData.title : formData.title}
          onChange={(e) =>
            editMode
              ? setEditFormData({ ...editFormData, title: e.target.value })
              : setFormData({ ...formData, title: e.target.value })
          }
          required
          className="border p-2 w-full"
        />

        {/* SUB TITLE */}
        <input
          type="text"
          placeholder="Sub text"
          value={editMode ? editFormData.sub : formData.sub}
          onChange={(e) =>
            editMode
              ? setEditFormData({ ...editFormData, sub: e.target.value })
              : setFormData({ ...formData, sub: e.target.value })
          }
          className="border p-2 w-full"
        />

        {/* UPLOAD */}
        <Upload onFilesUpload={handleImgChange} />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editMode ? 'Update banner' : 'Add banner'}
        </button>

        {editMode && (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setEditFormData({ id: '', title: '', sub: '', img: [] });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {/* banner TABLE */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Image</th>
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Sub</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((banner) => (
            <tr key={banner.id}>
              <td className="border p-2">
                {banner.img?.length > 0 ? (
                  <img
                    src={banner.img[0]}
                    alt={banner.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : '—'}
              </td>

              <td className="border p-2">{banner.title}</td>
              <td className="border p-2">{banner.sub || '—'}</td>

              <td className="border p-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default Managebanner;
