import AccountLayout from '../../components/Layout/AccountLayout';

const UserPayment = () => {
    return (
        <AccountLayout>
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-xl font-bold mb-4">Payment Options</h1>
                <p className="text-gray-500">Manage your saved payment methods.</p>
            </div>
        </AccountLayout>
    );
};

export default UserPayment;
