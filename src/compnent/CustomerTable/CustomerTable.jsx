import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomerTable.css'; // ملف CSS مخصص للتحسينات الإضافية

export default function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState({ name: '', amount: '' });

    useEffect(() => {
        const fetchData = async () => {
            const customerRes = await axios.get('http://localhost:5000/customers');
            const transactionRes = await axios.get('http://localhost:5000/transactions');
            setCustomers(customerRes.data);
            setTransactions(transactionRes.data);
        };
        fetchData();
    }, []);

    const filteredCustomers = customers.filter(customer => {
        const customerTransactions = transactions.filter(t => t.customer_id === customer.id);
        const totalAmount = customerTransactions.reduce((acc, t) => acc + t.amount, 0);
        return (
            customer.name.toLowerCase().includes(filter.name.toLowerCase()) &&
            (!filter.amount || totalAmount >= parseInt(filter.amount))
        );
    });

    return (
        <div className="container my-5">
            <div className="card shadow-sm p-4">
                <h1 className="text-center mb-4">Customer Transactions</h1>
                <div className="row mb-4">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by name"
                            value={filter.name}
                            onChange={e => setFilter({ ...filter, name: e.target.value })}
                        />
                    </div>
                    <div className="col">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Filter by amount"
                            value={filter.amount}
                            onChange={e => setFilter({ ...filter, amount: e.target.value })}
                        />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id}>
                                    <td>
                                        <Link className="customer-link" to={`/TransactionGraph/${customer.id}`}>
                                            {customer.name}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
