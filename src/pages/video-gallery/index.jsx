import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { UserContext } from '../../components/ui/Header';
import Header from '../../components/ui/Header';
import ContentFilterBar from '../../components/ui/ContentFilterBar';
import VideoGrid from './components/VideoGrid';
import SortControls from './components/SortControls';
import FloatingUploadButton from './components/FloatingUploadButton';

const VideoGallery = () => {
  const { userType } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ sortBy: 'newest', order: 'desc' });

  // Mock video data
  const mockVideos = [
    {
      id: 1,
      title: "My Amazing Art Project",
      description: `Today I made a super cool painting with lots of colors!\nI used red, blue, yellow and green to make a rainbow.\nMommy helped me mix the colors together.`,
      thumbnail: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 180,
      views: 45,
      uploadDate: "2 days ago",
      category: "creative",
      categoryIcon: "Palette",
      tags: ["art", "painting", "colors", "creative"]
    },
    {
      id: 2,
      title: "Learning the ABC Song",
      description: `Singing my favorite ABC song!\nA-B-C-D-E-F-G... come sing along with me!\nThis helps me remember all the letters.`,
      thumbnail: "https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 120,
      views: 89,
      uploadDate: "1 week ago",
      category: "educational",
      categoryIcon: "GraduationCap",
      tags: ["abc", "learning", "song", "letters"]
    },
    {
      id: 3,
      title: "Playing with My Pet Dog",
      description: `This is my dog Buddy!\nHe loves to play fetch and run around the yard.\nBuddy is my best friend and he's so fluffy!`,
      thumbnail: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 240,
      views: 156,
      uploadDate: "3 days ago",
      category: "family",
      categoryIcon: "Heart",
      tags: ["pets", "dog", "playing", "family"]
    },
    {
      id: 4,
      title: "My Favorite Bedtime Story",
      description: `Reading 'The Three Little Pigs' before bedtime.\nOnce upon a time there were three little pigs...\nThis story teaches us to work hard and be smart!`,
      thumbnail: "https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 300,
      views: 67,
      uploadDate: "5 days ago",
      category: "stories",
      categoryIcon: "Book",
      tags: ["story", "bedtime", "reading", "pigs"]
    },
    {
      id: 5,
      title: "Dancing to My Favorite Song",
      description: `Look at me dance!\nThis is my favorite song and I love to move to the music.\nDancing makes me so happy and energetic!`,
      thumbnail: "https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 150,
      views: 234,
      uploadDate: "1 day ago",
      category: "music",
      categoryIcon: "Music",
      tags: ["dancing", "music", "fun", "movement"]
    },
    {
      id: 6,
      title: "Building with Blocks",
      description: `I built a huge castle with my colorful blocks!\nIt has towers, walls, and even a bridge.\nBuilding helps me think and be creative.`,
      thumbnail: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 210,
      views: 78,
      uploadDate: "4 days ago",
      category: "games",
      categoryIcon: "Gamepad2",
      tags: ["blocks", "building", "castle", "creative"]
    },
    {
      id: 7,
      title: "Counting Numbers 1 to 10",
      description: `Let's count together from 1 to 10!\nOne, two, three, four, five...\nCounting is fun and helps me learn math.`,
      thumbnail: "https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 90,
      views: 123,
      uploadDate: "6 days ago",
      category: "educational",
      categoryIcon: "GraduationCap",
      tags: ["numbers", "counting", "math", "learning"]
    },
    {
      id: 8,
      title: "Making Cookies with Grandma",
      description: `Grandma is teaching me how to make chocolate chip cookies!\nWe mix flour, sugar, eggs and chocolate chips.\nBaking together is so much fun!`,
      thumbnail: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: 360,
      views: 189,
      uploadDate: "1 week ago",
      category: "family",
      categoryIcon: "Heart",
      tags: ["cooking", "grandma", "cookies", "family"]
    }
  ];

  useEffect(() => {
    // Simulate loading
    const loadVideos = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVideos(mockVideos);
      setLoading(false);
    };

    loadVideos();
  }, []);

  useEffect(() => {
    let filtered = [...videos];

    // Apply category filters
    if (!activeFilters?.includes('all')) {
      filtered = filtered?.filter(video => 
        activeFilters?.includes(video?.category)
      );
    }

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(video =>
        video?.title?.toLowerCase()?.includes(query) ||
        video?.description?.toLowerCase()?.includes(query) ||
        video?.tags?.some(tag => tag?.toLowerCase()?.includes(query))
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let comparison = 0;
      
      switch (sortConfig?.sortBy) {
        case 'newest':
          // Sort by upload date (mock implementation)
          const dateA = new Date(a.uploadDate.includes('day') ? Date.now() - parseInt(a.uploadDate) * 24 * 60 * 60 * 1000 : Date.now() - 7 * 24 * 60 * 60 * 1000);
          const dateB = new Date(b.uploadDate.includes('day') ? Date.now() - parseInt(b.uploadDate) * 24 * 60 * 60 * 1000 : Date.now() - 7 * 24 * 60 * 60 * 1000);
          comparison = dateB - dateA;
          break;
        case 'popular':
          comparison = b?.views - a?.views;
          break;
        case 'alphabetical':
          comparison = a?.title?.localeCompare(b?.title);
          break;
        case 'duration':
          comparison = b?.duration - a?.duration;
          break;
        default:
          comparison = 0;
      }

      return sortConfig?.order === 'asc' ? comparison : -comparison;
    });

    setFilteredVideos(filtered);
  }, [videos, activeFilters, searchQuery, sortConfig]);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (config) => {
    setSortConfig(config);
  };

  const handleVideoUpdate = (updatedVideo) => {
    setVideos(prev => prev?.map(video => 
      video?.id === updatedVideo?.id ? updatedVideo : video
    ));
  };

  const handleVideoDelete = (videoId) => {
    setVideos(prev => prev?.filter(video => video?.id !== videoId));
  };

  return (
    <>
      <Helmet>
        <title>Video Gallery - KidsVidShare</title>
        <meta name="description" content="Browse and watch your amazing video collection in a safe, kid-friendly environment." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Filter Bar */}
        <ContentFilterBar
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {/* Main Content */}
        <main className="pb-24">
          {/* Sort Controls */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border bg-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="font-heading text-2xl lg:text-3xl text-foreground">
                  {userType === 'child' ? 'My Awesome Videos!' : 'Video Gallery'}
                </h1>
                {!loading && (
                  <div className="hidden sm:block">
                    <span className="text-sm font-caption text-text-secondary bg-muted px-3 py-1 rounded-full">
                      {filteredVideos?.length} {filteredVideos?.length === 1 ? 'video' : 'videos'}
                    </span>
                  </div>
                )}
              </div>
              
              <SortControls onSortChange={handleSortChange} />
            </div>
          </div>

          {/* Video Grid */}
          <VideoGrid
            videos={filteredVideos}
            loading={loading}
            hasFilters={!activeFilters?.includes('all') || activeFilters?.length > 1}
            searchQuery={searchQuery}
            onVideoUpdate={handleVideoUpdate}
            onVideoDelete={handleVideoDelete}
          />
        </main>

        {/* Floating Upload Button */}
        <FloatingUploadButton />
      </div>
    </>
  );
};

export default VideoGallery;