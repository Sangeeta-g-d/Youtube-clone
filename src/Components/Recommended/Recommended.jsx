import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { API_KEY, value_converter } from '../../data';
import { Link } from 'react-router-dom';

const Recommended = ({ categoryId }) => {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!categoryId) return;

        let relatedVideoUrl;

        if (!isNaN(categoryId)) {
            relatedVideoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=IN&videoCategoryId=${categoryId}&maxResults=45&key=${API_KEY}`;
        } else {
            relatedVideoUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${categoryId}&maxResults=45&key=${API_KEY}`;
        }

        try {
            const response = await fetch(relatedVideoUrl);
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${errorDetails.error.message}`);
            }
            const data = await response.json();

            if (data.items && !data.items[0]?.id?.videoId) {
                const videoIds = data.items.map(item => item.id.videoId).filter(id => id);
                if (videoIds.length > 0) {
                    const detailsResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIds.join(',')}&key=${API_KEY}`);
                    const detailsData = await detailsResponse.json();
                    setApiData(detailsData.items || []);
                } else {
                    setApiData([]);
                }
            } else {
                setApiData(data.items || []);
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching recommended videos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='recommended'>
            {apiData.length > 0 ? (
                apiData.map((item) => (
                    item.snippet && item.snippet.thumbnails?.medium?.url ? (
                        <Link 
                            key={item.id.videoId || item.id || item.etag} // Unique key
                            to={`/video/${item.snippet.categoryId || categoryId}/${item.id.videoId || item.id}`} 
                            className='side-video-list'
                        >
                            <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
                            <div className="vid-info">
                                <h4>{item.snippet.title}</h4>
                                <p>{item.snippet.channelTitle}</p>
                            </div>
                        </Link>
                    ) : null
                ))
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default Recommended;
