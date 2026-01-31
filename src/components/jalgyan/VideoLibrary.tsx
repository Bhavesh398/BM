'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Helper function to extract YouTube video ID from URL
function getYouTubeId(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
}

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
}

const videos: Video[] = [
    {
        id: '1',
        title: 'Water pollution | Water Contamination',
        description: 'Lets Learn the Causes, Effects and Ways to Stop Water Pollution.',
        thumbnail: 'https://img.youtube.com/vi/Om42Lppkd9w/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=Om42Lppkd9w',
    },
    {
        id: '2',
        title: 'Fresh water scarcity: An introduction to the problem',
        description: 'Fresh water is essential for life -- and there is not nearly enough of it.',
        thumbnail: 'https://img.youtube.com/vi/otrpxtAmDAk/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=otrpxtAmDAk',
    },
    {
        id: '3',
        title: 'What Is Water Pollution | Environmental Chemistry',
        description: 'Learn the basics about water pollution and environmental chemistry.',
        thumbnail: 'https://img.youtube.com/vi/Zk1J2EW-nmQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=Zk1J2EW-nmQ',
    },
    {
        id: '4',
        title: 'What really happens to the plastic you throw away',
        description: 'We’ve all been told that we should recycle plastic bottles, but what actually happens to the plastic?',
        thumbnail: 'https://img.youtube.com/vi/_6xlNyWPpB8/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=_6xlNyWPpB8',
    },
];

export function VideoLibrary() {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleVideoClick = (video: Video) => {
        setSelectedVideo(video);
        setIsDialogOpen(true);
    };

    return (
        <>
            <div className="space-y-8">
                {/* Section Header */}
                <div className="text-center">
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                        Educational Video Library
                    </h3>
                    <p className="text-lg text-muted-foreground">
                        Life-saving techniques and water safety knowledge
                    </p>
                </div>

                {/* Video Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group cursor-pointer"
                            onClick={() => handleVideoClick(video)}
                        >
                            <div className="relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-muted flex items-center justify-center">
                                    {/* Thumbnail Image */}
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Play Button Overlay */}
                                    <div className="relative z-10 w-16 h-16 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all flex items-center justify-center shadow-lg">
                                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                    </div>

                                    {/* Video Number Badge */}
                                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white font-bold text-sm">
                                        {video.id}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {video.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {video.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Video Dialog Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl bg-background border-border p-0 overflow-hidden [&>button]:hidden">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="text-2xl text-foreground mb-2">
                            {selectedVideo?.title}
                        </DialogTitle>
                        <p className="text-muted-foreground">
                            {selectedVideo?.description}
                        </p>
                    </DialogHeader>

                    {/* Video Player - Using iframe for reliable YouTube playback */}
                    <div className="aspect-video bg-black">
                        {selectedVideo && isDialogOpen && (
                            <iframe
                                key={selectedVideo.url}
                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
