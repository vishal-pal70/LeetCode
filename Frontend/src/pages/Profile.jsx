import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosClient'; 

function Profile() {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosClient.get(`/user/profile/${id}`);
                setUserData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="bg-red-900 text-red-200 border border-red-700 px-4 py-3 rounded max-w-md">
                    <strong>Error: </strong> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-900 min-h-screen">
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Profile Header - Yellow Gradient */}
                <div className="bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 p-6 text-white">
                    <div className="flex items-center">
                        {userData.avatar ? (
                            <img 
                                src={userData.avatar} 
                                alt={userData.name} 
                                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-500/30 mr-6"
                            />
                        ) : (
                            <div className="bg-gray-700 border-2 border-dashed border-yellow-500/30 rounded-xl w-24 h-24 mr-6" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold">{userData.firstName}</h1>
                            <p className="text-yellow-100">{userData.title || 'No title specified'}</p>
                            <div className="flex mt-2 space-x-2">
                                <span className="bg-yellow-700 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                                    {userData.followers || 0} Followers
                                </span>
                                <span className="bg-yellow-700 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                                    {userData.following || 0} Following
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-yellow-400 mb-2">Contact Information</h2>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <span className="text-gray-400 w-24">Email:</span>
                                    <span className="text-gray-200">{userData.emailId || 'N/A'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-gray-400 w-24">Phone:</span>
                                    <span className="text-gray-200">{userData.role || 'N/A'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-gray-400 w-24">Location:</span>
                                    <span className="text-gray-200">{userData.location || 'N/A'}</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-yellow-400 mb-2">Professional Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {userData.skills?.length > 0 ? (
                                    userData.skills.map((skill, index) => (
                                        <span 
                                            key={index}
                                            className="bg-yellow-900 text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No skills listed</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <h2 className="text-lg font-semibold text-yellow-400 mb-2">About Me</h2>
                        <p className="text-gray-400">{userData.bio || 'No bio available'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;