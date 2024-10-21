import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import {
	faCheck,
	faKey,
	faSave,
	faSpinner,
	faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const TelegramConfig: React.FC = () => {
	const [chatId, setChatId] = useState('');
	const [token, setToken] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [message, setMessage] = useState('');
	const [isValidated, setIsValidated] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const validateCredentials = async () => {
		if (!chatId || !token) {
			setStatus('error');
			setMessage('Vui lòng nhập cả Chat ID và Token');
			return;
		}

		setStatus('loading');
		setMessage('Đang xác thực...');

		try {
			const response = await axios.get(
				`https://api.telegram.org/bot${token}/getChat`,
				{
					params: { chat_id: chatId },
				},
			);

			if (response.data.ok) {
				setStatus('success');
				setMessage('Đã lưu cấu hình!');
				setIsValidated(true);
			} else {
				setStatus('error');
				setMessage('Thông tin không hợp lệ. Vui lòng kiểm tra lại.');
				setIsValidated(false);
			}
		} catch {
			setStatus('error');
			setMessage(
				'Thông tin không hợp lệ hoặc lỗi mạng. Vui lòng kiểm tra lại.',
			);
			setIsValidated(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		if (id === 'chatId') {
			setChatId(value);
		} else if (id === 'token') {
			setToken(value);
		}
		setIsValidated(false);
	};

	const handleSave = async () => {
		if (!isValidated) {
			await validateCredentials();
		}

		if (isValidated) {
			setIsSaving(true);
			try {
				await axios.post('/api/save-telegram-config', {
					chatId,
					token,
				});
				setStatus('success');
				setMessage('Cấu hình đã được lưu thành công!');
			} catch {
				setStatus('error');
				setMessage('Có lỗi xảy ra khi lưu cấu hình. Vui lòng thử lại.');
			} finally {
				setIsSaving(false);
			}
		}
	};

	useEffect(() => {
		axios.get('/api/get-telegram-config').then((res) => {
			setChatId(res.data.chatId);
			setToken(res.data.token);
		});
	}, []);

	return (
		<div className='container mx-auto px-4 py-8'>
			<Helmet>
				<title>Dashboard - Telegram</title>
			</Helmet>
			<h1 className='mb-6 text-3xl font-bold text-gray-800'>
				Cấu Hình Telegram
			</h1>
			<div className='rounded-lg bg-white p-6 shadow-lg'>
				<div className='mb-4'>
					<label
						htmlFor='chatId'
						className='mb-2 block text-sm font-medium text-gray-700'
					>
						Chat ID
					</label>
					<div className='relative'>
						<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
							<FontAwesomeIcon
								icon={faTelegram}
								className='text-gray-400'
							/>
						</div>
						<input
							type='text'
							id='chatId'
							value={chatId}
							onChange={handleInputChange}
							className='w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
							placeholder='Nhập Chat ID'
						/>
					</div>
				</div>
				<div className='mb-6'>
					<label
						htmlFor='token'
						className='mb-2 block text-sm font-medium text-gray-700'
					>
						Token
					</label>
					<div className='relative'>
						<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
							<FontAwesomeIcon
								icon={faKey}
								className='text-gray-400'
							/>
						</div>
						<input
							type='text'
							id='token'
							value={token}
							onChange={handleInputChange}
							className='w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
							placeholder='Nhập Token'
						/>
					</div>
				</div>
				{message && (
					<div
						className={`mb-4 rounded-md p-3 ${
							status === 'success'
								? 'bg-blue-100 text-blue-800'
								: status === 'error'
									? 'bg-red-100 text-red-800'
									: 'bg-blue-100 text-blue-800'
						}`}
					>
						<div className='flex items-center'>
							{status === 'success' && (
								<FontAwesomeIcon
									icon={faCheck}
									className='mr-2'
								/>
							)}
							{status === 'error' && (
								<FontAwesomeIcon
									icon={faTimes}
									className='mr-2'
								/>
							)}
							<span>{message}</span>
						</div>
					</div>
				)}
				<button
					onClick={handleSave}
					className='mb-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400'
					disabled={!chatId || !token || isSaving}
				>
					{isSaving ? (
						<>
							<FontAwesomeIcon
								icon={faSpinner}
								className='mr-2 animate-spin'
							/>
							Đang lưu...
						</>
					) : (
						<>
							<FontAwesomeIcon icon={faSave} className='mr-2' />
							Lưu Cấu Hình
						</>
					)}
				</button>
				<div className='mt-6'>
					<h3 className='mb-2 text-lg font-semibold text-gray-800'>
						Hướng Dẫn Lấy Chat ID và Token
					</h3>
					<div className='relative h-0 overflow-hidden pb-[56.25%]'>
						<iframe
							src='https://t.me/OvFSupport/3?embed=1'
							className='absolute left-0 top-0 h-full w-full rounded-md border-0'
							allowFullScreen
						></iframe>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TelegramConfig;
