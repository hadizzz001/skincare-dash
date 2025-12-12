'use client';

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';

const ManageCategory = () => {
  const FIXED_ID = "693b2df3cea03fcc38d25d9d"; // 🔒 Only this ID allowed

  const [editFormData, setEditFormData] = useState({ id: FIXED_ID, title: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

const fetchText = async () => {
  try {
    const res = await fetch(`/api/txt?id=${FIXED_ID}`);
    if (res.ok) {
      const data = await res.json(); // ← returns an array
      setEditFormData({ id: FIXED_ID, title: data[0]?.title || '' });
    }
  } catch (error) {
    console.error('Error:', error);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchText();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/txt?id=${FIXED_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editFormData.title }),
      });

      if (res.ok) {
        setMessage('Updated successfully!');
        router.refresh();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating text.');
    }
  };

  return (
    <div className="container mx-auto p-4 text-[13px]">
      <h1 className="text-2xl font-bold mb-4">Edit Text</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
      
          <form onSubmit={handleEditSubmit} className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Text Title"
              value={editFormData.title}
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              required
              className="border p-2 w-full"
            />

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Update Text
            </button>
          </form>
        </>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default ManageCategory;
