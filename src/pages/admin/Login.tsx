import Logo from '@/assets/images/logo.png';
import {
	faEye,
	faEyeSlash,
	faGlobe,
	faLock,
	faSpinner,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Login: React.FC = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const usernameInputRef = useRef<HTMLInputElement>(null);
	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isLoading) {
			return;
		}
		setIsLoading(true);
		if (!username || !password) {
			if (username) {
				passwordInputRef.current?.focus();
			} else {
				usernameInputRef.current?.focus();
			}
			toast.warning('Vui lòng nhập đẩy đủ thông tin!');
			return;
		}
		submitButtonRef.current?.focus();
		setIsLoading(false);
		axios.post('/api/login', { username, password }).then((res) => {
			if (res.status === 200) {
				toast.success('Đăng nhập thành công!');
				navigate('/admin/dashboard');
			} else {
				toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
			}
		});
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className='flex h-screen w-full items-center justify-center bg-gray-100'>
			<Helmet>
				<title>Đăng nhập</title>
			</Helmet>
			<div className='flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl'>
				<div className='hidden w-1/2 items-center justify-center bg-blue-600 p-12 md:flex'>
					<img src={Logo} alt='Logo' className='max-w-full' />
				</div>
				<div className='w-full p-8 md:w-1/2'>
					<h2 className='mb-6 text-2xl font-bold text-gray-800'>
						Đăng nhập
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label
								htmlFor='username'
								className='text-sm font-medium text-gray-700'
							>
								Tên đăng nhập
							</label>
							<div className='relative mt-1 rounded-md p-2 shadow-sm'>
								<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
									<FontAwesomeIcon
										icon={faUser}
										className='text-gray-400'
									/>
								</div>
								<input
									type='text'
									id='username'
									ref={usernameInputRef}
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									className='block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
									placeholder='Nhập tên đăng nhập'
									autoComplete='off'
									autoFocus
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor='password'
								className='text-sm font-medium text-gray-700'
							>
								Mật khẩu
							</label>
							<div className='relative mt-1 rounded-md p-2 shadow-sm'>
								<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
									<FontAwesomeIcon
										icon={faLock}
										className='text-gray-400'
									/>
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									id='password'
									ref={passwordInputRef}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className='block w-full rounded-md border-gray-300 pl-7 pr-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
									placeholder='Nhập mật khẩu'
								/>
								{password && (
									<button
										type='button'
										className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600'
										onClick={togglePasswordVisibility}
									>
										<FontAwesomeIcon
											icon={
												showPassword
													? faEyeSlash
													: faEye
											}
										/>
									</button>
								)}
							</div>
						</div>
						<div>
							<button
								type='submit'
								ref={submitButtonRef}
								className='w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
								disabled={isLoading}
							>
								{isLoading ? (
									<span className='flex items-center justify-center gap-2'>
										<FontAwesomeIcon
											icon={faSpinner}
											className='animate-spin'
										/>
										Đang đăng nhập...
									</span>
								) : (
									'Đăng nhập'
								)}
							</button>
						</div>
					</form>
					<div className='mt-6 text-center'>
						<a
							href='https://ovfteam.com'
							target='_blank'
							rel='noopener noreferrer'
							title='Liên hệ support'
							className='text-sm text-blue-600 hover:text-blue-500'
						>
							<FontAwesomeIcon icon={faGlobe} className='mr-2' />
							Liên hệ hỗ trợ
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
