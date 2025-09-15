import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { videoService, videoStorageService } from '../../services/videoService';
import UploadDropZone from './components/UploadDropZone';
import VideoMetadataEditor from './components/VideoMetadataEditor';
import ParentalSupervisionPanel from './components/ParentalSupervisionPanel';
import FileFormatGuide from './components/FileFormatGuide';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const VideoUploadPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  const [uploadStep, setUploadStep] = useState('select'); // select, uploading, metadata, processing
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    category: 'educational',
    contentRating: 'all_ages',
    tags: []
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadedPaths, setUploadedPaths] = useState({
    videoPath: null,
    thumbnailPath: null
  });

  // Check if user can upload videos
  const canUpload = userProfile?.role === 'parent' || 
                   userProfile?.role === 'admin' || 
                   (userProfile?.role === 'child' && userProfile?.parental_controls?.upload_enabled === true);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!canUpload) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Icon name="Lock" size={64} className="text-warning mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Upload Restricted
          </h2>
          <p className="text-text-secondary font-caption mb-6">
            You don't have permission to upload videos. Please contact a parent or administrator.
          </p>
          <Button
            onClick={() => navigate('/video-gallery')}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setVideoData(prev => ({
      ...prev,
      title: file?.name?.replace(/\.[^/.]+$/, '') // Remove file extension
    }));
    setUploadStep('metadata');
    setError(null);
  };

  const handleThumbnailSelect = (file) => {
    setThumbnailFile(file);
  };

  const validateVideoFile = (file) => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'];

    if (file?.size > maxSize) {
      throw new Error('Video file must be smaller than 500MB');
    }

    if (!allowedTypes?.includes(file?.type)) {
      throw new Error('Only MP4, WebM, QuickTime and OGG video files are allowed');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !videoData?.title?.trim()) {
      setError('Please provide a title and select a video file');
      return;
    }

    try {
      validateVideoFile(selectedFile);
      setUploadStep('uploading');
      setError(null);

      // Upload video file
      setUploadProgress(20);
      const videoUpload = await videoStorageService?.uploadVideo(
        selectedFile, 
        user?.id,
        (progress) => {
          setUploadProgress(20 + (progress * 0.6)); // 20% to 80%
        }
      );

      // Upload thumbnail if provided
      let thumbnailUpload = null;
      if (thumbnailFile) {
        setUploadProgress(80);
        thumbnailUpload = await videoStorageService?.uploadThumbnail(thumbnailFile, user?.id);
      }

      setUploadProgress(90);

      // Get video duration (mock - in production you'd use video metadata)
      const videoDuration = await getVideoDuration(selectedFile);

      // Create video record in database
      const newVideo = await videoService?.createVideo({
        title: videoData?.title?.trim(),
        description: videoData?.description?.trim(),
        uploaderId: user?.id,
        filePath: videoUpload?.path,
        thumbnailPath: thumbnailUpload?.path || null,
        durationSeconds: Math.floor(videoDuration),
        fileSizeBytes: selectedFile?.size,
        mimeType: selectedFile?.type,
        category: videoData?.category,
        contentRating: videoData?.contentRating,
        tags: videoData?.tags
      });

      setUploadProgress(100);
      setUploadStep('processing');

      // Navigate to video gallery after short delay
      setTimeout(() => {
        navigate('/video-gallery');
      }, 2000);

    } catch (err) {
      setError(err?.message);
      setUploadStep('metadata');
    }
  };

  // Mock function to get video duration
  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration || 0);
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  };

  const handleMetadataChange = (field, value) => {
    setVideoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    if (uploadStep === 'metadata') {
      setUploadStep('select');
      setSelectedFile(null);
      setThumbnailFile(null);
      setVideoData({
        title: '',
        description: '',
        category: 'educational',
        contentRating: 'all_ages',
        tags: []
      });
    } else if (uploadStep === 'uploading' || uploadStep === 'processing') {
      // Cannot go back during upload
      return;
    } else {
      navigate('/video-gallery');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Upload Video
            </h1>
            <p className="text-sm text-text-secondary font-caption mt-1">
              Share your creative content with the community
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleBack}
            iconName="ArrowLeft"
            iconPosition="left"
            disabled={uploadStep === 'uploading' || uploadStep === 'processing'}
          >
            Back
          </Button>
        </div>

        {/* Upload Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              ['select', 'metadata', 'uploading', 'processing']?.includes(uploadStep) 
                ? 'text-primary' : 'text-text-secondary'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['select', 'metadata', 'uploading', 'processing']?.includes(uploadStep)
                  ? 'bg-primary text-white' : 'bg-muted text-text-secondary'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Select File</span>
            </div>

            <div className={`flex-1 h-0.5 ${
              ['metadata', 'uploading', 'processing']?.includes(uploadStep)
                ? 'bg-primary' : 'bg-muted'
            }`}></div>

            <div className={`flex items-center space-x-2 ${
              ['metadata', 'uploading', 'processing']?.includes(uploadStep)
                ? 'text-primary' : 'text-text-secondary'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['metadata', 'uploading', 'processing']?.includes(uploadStep)
                  ? 'bg-primary text-white' : 'bg-muted text-text-secondary'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Video Details</span>
            </div>

            <div className={`flex-1 h-0.5 ${
              ['uploading', 'processing']?.includes(uploadStep)
                ? 'bg-primary' : 'bg-muted'
            }`}></div>

            <div className={`flex items-center space-x-2 ${
              ['uploading', 'processing']?.includes(uploadStep)
                ? 'text-primary' : 'text-text-secondary'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['uploading', 'processing']?.includes(uploadStep)
                  ? 'bg-primary text-white' : 'bg-muted text-text-secondary'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Upload</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-error/10 border border-error/20 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
              <p className="text-error">{error}</p>
            </div>
          </div>
        )}

        {/* Content based on upload step */}
        {uploadStep === 'select' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <UploadDropZone 
                onFileSelect={handleFileSelect}
                onFilesSelected={handleFileSelect}
                isUploading={uploadStep === 'uploading'}
              />
            </div>
            <div className="lg:col-span-1">
              <FileFormatGuide />
            </div>
          </div>
        )}

        {uploadStep === 'metadata' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VideoMetadataEditor
                videoData={videoData}
                onChange={handleMetadataChange}
                videoFile={selectedFile}
                onMetadataChange={handleMetadataChange}
                onSave={handleUpload}
                onCancel={handleBack}
                selectedFile={selectedFile}
                thumbnailFile={thumbnailFile}
                onThumbnailSelect={handleThumbnailSelect}
              />
              
              <div className="mt-8">
                <Button
                  onClick={handleUpload}
                  fullWidth
                  size="lg"
                  iconName="Upload"
                  iconPosition="left"
                  disabled={!videoData?.title?.trim()}
                >
                  Upload Video
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <ParentalSupervisionPanel 
                userProfile={userProfile}
                videoData={videoData}
                onApprovalChange={() => {}}
              />
            </div>
          </div>
        )}

        {(uploadStep === 'uploading' || uploadStep === 'processing') && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-surface border border-border rounded-2xl p-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {uploadStep === 'uploading' ? (
                  <Icon name="Upload" size={32} className="text-primary" />
                ) : (
                  <Icon name="Settings" size={32} className="text-primary animate-spin" />
                )}
              </div>
              
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                {uploadStep === 'uploading' ? 'Uploading Video...' : 'Processing Video...'}
              </h3>
              
              <p className="text-text-secondary font-caption mb-6">
                {uploadStep === 'uploading' ? 'Please wait while your video is being uploaded' : 'Your video is being processed and will be available shortly'}
              </p>

              <div className="w-full bg-muted rounded-full h-3 mb-4">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-text-secondary font-caption">
                {uploadProgress}% complete
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploadPage;