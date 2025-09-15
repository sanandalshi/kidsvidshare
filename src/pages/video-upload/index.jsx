import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../components/ui/Header';
import Header from '../../components/ui/Header';
import UploadProgressOverlay from '../../components/ui/UploadProgressOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import page components
import UploadDropZone from './components/UploadDropZone';
import FileFormatGuide from './components/FileFormatGuide';
import VideoMetadataEditor from './components/VideoMetadataEditor';
import ParentalSupervisionPanel from './components/ParentalSupervisionPanel';

const VideoUploadPage = () => {
  const navigate = useNavigate();
  const { userType, safetyStatus } = useContext(UserContext);
  
  // Upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState({});
  const [approvalStatus, setApprovalStatus] = useState('pending');

  // Error and validation states
  const [uploadErrors, setUploadErrors] = useState([]);
  const [showProgressOverlay, setShowProgressOverlay] = useState(false);

  // Mock upload simulation
  const simulateUpload = async (file) => {
    setIsUploading(true);
    setShowProgressOverlay(true);
    setUploadProgress(0);
    setUploadErrors([]);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate upload completion after 3 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadComplete(true);
      
      // Show metadata editor after upload
      setTimeout(() => {
        setShowMetadataEditor(true);
      }, 1000);
    }, 3000);
  };

  const handleFilesSelected = (files) => {
    // Validate files
    const validFiles = [];
    const errors = [];

    files?.forEach(file => {
      // Check file type
      if (!file?.type?.startsWith('video/')) {
        errors?.push(`${file?.name} is not a video file`);
        return;
      }

      // Check file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file?.size > maxSize) {
        errors?.push(`${file?.name} is too large (max 500MB)`);
        return;
      }

      // Check video duration (would need video element in real app)
      validFiles?.push(file);
    });

    if (errors?.length > 0) {
      setUploadErrors(errors);
      return;
    }

    setSelectedFiles(validFiles);
    setCurrentFileIndex(0);
    
    // Start upload simulation for first file
    if (validFiles?.length > 0) {
      simulateUpload(validFiles?.[0]);
    }
  };

  const handleMetadataChange = (metadata) => {
    setVideoMetadata(metadata);
  };

  const handleMetadataSave = (metadata) => {
    setVideoMetadata(metadata);
    setShowMetadataEditor(false);
    
    // In a real app, this would save to backend
    console.log('Saving video metadata:', metadata);
    
    // Show success message and redirect
    setTimeout(() => {
      navigate('/video-gallery', { 
        state: { 
          message: userType === 'child' ?'Your awesome video has been uploaded! 🎉' :'Video uploaded successfully!',
          uploadedVideo: {
            ...metadata,
            file: selectedFiles?.[currentFileIndex],
            uploadDate: new Date()?.toISOString(),
            status: approvalStatus
          }
        }
      });
    }, 1000);
  };

  const handleMetadataCancel = () => {
    setShowMetadataEditor(false);
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadComplete(false);
    setShowProgressOverlay(false);
  };

  const handleUploadCancel = () => {
    setIsUploading(false);
    setSelectedFiles([]);
    setUploadProgress(0);
    setShowProgressOverlay(false);
    setUploadErrors([]);
  };

  const handleUploadComplete = () => {
    setShowProgressOverlay(false);
  };

  const handleApprovalChange = (status, notes) => {
    setApprovalStatus(status);
    console.log('Parental approval:', status, notes);
  };

  // Reset states when user type changes
  useEffect(() => {
    if (!isUploading) {
      setSelectedFiles([]);
      setUploadProgress(0);
      setUploadComplete(false);
      setShowMetadataEditor(false);
      setShowProgressOverlay(false);
      setUploadErrors([]);
    }
  }, [userType, isUploading]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center mb-4 shadow-pronounced">
            <Icon name="Upload" size={32} className="text-white" />
          </div>
          <h1 className={`font-heading text-foreground mb-2 ${
            userType === 'child' ? 'text-4xl lg:text-5xl' : 'text-3xl lg:text-4xl'
          }`}>
            {userType === 'child' ? 'Share Your Amazing Videos! 🎬' : 'Upload Your Videos'}
          </h1>
          <p className={`font-caption text-text-secondary max-w-2xl mx-auto ${
            userType === 'child' ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'
          }`}>
            {userType === 'child' ? "Let's upload your awesome videos and share them with everyone! It's super easy and fun! ✨" : "Upload and share your child's videos safely with our kid-friendly platform."
            }
          </p>
        </div>

        {/* Error Messages */}
        {uploadErrors?.length > 0 && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-caption font-medium text-error mb-2">
                  {userType === 'child' ? 'Oops! Something went wrong! 😅' : 'Upload Errors'}
                </h4>
                <ul className="space-y-1">
                  {uploadErrors?.map((error, index) => (
                    <li key={index} className="text-sm font-caption text-error">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Drop Zone */}
            {!showMetadataEditor && (
              <UploadDropZone
                onFilesSelected={handleFilesSelected}
                isUploading={isUploading}
              />
            )}

            {/* Metadata Editor */}
            {showMetadataEditor && selectedFiles?.length > 0 && (
              <VideoMetadataEditor
                videoFile={selectedFiles?.[currentFileIndex]}
                onMetadataChange={handleMetadataChange}
                onSave={handleMetadataSave}
                onCancel={handleMetadataCancel}
              />
            )}

            {/* File Format Guide */}
            {!showMetadataEditor && (
              <FileFormatGuide />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parental Supervision Panel */}
            <ParentalSupervisionPanel
              onApprovalChange={handleApprovalChange}
            />

            {/* Quick Actions */}
            <div className="bg-surface rounded-2xl border border-border shadow-soft p-6">
              <h3 className={`font-heading text-foreground mb-4 ${
                userType === 'child' ? 'text-xl' : 'text-lg'
              }`}>
                {userType === 'child' ? 'Quick Actions! ⚡' : 'Quick Actions'}
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => navigate('/video-gallery')}
                  iconName="Grid3X3"
                  iconPosition="left"
                  iconSize={18}
                  fullWidth
                  className="child-friendly-button justify-start"
                >
                  {userType === 'child' ? 'See My Videos' : 'View Gallery'}
                </Button>
                
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => navigate('/video-player')}
                  iconName="Play"
                  iconPosition="left"
                  iconSize={18}
                  fullWidth
                  className="child-friendly-button justify-start"
                >
                  {userType === 'child' ? 'Watch Videos' : 'Video Player'}
                </Button>

                {userType === 'parent' && (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => navigate('/parental-dashboard')}
                    iconName="Shield"
                    iconPosition="left"
                    iconSize={18}
                    fullWidth
                    className="child-friendly-button justify-start"
                  >
                    Parent Dashboard
                  </Button>
                )}
              </div>
            </div>

            {/* Upload Tips */}
            <div className="bg-gradient-to-br from-accent/10 to-warning/10 rounded-2xl border border-accent/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="Lightbulb" size={20} className="text-accent-foreground" />
                </div>
                <h3 className={`font-heading text-foreground ${
                  userType === 'child' ? 'text-xl' : 'text-lg'
                }`}>
                  {userType === 'child' ? 'Super Tips! 💡' : 'Upload Tips'}
                </h3>
              </div>
              <ul className="space-y-2">
                <li className={`flex items-start space-x-2 font-caption text-text-secondary ${
                  userType === 'child' ? 'text-sm' : 'text-xs'
                }`}>
                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span>
                    {userType === 'child' ?'Make sure your video is fun and safe!' :'Ensure content is age-appropriate'
                    }
                  </span>
                </li>
                <li className={`flex items-start space-x-2 font-caption text-text-secondary ${
                  userType === 'child' ? 'text-sm' : 'text-xs'
                }`}>
                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span>
                    {userType === 'child' ?'Keep videos under 10 minutes long' :'Maximum 10 minutes duration'
                    }
                  </span>
                </li>
                <li className={`flex items-start space-x-2 font-caption text-text-secondary ${
                  userType === 'child' ? 'text-sm' : 'text-xs'
                }`}>
                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span>
                    {userType === 'child' ?'Add a cool title and description!' :'Add descriptive titles and tags'
                    }
                  </span>
                </li>
                <li className={`flex items-start space-x-2 font-caption text-text-secondary ${
                  userType === 'child' ? 'text-sm' : 'text-xs'
                }`}>
                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span>
                    {userType === 'child' ?'Ask a grown-up if you need help!' :'Review content before publishing'
                    }
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      {/* Upload Progress Overlay */}
      <UploadProgressOverlay
        isVisible={showProgressOverlay}
        progress={uploadProgress}
        fileName={selectedFiles?.[currentFileIndex]?.name}
        onCancel={handleUploadCancel}
        onComplete={handleUploadComplete}
      />
    </div>
  );
};

export default VideoUploadPage;