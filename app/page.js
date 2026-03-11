'use client';

import { useState, useEffect } from 'react';

export default function Home() {
    const [clientes, setClientes] = useState([]);
    const [giros, setGiros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingClient, setEditingClient] = useState(null);
    const [editingGiro, setEditingGiro] = useState(null);
    const [clientForm, setClientForm] = useState({
        rut: '',
        nombre: '',
        apellido: '',
        direccion: '',
        tipo_persona: 'N',
        email: '',
        telefono: '',
        observaciones: '',
        formalizado: false
    });
    const [giroForm, setGiroForm] = useState({
        nombre: '',
        categoria: ''
    });

    useEffect(() => {
        fetchClientes();
        fetchGiros();
    }, []);

    const fetchClientes = async () => {
        try {
            const res = await fetch('/api/clientes');
            const data = await res.json();
            if (!res.ok || data.error) {
                console.error('API error:', data.error);
                setClientes([]);
            } else {
                setClientes(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching clientes:', error);
            setClientes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchGiros = async () => {
        try {
            const res = await fetch('/api/giros');
            const data = await res.json();
            if (!res.ok || data.error) {
                console.error('API error:', data.error);
                setGiros([]);
            } else {
                setGiros(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching giros:', error);
            setGiros([]);
        }
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientForm)
            });
            if (res.ok) {
                setClientForm({
                    rut: '',
                    nombre: '',
                    apellido: '',
                    direccion: '',
                    tipo_persona: 'N',
                    email: '',
                    telefono: '',
                    observaciones: '',
                    formalizado: false
                });
                fetchClientes();
            }
        } catch (error) {
            console.error('Error creating cliente:', error);
        }
    };

    const handleUpdateClient = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/clientes/${editingClient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingClient)
            });
            if (res.ok) {
                setEditingClient(null);
                fetchClientes();
            }
        } catch (error) {
            console.error('Error updating cliente:', error);
        }
    };

    const handleDeleteClient = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchClientes();
                }
            } catch (error) {
                console.error('Error deleting cliente:', error);
            }
        }
    };

    const handleCreateGiro = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/giros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(giroForm)
            });
            if (res.ok) {
                setGiroForm({ nombre: '', categoria: '' });
                fetchGiros();
            }
        } catch (error) {
            console.error('Error creating giro:', error);
        }
    };

    const handleUpdateGiro = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/giros/${editingGiro.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingGiro)
            });
            if (res.ok) {
                setEditingGiro(null);
                fetchGiros();
            }
        } catch (error) {
            console.error('Error updating giro:', error);
        }
    };

    const handleDeleteGiro = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este giro?')) {
            try {
                const res = await fetch(`/api/giros/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchGiros();
                }
            } catch (error) {
                console.error('Error deleting giro:', error);
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <img src="/logo.png" alt="Mercado Estación" className="w-32 mb-6" />
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Mercado Estación</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Clientes</h2>

                        {editingClient ? (
                            <form onSubmit={handleUpdateClient} className="bg-white p-6 rounded-lg shadow mb-6">
                                <h3 className="font-semibold mb-4">Editar Cliente</h3>
                                <div className="space-y-2">
                                    <input type="text" placeholder="RUT" value={editingClient.rut} onChange={(e) => setEditingClient({ ...editingClient, rut: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Nombre" value={editingClient.nombre} onChange={(e) => setEditingClient({ ...editingClient, nombre: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Apellido" value={editingClient.apellido} onChange={(e) => setEditingClient({ ...editingClient, apellido: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Dirección" value={editingClient.direccion} onChange={(e) => setEditingClient({ ...editingClient, direccion: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="email" placeholder="Email" value={editingClient.email} onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="tel" placeholder="Teléfono" value={editingClient.telefono} onChange={(e) => setEditingClient({ ...editingClient, telefono: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <textarea placeholder="Observaciones" value={editingClient.observaciones} onChange={(e) => setEditingClient({ ...editingClient, observaciones: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={editingClient.formalizado || false} onChange={(e) => setEditingClient({ ...editingClient, formalizado: e.target.checked })} className="w-4 h-4" />
                                        <span>Formalizado</span>
                                    </label>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
                                    <button type="button" onClick={() => setEditingClient(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleCreateClient} className="bg-white p-6 rounded-lg shadow mb-6">
                                <h3 className="font-semibold mb-4">Crear Cliente</h3>
                                <div className="space-y-2">
                                    <input type="text" placeholder="RUT" value={clientForm.rut} onChange={(e) => setClientForm({ ...clientForm, rut: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Nombre" value={clientForm.nombre} onChange={(e) => setClientForm({ ...clientForm, nombre: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Apellido" value={clientForm.apellido} onChange={(e) => setClientForm({ ...clientForm, apellido: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Dirección" value={clientForm.direccion} onChange={(e) => setClientForm({ ...clientForm, direccion: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="email" placeholder="Email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="tel" placeholder="Teléfono" value={clientForm.telefono} onChange={(e) => setClientForm({ ...clientForm, telefono: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <textarea placeholder="Observaciones" value={clientForm.observaciones} onChange={(e) => setClientForm({ ...clientForm, observaciones: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={clientForm.formalizado} onChange={(e) => setClientForm({ ...clientForm, formalizado: e.target.checked })} className="w-4 h-4" />
                                        <span>Formalizado</span>
                                    </label>
                                </div>
                                <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded mt-4">Crear</button>
                            </form>
                        )}

                        <div className="bg-white rounded-lg shadow overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left">RUT</th>
                                        <th className="px-4 py-2 text-left">Nombre</th>
                                        <th className="px-4 py-2 text-left">Email</th>
                                        <th className="px-4 py-2 text-center">Formalizado</th>
                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.map((cliente) => (
                                        <tr key={cliente.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-2">{cliente.rut}</td>
                                            <td className="px-4 py-2">{cliente.nombre} {cliente.apellido}</td>
                                            <td className="px-4 py-2">{cliente.email}</td>
                                            <td className="px-4 py-2 text-center">{cliente.formalizado ? '✓' : '-'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => setEditingClient(cliente)} className="text-blue-600 mr-3">Editar</button>
                                                <button onClick={() => handleDeleteClient(cliente.id)} className="text-red-600">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Giros</h2>

                        {editingGiro ? (
                            <form onSubmit={handleUpdateGiro} className="bg-white p-6 rounded-lg shadow mb-6">
                                <h3 className="font-semibold mb-4">Editar Giro</h3>
                                <div className="space-y-2">
                                    <input type="text" placeholder="Nombre" value={editingGiro.nombre} onChange={(e) => setEditingGiro({ ...editingGiro, nombre: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Categoría" value={editingGiro.categoria} onChange={(e) => setEditingGiro({ ...editingGiro, categoria: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
                                    <button type="button" onClick={() => setEditingGiro(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleCreateGiro} className="bg-white p-6 rounded-lg shadow mb-6">
                                <h3 className="font-semibold mb-4">Crear Giro</h3>
                                <div className="space-y-2">
                                    <input type="text" placeholder="Nombre" value={giroForm.nombre} onChange={(e) => setGiroForm({ ...giroForm, nombre: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                    <input type="text" placeholder="Categoría" value={giroForm.categoria} onChange={(e) => setGiroForm({ ...giroForm, categoria: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                </div>
                                <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded mt-4">Crear</button>
                            </form>
                        )}

                        <div className="bg-white rounded-lg shadow overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Nombre</th>
                                        <th className="px-4 py-2 text-left">Categoría</th>
                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {giros.map((giro) => (
                                        <tr key={giro.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-2">{giro.nombre}</td>
                                            <td className="px-4 py-2">{giro.categoria}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => setEditingGiro(giro)} className="text-blue-600 mr-3">Editar</button>
                                                <button onClick={() => handleDeleteGiro(giro.id)} className="text-red-600">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
