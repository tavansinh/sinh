import Logo from '@/assets/images/logo.png';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import {
	faBars,
	faGlobe,
	faSignOutAlt,
	faTimes,
	faTools,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
type NavItem = {
	id: string;
	icon: typeof faTelegram;
	text: string;
	link: string;
};

const navItems: NavItem[] = [
	{
		id: 'telegram',
		icon: faTelegram,
		text: 'Telegram Config',
		link: '/admin/dashboard/telegram-config',
	},
	{
		id: 'website',
		icon: faGlobe,
		text: 'Website Config',
		link: '/admin/dashboard/website-config',
	},
	{
		id: 'account',
		icon: faUser,
		text: 'Account Config',
		link: '/admin/dashboard/account-config',
	},
	{
		id: 'control',
		icon: faTools,
		text: 'Điều khiển realtime',
		link: '/admin/dashboard/control',
	},
];

const NavBar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = useCallback(() => {
		axios.post('/api/logout');
		navigate('/admin');
	}, [navigate]);

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prev) => !prev);
	}, []);

	const closeMenu = useCallback(() => {
		setIsMenuOpen(false);
	}, []);

	const isActive = useCallback(
		(path: string) => location.pathname === path,
		[location],
	);

	const renderNavItem = useCallback(
		(item: NavItem) => (
			<Link
				key={item.id}
				to={item.link}
				className={`rounded-md px-3 py-2 text-sm font-medium transition duration-150 ease-in-out ${
					isActive(item.link)
						? 'bg-blue-700 text-white'
						: 'text-blue-100 hover:bg-blue-700 hover:text-white'
				}`}
				onClick={closeMenu}
			>
				<FontAwesomeIcon icon={item.icon} className='mr-2' />
				{item.text}
			</Link>
		),
		[isActive, closeMenu],
	);
	return (
		<nav className='sticky top-0 z-50 w-full bg-blue-600 shadow-lg'>
			<div className='mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 items-center justify-between'>
					<div className='flex items-center'>
						<Link to='/admin/dashboard' className='flex-shrink-0'>
							<img className='h-8 w-auto' src={Logo} alt='Logo' />
						</Link>
					</div>
					<div className='hidden md:block'>
						<div className='ml-10 flex items-baseline space-x-4'>
							{navItems.map(renderNavItem)}
							<button
								onClick={handleLogout}
								className='rounded-md px-3 py-2 text-sm font-medium text-blue-100 transition duration-150 ease-in-out hover:bg-blue-700 hover:text-white'
							>
								<FontAwesomeIcon
									icon={faSignOutAlt}
									className='mr-2'
								/>
								Đăng xuất
							</button>
						</div>
					</div>
					<div className='md:hidden'>
						<button
							onClick={toggleMenu}
							className='inline-flex items-center justify-center rounded-md p-2 text-blue-100 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800'
							aria-expanded={isMenuOpen}
						>
							<span className='sr-only'>Open main menu</span>
							<FontAwesomeIcon
								icon={isMenuOpen ? faTimes : faBars}
								className='h-6 w-6'
								aria-hidden='true'
							/>
						</button>
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div className='md:hidden'>
					<div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
						{navItems.map(renderNavItem)}
						<button
							onClick={() => {
								handleLogout();
								closeMenu();
							}}
							className='block w-full rounded-md px-3 py-2 text-left text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white'
						>
							<FontAwesomeIcon
								icon={faSignOutAlt}
								className='mr-2'
							/>
							Logout
						</button>
					</div>
				</div>
			)}
		</nav>
	);
};

export default NavBar;
