import AccountLayout from '../../components/Layout/AccountLayout';

const UserAddress = () => {
    return (
        <AccountLayout>
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-xl font-bold mb-4">Address Book</h1>
                <p className="text-gray-500">Manage your shipping addresses here.</p>
                <button className="btn-primary mt-4">Add New Address</button>
            </div>
        </AccountLayout>
    );
};

export default UserAddress;
