import Logo from '@/assets/images/logo.png';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkLogin = async () => {
			try {
				const res = await axios.post('/api/check-login');
				if (res.status === 200) {
					if (
						location.pathname === '/admin' ||
						location.pathname === '/admin/'
					) {
						navigate('/admin/dashboard');
					} else {
						return;
					}
				} else {
					navigate('/admin');
				}
			} catch {
				navigate('/admin');
			} finally {
				setIsLoading(false);
			}
		};

		checkLogin();
	}, [navigate]);

	if (isLoading) {
		return (
			<div className='flex h-screen w-full items-center justify-center'>
				<FontAwesomeIcon
					icon={faSpinner}
					className='animate-spin text-4xl'
				/>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<link rel='shortcut icon' href={Logo} type='image/png' />
			</Helmet>
			<div className='flex min-h-screen flex-col items-center justify-center md:hidden'>
				<p className='text-center text-lg font-semibold'>
					Vui lòng truy cập trên máy tính!
				</p>
			</div>
			<div className='hidden min-h-screen md:flex'>
				<Outlet />
				<ToastContainer hideProgressBar />
				<a
					href='https://t.me/Emoryst97'
					target='_blank'
					rel='noopener noreferrer'
					className='fixed bottom-4 right-10 flex items-center gap-2 transition-all duration-300 hover:scale-105 focus:outline-none'
				>
					<FontAwesomeIcon
						icon={faTelegram}
						className='text-4xl text-blue-500'
					/>
					<p className='text-xl'>@Emoryst97</p>
				</a>
			</div>
		</>
	);
};

export default Admin;
