import React,{useState,useEffect} from 'react';
import ImageCard from './ImageCard';
import axios from 'axios'; 
import styles from './Resources.module.css';
import { useNavigate } from 'react-router-dom';
import { useSendData } from '../../helper/util';
// import { sendData } from '../../helper/util';

const Resources: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const navigate = useNavigate();
  const sendData = useSendData();

  
  useEffect(() => {
    
    const fetchImages = async () => {
      try {
        
        const data = await sendData('GET', 'get-resources', true);
        const response=data.resources;
        console.log('data received resources', response)
        setImages(response); 
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className={styles.container}>
      {images.map((image, index) => (
        <ImageCard 
          key={image._id} 
          id = {image._id}
          title={image.title} 
          description={image.description} 
          url={image.blur_url} 
        />
      ))}
    </div>
  );
};

export default Resources;

