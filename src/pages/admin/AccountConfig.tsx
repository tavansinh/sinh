import {
	faEye,
	faEyeSlash,
	faLock,
	faSave,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AccountConfig: React.FC = () => {
	const [username, setUsername] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!currentPassword || !newPassword) {
				toast.error('Vui lòng điền đầy đủ thông tin');
				return;
			}
			try {
				await axios.post('/api/save-account-config', {
					username: username,
					currentPassword: currentPassword,
					newPassword: newPassword,
				});
				toast.success('Cập nhật thông tin tài khoản thành công!');
			} catch {
				toast.error('Cập nhật thông tin tài khoản thất bại!');
			}
		},
		[currentPassword, newPassword, username],
	);

	const togglePasswordVisibility = (field: 'current' | 'new') => {
		if (field === 'current') {
			setShowCurrentPassword(!showCurrentPassword);
		} else {
			setShowNewPassword(!showNewPassword);
		}
	};

	useEffect(() => {
		axios.get('/api/get-account-config').then((res) => {
			setUsername(res.data.username);
		});
	}, []);

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='mb-6 text-3xl font-bold text-gray-800'>
				Cấu Hình Tài Khoản
			</h1>
			<div className='rounded-lg bg-white p-6 shadow-lg'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label
							htmlFor='username'
							className='block text-sm font-medium text-gray-700'
						>
							Tên đăng nhập
						</label>
						<div className='relative mt-1 rounded-md shadow-sm'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faUser}
									className='text-gray-400'
								/>
							</div>
							<input
								type='text'
								id='username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='block w-full rounded-md border-gray-300 pl-10 pr-10 focus:border-blue-500 focus:ring-blue-500'
								placeholder='Nhập tên đăng nhập'
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='currentPassword'
							className='block text-sm font-medium text-gray-700'
						>
							Mật khẩu hiện tại
						</label>
						<div className='relative mt-1 rounded-md shadow-sm'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faLock}
									className='text-gray-400'
								/>
							</div>
							<input
								type={showCurrentPassword ? 'text' : 'password'}
								id='currentPassword'
								value={currentPassword}
								onChange={(e) =>
									setCurrentPassword(e.target.value)
								}
								className='block w-full rounded-md border-gray-300 pl-10 pr-10 focus:border-blue-500 focus:ring-blue-500'
								placeholder='Nhập mật khẩu hiện tại'
							/>
							{currentPassword && (
								<button
									type='button'
									className='absolute inset-y-0 right-0 flex items-center pr-3'
									onClick={() =>
										togglePasswordVisibility('current')
									}
								>
									<FontAwesomeIcon
										icon={
											showCurrentPassword
												? faEyeSlash
												: faEye
										}
										className='text-gray-400 hover:text-gray-500'
									/>
								</button>
							)}
						</div>
					</div>

					<div>
						<label
							htmlFor='newPassword'
							className='block text-sm font-medium text-gray-700'
						>
							Mật khẩu mới
						</label>
						<div className='relative mt-1 rounded-md shadow-sm'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faLock}
									className='text-gray-400'
								/>
							</div>
							<input
								type={showNewPassword ? 'text' : 'password'}
								id='newPassword'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className='block w-full rounded-md border-gray-300 pl-10 pr-10 focus:border-blue-500 focus:ring-blue-500'
								placeholder='Nhập mật khẩu mới'
							/>
							{newPassword && (
								<button
									type='button'
									className='absolute inset-y-0 right-0 flex items-center pr-3'
									onClick={() =>
										togglePasswordVisibility('new')
									}
								>
									<FontAwesomeIcon
										icon={
											showNewPassword ? faEyeSlash : faEye
										}
										className='text-gray-400 hover:text-gray-500'
									/>
								</button>
							)}
						</div>
					</div>

					<div>
						<button
							type='submit'
							className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
						>
							<FontAwesomeIcon icon={faSave} className='mr-2' />
							Lưu Thay Đổi
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AccountConfig;
