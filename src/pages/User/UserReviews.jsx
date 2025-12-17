import AccountLayout from '../../components/Layout/AccountLayout';

const UserReviews = () => {
    return (
        <AccountLayout>
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-xl font-bold mb-4">My Reviews</h1>
                <p className="text-gray-500">You haven't written any reviews yet.</p>
            </div>
        </AccountLayout>
    );
};

export default UserReviews;
