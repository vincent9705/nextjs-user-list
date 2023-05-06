import { useState, useEffect } from 'react';
import { Table, useAsyncList, useCollator } from "@nextui-org/react";

export default function UsersPage() {
    const collator = useCollator({ numeric: true });
    const [users, setUsers] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    async function load() {
        const queryParams = new URLSearchParams();
        if (username.trim())
            queryParams.append('username', ucfirst(username));

        if (email.trim())
            queryParams.append('email', ucfirst(email));

        if (phone.trim())
            queryParams.append('phone', phone);

        const res = await fetch(`https://jsonplaceholder.typicode.com/users?${queryParams.toString()}`);
        const data = await res.json();
        setUsers(data);

        return {
            items: data,
        };
    }

    async function sort({ items, sortDescriptor }) {
        return {
            items: items.sort((a, b) => {
                let first = a[sortDescriptor.column];
                let second = b[sortDescriptor.column];
                let cmp = collator.compare(first, second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }),
        };
    }
    const list = useAsyncList({ load, sort });

    function handleUsernameChange(event, setChange) {
        setChange(event.target.value);
    }

    function reloadList() {
        list.reload();
    }

    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (users)
        return (
            <div className='p-3'>
                <form className='mb-3'>
                    <div class="grid gap-6 mb-6 md:grid-cols-4">
                        <input id="txtUsername" value={username} onChange={(e) => handleUsernameChange(e, setUsername)} placeholder='Username' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'/>
                        <input id="txtEmail" value={email} onChange={(e) => handleUsernameChange(e, setEmail)} placeholder='Email' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'/>
                        <input id="txtPhone" value={phone} onChange={(e) => handleUsernameChange(e, setPhone)} placeholder='Phone' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'/>
                        <a onClick={reloadList} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Search</a>
                    </div>
                </form>
                {users.length === 0 ? (
                    
                    <p className='text-center pt-3'>No records found.</p>
                    
                ) : (
                <Table
                    aria-label="Example static collection table"
                    css={{ minWidth: "100%"}}
                    sortDescriptor={list.sortDescriptor}
                    onSortChange={list.sort}
                >
                    <Table.Header>
                        <Table.Column key="username" allowsSorting>Username</Table.Column>
                        <Table.Column key="email" allowsSorting>Email</Table.Column>
                        <Table.Column key="phone" allowsSorting>Phone</Table.Column>
                    </Table.Header>
                    <Table.Body items={list.items} loadingState={list.loadingState}>
                        {(item) => (
                            <Table.Row key={item.name}>
                                {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
                            </Table.Row>
                        )}
                    </Table.Body>
                    <Table.Pagination
                        shadow
                        noMargin
                        align="center"
                        rowsPerPage={5}
                    />
                </Table>)}
            </div>
        );
    else
        return (<>
            <div className="flex justify-center items-center h-screen">
                <div className="relative">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900"></div>
                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-900 z-10">Loading...</p>
                </div>
            </div>
        </>)
}
