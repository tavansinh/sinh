import NavBar from '@/pages/admin/NavBar';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

const Dashboard: React.FC = () => {
	return (
		<div className='flex min-h-screen w-full flex-col bg-gray-100'>
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<NavBar />
			<Outlet />
		</div>
	);
};

export default Dashboard;
