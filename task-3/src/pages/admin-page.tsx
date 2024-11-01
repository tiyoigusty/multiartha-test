import { useState, useEffect } from "react";
import { Navbar } from "../components/navbar";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

type User = {
  id: number;
  name: string;
  email: string;
  last_login: string;
};

type FormValues = {
  username: string;
  email: string;
  password: string;
};

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

  async function fetchDataUser() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users`
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const onAddUser: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users`,
        data
      );
      setUsers([...users, response.data.data]);
      setIsAddUserModalOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };

  const onEditUser: SubmitHandler<FormValues> = async (data) => {
    if (!selectedUser) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/${selectedUser.id}`,
        data
      );
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? response.data.data : user
        )
      );
      setIsEditModalOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  function handleEdit(user: User) {
    setSelectedUser(user);
    setValue("username", user.name);
    setValue("email", user.email);
    setIsEditModalOpen(true);
  }

  function handleDelete(userId: number) {
    setDeleteUserId(userId);
    setIsDeleteConfirmOpen(true);
  }

  async function confirmDelete() {
    try {
      if (deleteUserId !== null) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/users/${deleteUserId}`
        );
        setUsers(users.filter((user) => user.id !== deleteUserId));
        setIsDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  }

  useEffect(() => {
    fetchDataUser();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center my-3 mx-3">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <button
          onClick={() => {
            reset();
            setIsAddUserModalOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 mb-4 rounded"
        >
          Add Data
        </button>
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Last Login</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-center">{user.name}</td>
              <td className="border px-4 py-2 text-center">{user.email}</td>
              <td className="border px-4 py-2 text-center">
                {user.last_login}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah User */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleSubmit(onAddUser)}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  {...register("username")}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit(onEditUser)}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  {...register("username")}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
