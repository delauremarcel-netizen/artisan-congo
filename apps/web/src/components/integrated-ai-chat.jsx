import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimatedText } from '@/hooks/use-animated-text.jsx';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import { Sparkles, X, Trash2, Paperclip, Send, Loader2 } from 'lucide-react';

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const getImageKey = file => `${file.name}:${file.size}:${file.lastModified}`;

export default function IntegratedAiChat({ onClose }) {
	const [input, setInput] = useState('');
	const [selectedImages, setSelectedImages] = useState([]);
	const { messages, isStreaming, isLoadingHistory, sendMessage, clearMessages } = useIntegratedAi();
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);

	const imagePreviews = useMemo(() => selectedImages.map(file => ({
		key: getImageKey(file),
		file,
		url: URL.createObjectURL(file),
	})), [selectedImages]);

	useEffect(() => () => {
		imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
	}, [imagePreviews]);

	const lastMessage = messages[messages.length - 1];
	const isLastMessageStreaming = isStreaming && lastMessage?.role === 'assistant';
	const animatedText = useAnimatedText(isLastMessageStreaming ? lastMessage.content : '');

	useEffect(() => {
		const scrollToBottom = () => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
				});
			}
		};
		scrollToBottom();
	}, [messages, animatedText]);

	const handleSubmit = useCallback((e) => {
		e.preventDefault();
		const trimmed = input.trim();
		if ((!trimmed && selectedImages.length === 0) || isStreaming) return;
		setInput('');
		sendMessage(trimmed, selectedImages);
		setSelectedImages([]);
	}, [input, selectedImages, isStreaming, sendMessage]);

	const handleImageSelect = useCallback((e) => {
		const files = Array.from(e.target.files || []);
		const validFiles = files.filter(file => VALID_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE);
		setSelectedImages((prev) => {
			const uniqueFilesMap = new Map(prev.map(file => [getImageKey(file), file]));
			validFiles.forEach(file => uniqueFilesMap.set(getImageKey(file), file));
			return Array.from(uniqueFilesMap.values()).slice(0, MAX_IMAGES);
		});
		if (fileInputRef.current) fileInputRef.current.value = '';
	}, [fileInputRef]);

	const removeImage = useCallback((index) => {
		setSelectedImages(prev => prev.filter((_, i) => i !== index));
	}, []);

	return (
		<div className="flex flex-col h-full w-full bg-background">
			{/* Header */}
			<div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shrink-0 shadow-md z-10">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
						<Sparkles className="w-5 h-5 text-white" />
					</div>
					<div>
						<h3 className="font-serif text-lg font-semibold m-0 leading-tight tracking-wide">
							Assistant Kongo
						</h3>
						<p className="text-xs text-primary-foreground/80 font-medium tracking-wide mt-0.5">
							En ligne • 24/7
						</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					{messages.length > 0 && (
						<button
							onClick={clearMessages}
							disabled={isStreaming}
							className="text-primary-foreground/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all disabled:opacity-50"
							title="Effacer l'historique"
						>
							<Trash2 className="w-5 h-5" />
						</button>
					)}
					{onClose && (
						<button
							onClick={onClose}
							className="text-primary-foreground/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
							aria-label="Fermer"
						>
							<X className="w-6 h-6" />
						</button>
					)}
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-muted/30">
				{isLoadingHistory && (
					<div className="flex justify-center items-center py-8 text-muted-foreground">
						<Loader2 className="w-6 h-6 animate-spin mr-2" />
						<span className="text-sm">Chargement de l'historique...</span>
					</div>
				)}
				
				{!isLoadingHistory && messages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full text-center px-4 text-muted-foreground space-y-3">
						<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
							<Sparkles className="w-8 h-8 text-primary" />
						</div>
						<p className="text-sm max-w-[250px]">
							Bonjour ! Je suis Kongo, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?
						</p>
					</div>
				)}

				{messages.map((msg, i) => {
					const isLastStreamingMessage = isStreaming && i === messages.length - 1 && msg.role === 'assistant';
					const displayContent = isLastStreamingMessage ? animatedText : msg.content;

					return (
						<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div
								className={`px-4 py-2.5 max-w-[85%] shadow-sm ${
									msg.role === 'user'
										? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
										: 'bg-card text-foreground border border-border rounded-2xl rounded-tl-sm'
								}`}
							>
								<p className="whitespace-pre-wrap text-sm leading-relaxed">{displayContent}</p>
								{msg.images?.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-2">
										{msg.images.map((url, j) => (
											<img
												key={j}
												src={url}
												alt="Contenu"
												className="rounded-lg max-w-full h-auto max-h-[200px] object-cover border border-border/50"
											/>
										))}
									</div>
								)}
								{msg.role === 'assistant' && isStreaming && i === messages.length - 1 && !msg.content && (
									<div className="flex items-center gap-1 h-5">
										<span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
										<span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
										<span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef} className="h-1" />
			</div>

			{/* Input Area */}
			<div className="p-3 bg-card border-t border-border">
				{selectedImages.length > 0 && (
					<div className="mb-3 flex gap-2 flex-wrap px-1">
						{imagePreviews.map(({ key, file, url }, index) => (
							<div key={key} className="relative group">
								<img
									src={url}
									alt={file.name}
									className="w-16 h-16 object-cover rounded-lg border border-border"
								/>
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm"
								>
									<X className="w-3 h-3" />
								</button>
							</div>
						))}
					</div>
				)}
				<form onSubmit={handleSubmit} className="flex items-end gap-2">
					<input
						ref={fileInputRef}
						type="file"
						accept={VALID_IMAGE_TYPES.join(',')}
						multiple
						onChange={handleImageSelect}
						className="hidden"
						disabled={isStreaming || isLoadingHistory}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="shrink-0 rounded-full w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
						disabled={isStreaming || isLoadingHistory || selectedImages.length >= MAX_IMAGES}
						title="Joindre une image"
					>
						<Paperclip className="w-5 h-5" />
					</button>
					<div className="flex-1 relative">
						<textarea
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(e);
								}
							}}
							placeholder="Écrivez votre message..."
							className="w-full max-h-[120px] min-h-[40px] rounded-2xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
							disabled={isStreaming || isLoadingHistory}
							rows={1}
						/>
					</div>
					<button
						type="submit"
						disabled={isStreaming || (!input.trim() && selectedImages.length === 0)}
						className="shrink-0 rounded-full w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Send className="w-4 h-4 ml-0.5" />
					</button>
				</form>
			</div>
		</div>
	);
}